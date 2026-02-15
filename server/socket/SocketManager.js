const Match = require('../models/Match');
const User = require('../models/User');
const { getBoardState, getGameResult, validateMove } = require('./gameLogic');

class SocketManager {
    constructor(io) {
        this.io = io;
        this.matchmakingQueue = []; // Players waiting for random match
        this.activeRooms = new Map(); // roomCode -> room data
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log(`User connected: ${socket.id}`);

            // Join matchmaking queue
            socket.on('matchmaking:join', (data) => this.handleMatchmakingJoin(socket, data));

            // Leave matchmaking queue
            socket.on('matchmaking:leave', () => this.handleMatchmakingLeave(socket));

            // Create private room
            socket.on('room:create', (data) => this.handleRoomCreate(socket, data));

            // Join private room
            socket.on('room:join', (data) => this.handleRoomJoin(socket, data));

            // Make a move
            socket.on('game:move', (data) => this.handleGameMove(socket, data));

            // Leave room
            socket.on('room:leave', () => this.handleRoomLeave(socket));

            // Disconnect
            socket.on('disconnect', () => this.handleDisconnect(socket));
        });
    }

    handleMatchmakingJoin(socket, data) {
        const { userId, username } = data;

        // Check if already in queue
        if (this.matchmakingQueue.find(p => p.userId === userId)) {
            return;
        }

        // Add to queue
        this.matchmakingQueue.push({
            userId,
            username,
            socketId: socket.id
        });

        socket.emit('matchmaking:searching');

        // Try to find a match
        if (this.matchmakingQueue.length >= 2) {
            const player1 = this.matchmakingQueue.shift();
            const player2 = this.matchmakingQueue.shift();

            this.createMatch(player1, player2);
        }
    }

    handleMatchmakingLeave(socket) {
        this.matchmakingQueue = this.matchmakingQueue.filter(
            p => p.socketId !== socket.id
        );
        socket.emit('matchmaking:left');
    }

    async createMatch(player1, player2) {
        try {
            // Randomly assign symbols
            const player1Symbol = Math.random() < 0.5 ? 'X' : 'O';
            const player2Symbol = player1Symbol === 'X' ? 'O' : 'X';

            // Create match in database
            const match = await Match.create({
                players: [
                    {
                        userId: player1.userId,
                        username: player1.username,
                        symbol: player1Symbol,
                        isAI: false
                    },
                    {
                        userId: player2.userId,
                        username: player2.username,
                        symbol: player2Symbol,
                        isAI: false
                    }
                ],
                mode: 'online',
                status: 'active',
                startedAt: Date.now()
            });

            const roomCode = match._id.toString();

            // Store room data
            this.activeRooms.set(roomCode, {
                matchId: match._id,
                players: {
                    [player1.userId]: { ...player1, symbol: player1Symbol },
                    [player2.userId]: { ...player2, symbol: player2Symbol }
                },
                currentTurn: player1Symbol,
                board: Array(9).fill(null)
            });

            // Join both players to room
            const socket1 = this.io.sockets.sockets.get(player1.socketId);
            const socket2 = this.io.sockets.sockets.get(player2.socketId);

            if (socket1) {
                socket1.join(roomCode);
                socket1.matchData = { roomCode, userId: player1.userId, symbol: player1Symbol };
                socket1.emit('matchmaking:found', {
                    matchId: match._id,
                    roomCode,
                    yourSymbol: player1Symbol,
                    opponentName: player2.username,
                    firstMove: player1Symbol === 'X'
                });
            }

            if (socket2) {
                socket2.join(roomCode);
                socket2.matchData = { roomCode, userId: player2.userId, symbol: player2Symbol };
                socket2.emit('matchmaking:found', {
                    matchId: match._id,
                    roomCode,
                    yourSymbol: player2Symbol,
                    opponentName: player1.username,
                    firstMove: player2Symbol === 'X'
                });
            }

            console.log(`Match created: ${roomCode}`);
        } catch (error) {
            console.error('Error creating match:', error);
        }
    }

    async handleRoomCreate(socket, data) {
        try {
            const { userId, username } = data;

            // Generate 6-character room code
            const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

            // Create match in database (waiting state)
            const match = await Match.create({
                players: [
                    {
                        userId,
                        username,
                        symbol: 'X',
                        isAI: false
                    }
                ],
                mode: 'online',
                status: 'waiting',
                roomCode,
                startedAt: Date.now()
            });

            // Store room data
            this.activeRooms.set(roomCode, {
                matchId: match._id,
                creator: { userId, username, socketId: socket.id },
                players: {
                    [userId]: { userId, username, socketId: socket.id, symbol: 'X' }
                },
                currentTurn: 'X',
                board: Array(9).fill(null)
            });

            socket.join(roomCode);
            socket.matchData = { roomCode, userId, symbol: 'X' };

            socket.emit('room:created', {
                roomCode,
                matchId: match._id,
                yourSymbol: 'X'
            });

            console.log(`Private room created: ${roomCode}`);
        } catch (error) {
            console.error('Error creating room:', error);
            socket.emit('room:error', { message: 'Failed to create room' });
        }
    }

    async handleRoomJoin(socket, data) {
        try {
            const { userId, username, roomCode } = data;

            const room = this.activeRooms.get(roomCode);

            if (!room) {
                socket.emit('room:error', { message: 'Room not found' });
                return;
            }

            if (Object.keys(room.players).length >= 2) {
                socket.emit('room:error', { message: 'Room is full' });
                return;
            }

            // Add second player
            room.players[userId] = { userId, username, socketId: socket.id, symbol: 'O' };

            // Update match in database
            await Match.findByIdAndUpdate(room.matchId, {
                $push: {
                    players: {
                        userId,
                        username,
                        symbol: 'O',
                        isAI: false
                    }
                },
                status: 'active'
            });

            socket.join(roomCode);
            socket.matchData = { roomCode, userId, symbol: 'O' };

            // Notify both players
            socket.emit('room:joined', {
                matchId: room.matchId,
                roomCode,
                yourSymbol: 'O',
                opponentName: room.creator.username,
                firstMove: false
            });

            const creatorSocket = this.io.sockets.sockets.get(room.creator.socketId);
            if (creatorSocket) {
                creatorSocket.emit('room:opponent-joined', {
                    opponentName: username
                });
            }

            // Notify room that game is starting
            this.io.to(roomCode).emit('game:start', {
                currentTurn: 'X'
            });

            console.log(`Player joined room: ${roomCode}`);
        } catch (error) {
            console.error('Error joining room:', error);
            socket.emit('room:error', { message: 'Failed to join room' });
        }
    }

    async handleGameMove(socket, data) {
        try {
            const { position } = data;
            const { roomCode, userId, symbol } = socket.matchData || {};

            if (!roomCode) {
                socket.emit('game:error', { message: 'Not in a game' });
                return;
            }

            const room = this.activeRooms.get(roomCode);
            if (!room) {
                socket.emit('game:error', { message: 'Room not found' });
                return;
            }

            // Validate turn
            if (room.currentTurn !== symbol) {
                socket.emit('game:error', { message: 'Not your turn' });
                return;
            }

            // Validate move
            if (room.board[position] !== null) {
                socket.emit('game:error', { message: 'Invalid move' });
                return;
            }

            // Make move
            room.board[position] = symbol;

            // Update match in database
            const match = await Match.findById(room.matchId);
            match.moves.push({ position, symbol });

            // Check game result
            const gameResult = getGameResult(room.board);

            if (gameResult.status === 'completed') {
                match.status = 'completed';
                match.result.winner = gameResult.winner;
                match.result.winningLine = gameResult.winningLine;
                match.completedAt = Date.now();
                await match.save();

                // Update stats for both players using match.players
                console.log('Updating stats for players:', match.players.map(p => ({ userId: p.userId, symbol: p.symbol })));

                for (const player of match.players) {
                    if (player.userId) {
                        console.log(`Updating stats for user ${player.userId}, symbol ${player.symbol}, winner ${gameResult.winner}`);
                        await this.updateUserStats(player.userId, gameResult.winner, player.symbol);
                    }
                }

                // Notify both players
                this.io.to(roomCode).emit('game:ended', {
                    board: room.board,
                    winner: gameResult.winner,
                    winningLine: gameResult.winningLine,
                    position
                });

                // Clean up room
                this.activeRooms.delete(roomCode);
            } else {
                // Switch turn
                room.currentTurn = symbol === 'X' ? 'O' : 'X';

                // Notify both players
                this.io.to(roomCode).emit('game:move-made', {
                    position,
                    symbol,
                    board: room.board,
                    nextTurn: room.currentTurn
                });
            }

            await match.save();
        } catch (error) {
            console.error('Error handling move:', error);
            socket.emit('game:error', { message: 'Failed to process move' });
        }
    }

    handleRoomLeave(socket) {
        const { roomCode } = socket.matchData || {};

        if (roomCode) {
            socket.leave(roomCode);

            // Notify other player
            socket.to(roomCode).emit('player:left');

            // Clean up room
            this.activeRooms.delete(roomCode);

            delete socket.matchData;
        }
    }

    handleDisconnect(socket) {
        console.log(`User disconnected: ${socket.id}`);

        // Remove from matchmaking queue
        this.handleMatchmakingLeave(socket);

        // Handle room disconnect
        this.handleRoomLeave(socket);
    }

    // Helper function to update user stats
    async updateUserStats(userId, winner, playerSymbol) {
        try {
            const user = await User.findById(userId);
            if (!user) return;

            user.stats.gamesPlayed += 1;

            if (winner === 'tie') {
                user.stats.ties += 1;
                user.stats.winStreak = 0;
            } else if (winner === playerSymbol) {
                user.stats.wins += 1;
                user.stats.winStreak += 1;
                user.coins += 50; // Award 50 coins for winning
                if (user.stats.winStreak > user.stats.bestStreak) {
                    user.stats.bestStreak = user.stats.winStreak;
                }
            } else {
                user.stats.losses += 1;
                user.stats.winStreak = 0;
            }

            await user.save();
        } catch (error) {
            console.error('Error updating user stats:', error);
        }
    }
}

module.exports = SocketManager;
