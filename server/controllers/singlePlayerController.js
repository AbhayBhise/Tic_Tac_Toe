const User = require('../models/User');
const Match = require('../models/Match');
const { getAIMove } = require('../services/aiService');
const { getBoardState, getGameResult } = require('../services/gameLogic');

// @desc    Start single player game
// @route   POST /api/game/single/start
// @access  Private
const startGame = async (req, res) => {
    try {
        const { difficulty, playerSymbol } = req.body;

        const aiSymbol = playerSymbol === 'X' ? 'O' : 'X';

        // Create new match
        const match = await Match.create({
            players: [
                {
                    userId: req.user._id,
                    username: req.user.username,
                    symbol: playerSymbol,
                    isAI: false
                },
                {
                    username: `AI (${difficulty})`,
                    symbol: aiSymbol,
                    isAI: true,
                    aiDifficulty: difficulty
                }
            ],
            mode: 'single',
            status: 'active',
            startedAt: Date.now()
        });

        res.status(201).json({
            success: true,
            data: {
                matchId: match._id,
                playerSymbol,
                aiSymbol,
                difficulty,
                firstMove: playerSymbol === 'X' ? 'player' : 'ai'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Make a move (player or AI)
// @route   POST /api/game/single/move
// @access  Private
const makeMove = async (req, res) => {
    try {
        const { matchId, position } = req.body;

        const match = await Match.findById(matchId);

        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'Match not found'
            });
        }

        if (match.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Match is not active'
            });
        }

        // Determine current player symbol
        const playerSymbol = match.players[0].symbol;
        const aiSymbol = match.players[1].symbol;
        const currentSymbol = match.moves.length % 2 === 0 ? 'X' : 'O';

        // Add player move
        match.moves.push({
            position,
            symbol: currentSymbol
        });

        // Check game status after player move
        const board = getBoardState(match.moves);
        let gameResult = getGameResult(board);

        if (gameResult.status === 'completed') {
            // Game over
            match.status = 'completed';
            match.result.winner = gameResult.winner;
            match.result.winningLine = gameResult.winningLine;
            match.completedAt = Date.now();
            await match.save();

            // Update user stats
            await updateUserStats(req.user._id, gameResult.winner, playerSymbol);

            return res.status(200).json({
                success: true,
                data: {
                    match,
                    gameOver: true,
                    winner: gameResult.winner,
                    winningLine: gameResult.winningLine
                }
            });
        }

        // AI's turn
        const aiMove = getAIMove(match.moves, aiSymbol, match.players[1].aiDifficulty);

        match.moves.push({
            position: aiMove,
            symbol: aiSymbol
        });

        // Check game status after AI move
        const newBoard = getBoardState(match.moves);
        gameResult = getGameResult(newBoard);

        if (gameResult.status === 'completed') {
            match.status = 'completed';
            match.result.winner = gameResult.winner;
            match.result.winningLine = gameResult.winningLine;
            match.completedAt = Date.now();
            await match.save();

            // Update user stats
            await updateUserStats(req.user._id, gameResult.winner, playerSymbol);

            return res.status(200).json({
                success: true,
                data: {
                    aiMove,
                    match,
                    gameOver: true,
                    winner: gameResult.winner,
                    winningLine: gameResult.winningLine
                }
            });
        }

        await match.save();

        res.status(200).json({
            success: true,
            data: {
                aiMove,
                match,
                gameOver: false
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Helper function to update user stats
const updateUserStats = async (userId, winner, playerSymbol) => {
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
};

module.exports = {
    startGame,
    makeMove
};
