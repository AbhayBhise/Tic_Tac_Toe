const User = require('../models/User');
const Match = require('../models/Match');
const { getBoardState, getGameResult } = require('../services/gameLogic');

// @desc    Start local multiplayer game
// @route   POST /api/game/local/start
// @access  Private
const startGame = async (req, res) => {
    try {
        const { player1Name, player2Name } = req.body;

        // Create new match
        const match = await Match.create({
            players: [
                {
                    userId: req.user._id,
                    username: player1Name || req.user.username,
                    symbol: 'X',
                    isAI: false
                },
                {
                    username: player2Name || 'Player 2',
                    symbol: 'O',
                    isAI: false
                }
            ],
            mode: 'local',
            status: 'active',
            startedAt: Date.now()
        });

        res.status(201).json({
            success: true,
            data: {
                matchId: match._id,
                player1: player1Name || req.user.username,
                player2: player2Name || 'Player 2'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Make a move in local multiplayer
// @route   POST /api/game/local/move
// @access  Private
const makeMove = async (req, res) => {
    try {
        const { matchId, position, symbol } = req.body;

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

        // Add move
        match.moves.push({
            position,
            symbol
        });

        // Check game status
        const board = getBoardState(match.moves);
        const gameResult = getGameResult(board);

        if (gameResult.status === 'completed') {
            match.status = 'completed';
            match.result.winner = gameResult.winner;
            match.result.winningLine = gameResult.winningLine;
            match.completedAt = Date.now();

            // Update user stats (only for player 1)
            await updateUserStats(req.user._id, gameResult.winner);
        }

        await match.save();

        res.status(200).json({
            success: true,
            data: {
                match,
                gameOver: gameResult.status === 'completed',
                winner: gameResult.winner,
                winningLine: gameResult.winningLine
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
const updateUserStats = async (userId, winner) => {
    const user = await User.findById(userId);

    if (!user) return;

    user.stats.gamesPlayed += 1;

    if (winner === 'tie') {
        user.stats.ties += 1;
        user.stats.winStreak = 0;
    } else if (winner === 'X') {
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
