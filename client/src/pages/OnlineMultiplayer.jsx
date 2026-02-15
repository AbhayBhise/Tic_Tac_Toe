import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';
import GameBoard from '../components/GameBoard';
import '../styles/OnlineMultiplayer.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const OnlineMultiplayer = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [socket, setSocket] = useState(null);
    const [gameMode, setGameMode] = useState('selection'); // selection, matchmaking, private-create, private-join, playing, finished
    const [matchmakingStatus, setMatchmakingStatus] = useState('idle'); // idle, searching, found
    const [roomCode, setRoomCode] = useState('');
    const [inputRoomCode, setInputRoomCode] = useState('');
    const [matchData, setMatchData] = useState(null);
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentTurn, setCurrentTurn] = useState('X');
    const [mySymbol, setMySymbol] = useState(null);
    const [opponentName, setOpponentName] = useState('');
    const [gameResult, setGameResult] = useState(null);
    const [winningLine, setWinningLine] = useState([]);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(null); // null, 3, 2, 1, 'GO!'

    // Initialize socket
    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true
        });

        newSocket.on('connect', () => {
            console.log('Connected to server');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    // Socket event listeners
    useEffect(() => {
        if (!socket) return;

        // Matchmaking events
        socket.on('matchmaking:searching', () => {
            setMatchmakingStatus('searching');
        });

        socket.on('matchmaking:found', (data) => {
            setMatchmakingStatus('found');
            setMatchData(data);
            setMySymbol(data.yourSymbol);
            setOpponentName(data.opponentName);
            setBoard(Array(9).fill(null));
            setCurrentTurn('X');
            setGameResult(null);
            setWinningLine([]);

            // Start countdown after 1 second of showing "Match Found!"
            setTimeout(() => {
                startCountdown();
            }, 1500);
        });

        socket.on('matchmaking:left', () => {
            setMatchmakingStatus('idle');
        });

        // Private room events
        socket.on('room:created', (data) => {
            setRoomCode(data.roomCode);
            setMatchData(data);
            setMySymbol(data.yourSymbol);
            setGameMode('private-create');
        });

        socket.on('room:opponent-joined', (data) => {
            setOpponentName(data.opponentName);
            setMatchmakingStatus('found');

            // Start countdown after brief celebration
            setTimeout(() => {
                startCountdown();
            }, 1500);
        });

        socket.on('room:joined', (data) => {
            setMatchData(data);
            setMySymbol(data.yourSymbol);
            setOpponentName(data.opponentName);
            setRoomCode(data.roomCode);
            setMatchmakingStatus('found');

            // Start countdown
            setTimeout(() => {
                startCountdown();
            }, 1500);
        });

        socket.on('room:error', (data) => {
            setError(data.message);
            setTimeout(() => setError(''), 3000);
        });

        // Game events
        socket.on('game:start', (data) => {
            setCurrentTurn(data.currentTurn);
        });

        socket.on('game:move-made', (data) => {
            setBoard([...data.board]);
            setCurrentTurn(data.nextTurn);
        });

        socket.on('game:ended', (data) => {
            setBoard([...data.board]);
            setGameMode('finished');
            setGameResult(data.winner === 'tie' ? "It's a Tie!" : `${data.winner} Wins!`);
            setWinningLine(data.winningLine || []);
        });

        socket.on('game:error', (data) => {
            setError(data.message);
            setTimeout(() => setError(''), 3000);
        });

        socket.on('player:left', () => {
            setError('Opponent left the game');
            setGameMode('finished');
            setGameResult('Opponent Disconnected');
        });

        return () => {
            socket.off('matchmaking:searching');
            socket.off('matchmaking:found');
            socket.off('matchmaking:left');
            socket.off('room:created');
            socket.off('room:opponent-joined');
            socket.off('room:joined');
            socket.off('room:error');
            socket.off('game:start');
            socket.off('game:move-made');
            socket.off('game:ended');
            socket.off('game:error');
            socket.off('player:left');
        };
    }, [socket]);

    const handleJoinMatchmaking = () => {
        if (!socket || !user) return;
        socket.emit('matchmaking:join', {
            userId: user._id,
            username: user.username
        });
        setGameMode('matchmaking');
        setMatchmakingStatus('searching');
    };

    const handleLeaveMatchmaking = () => {
        if (!socket) return;
        socket.emit('matchmaking:leave');
        setGameMode('selection');
        setMatchmakingStatus('idle');
    };

    const handleCreatePrivateRoom = () => {
        if (!socket || !user) return;
        socket.emit('room:create', {
            userId: user._id,
            username: user.username
        });
    };

    const handleJoinPrivateRoom = () => {
        if (!socket || !user || !inputRoomCode) return;
        socket.emit('room:join', {
            userId: user._id,
            username: user.username,
            roomCode: inputRoomCode.toUpperCase()
        });
    };

    const handleCellClick = (index) => {
        if (gameMode !== 'playing' || currentTurn !== mySymbol || board[index] !== null) {
            return;
        }

        // Optimistically update the board locally for instant feedback
        const newBoard = [...board];
        newBoard[index] = mySymbol;
        setBoard(newBoard);

        // Update turn locally (server will confirm)
        setCurrentTurn(mySymbol === 'X' ? 'O' : 'X');

        socket.emit('game:move', { position: index });
    };

    const handlePlayAgain = () => {
        setGameMode('selection');
        setBoard(Array(9).fill(null));
        setMatchData(null);
        setMySymbol(null);
        setOpponentName('');
        setGameResult(null);
        setWinningLine([]);
        setRoomCode('');
    };

    const handleBackToHome = () => {
        navigate('/home');
    };

    const startCountdown = () => {
        setCountdown(3);

        setTimeout(() => setCountdown(2), 1000);
        setTimeout(() => setCountdown(1), 2000);
        setTimeout(() => setCountdown('GO!'), 3000);
        setTimeout(() => {
            setCountdown(null);
            setMatchmakingStatus('idle'); // Reset to prevent showing match found panel
            setGameMode('playing');
        }, 4000);
    };

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomCode);
        alert('Room code copied to clipboard!');
    };

    return (
        <div className="online-multiplayer-container">
            <div className="game-header">
                <button onClick={handleBackToHome} className="btn-back">
                    ← Back to Home
                </button>
                <h1>Online Multiplayer</h1>
            </div>

            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

            {/* Mode Selection */}
            {gameMode === 'selection' && (
                <div className="mode-selection">
                    <div className="mode-card">
                        <div className="mode-icon">🎲</div>
                        <h2>Random Match</h2>
                        <p>Get matched with a random opponent</p>
                        <button onClick={handleJoinMatchmaking} className="btn-mode">
                            Find Match
                        </button>
                    </div>

                    <div className="mode-card">
                        <div className="mode-icon">👥</div>
                        <h2>Play with Friend</h2>
                        <p>Create a private room and invite your friend</p>
                        <button onClick={handleCreatePrivateRoom} className="btn-mode">
                            Create Room
                        </button>
                        <div className="divider">OR</div>
                        <div className="join-room">
                            <input
                                type="text"
                                value={inputRoomCode}
                                onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                                placeholder="Enter room code"
                                className="room-code-input"
                                maxLength={6}
                            />
                            <button onClick={handleJoinPrivateRoom} className="btn-join" disabled={!inputRoomCode}>
                                Join Room
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Matchmaking */}
            {gameMode === 'matchmaking' && matchmakingStatus === 'searching' && (
                <div className="matchmaking-panel">
                    <div className="matchmaking-content">
                        <div className="spinner"></div>
                        <h2>Finding an opponent...</h2>
                        <p>Please wait while we match you with another player</p>
                        <button onClick={handleLeaveMatchmaking} className="btn-cancel">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Match Found Animation */}
            {matchmakingStatus === 'found' && opponentName && countdown === null && gameMode !== 'playing' && (
                <div className="match-found-panel">
                    <div className="match-found-content">
                        <div className="celebration-icon">🎉</div>
                        <h1 className="match-found-title">Match Found!</h1>
                        <p className="opponent-intro">You'll be playing against <strong>{opponentName}</strong></p>
                        <div className="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            )}

            {/* Countdown Overlay */}
            {countdown !== null && (
                <div className="countdown-overlay">
                    <div className={`countdown-number ${countdown === 'GO!' ? 'go' : ''}`}>
                        {countdown}
                    </div>
                </div>
            )}

            {/* Private Room Created */}
            {gameMode === 'private-create' && !opponentName && (
                <div className="private-room-panel">
                    <div className="room-waiting-content">
                        <h2>Room Created!</h2>
                        <p>Share this code with your friend:</p>
                        <div className="room-code-display">
                            <span className="code">{roomCode}</span>
                            <button onClick={copyRoomCode} className="btn-copy">
                                📋 Copy
                            </button>
                        </div>
                        <div className="waiting-animation">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                        <p className="waiting-text">Waiting for opponent to join...</p>
                        <button onClick={() => setGameMode('selection')} className="btn-cancel">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Playing */}
            {(gameMode === 'playing' || gameMode === 'finished') && (
                <div className="game-panel">
                    <div className="game-info-online">
                        <div className="player-info">
                            <div className="player-label">You</div>
                            <div className={`player-display ${currentTurn === mySymbol && gameMode === 'playing' ? 'active' : ''}`}>
                                <span className="symbol">{mySymbol}</span>
                                <span className="name">{user.username}</span>
                            </div>
                        </div>
                        <div className="vs-divider">VS</div>
                        <div className="player-info">
                            <div className="player-label">Opponent</div>
                            <div className={`player-display ${currentTurn !== mySymbol && gameMode === 'playing' ? 'active' : ''}`}>
                                <span className="symbol">{mySymbol === 'X' ? 'O' : 'X'}</span>
                                <span className="name">{opponentName}</span>
                            </div>
                        </div>
                    </div>

                    <GameBoard
                        board={board}
                        onCellClick={handleCellClick}
                        winningLine={winningLine}
                        disabled={gameMode === 'finished' || currentTurn !== mySymbol}
                        currentPlayer={gameMode === 'playing' ? currentTurn : null}
                    />

                    {gameMode === 'playing' && currentTurn !== mySymbol && (
                        <div className="waiting-turn">
                            <div className="spinner-small"></div>
                            <span>Waiting for opponent...</span>
                        </div>
                    )}

                    {gameResult && (
                        <div className="game-result">
                            <h2>{gameResult}</h2>
                            <div className="result-actions">
                                <button onClick={handlePlayAgain} className="btn-play-again">
                                    New Game
                                </button>
                                <button onClick={handleBackToHome} className="btn-home">
                                    Home
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OnlineMultiplayer;
