const User = require('../models/User');
const Match = require('../models/Match');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { username, avatar } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if username is already taken (if changed)
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already taken'
                });
            }
            user.username = username;
        }

        if (avatar) {
            user.avatar = avatar;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                _id: user._id,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
                stats: user.stats,
                selectedTheme: user.selectedTheme
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
};

// @desc    Get user match history
// @route   GET /api/user/matches
// @access  Private
const getMatchHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const matches = await Match.find({
            'players.userId': req.user._id,
            status: 'completed'
        })
            .sort({ completedAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('players mode result completedAt moves');

        const total = await Match.countDocuments({
            'players.userId': req.user._id,
            status: 'completed'
        });

        // Format matches for better readability
        const formattedMatches = matches.map(match => {
            const userPlayer = match.players.find(p => p.userId?.toString() === req.user._id.toString());
            const opponentPlayer = match.players.find(p => p.userId?.toString() !== req.user._id.toString());

            let result = 'tie';
            if (match.result.winner && match.result.winner !== 'tie') {
                result = match.result.winner === userPlayer?.symbol ? 'win' : 'loss';
            }

            return {
                _id: match._id,
                mode: match.mode,
                opponentName: opponentPlayer?.username || 'Unknown',
                yourSymbol: userPlayer?.symbol,
                result,
                completedAt: match.completedAt,
                moves: match.moves.length
            };
        });

        res.status(200).json({
            success: true,
            data: {
                matches: formattedMatches,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching match history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching match history'
        });
    }
};

// @desc    Update selected theme
// @route   PUT /api/user/theme
// @access  Private
const updateTheme = async (req, res) => {
    try {
        const { themeId } = req.body;

        if (!themeId) {
            return res.status(400).json({
                success: false,
                message: 'Theme ID is required'
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user owns the theme
        if (!user.ownedThemes.includes(themeId)) {
            return res.status(403).json({
                success: false,
                message: 'You do not own this theme'
            });
        }

        user.selectedTheme = themeId;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Theme updated successfully',
            data: {
                selectedTheme: user.selectedTheme
            }
        });
    } catch (error) {
        console.error('Error updating theme:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating theme'
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getMatchHistory,
    updateTheme
};
