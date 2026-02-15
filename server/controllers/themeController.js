const Theme = require('../models/Theme');
const User = require('../models/User');

// @desc    Get all themes
// @route   GET /api/themes
// @access  Public
const getThemes = async (req, res) => {
    try {
        const themes = await Theme.find().sort({ price: 1, name: 1 });

        // If user is logged in, add ownership info
        if (req.user) {
            const user = await User.findById(req.user._id);
            const themesWithOwnership = themes.map(theme => ({
                ...theme.toObject(),
                owned: user.ownedThemes.includes(theme.id),
                selected: user.selectedTheme === theme.id
            }));

            return res.status(200).json({
                success: true,
                data: themesWithOwnership,
                userCoins: user.coins
            });
        }

        res.status(200).json({
            success: true,
            data: themes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Purchase a theme
// @route   POST /api/themes/:themeId/purchase
// @access  Private
const purchaseTheme = async (req, res) => {
    try {
        const { themeId } = req.params;

        const theme = await Theme.findOne({ id: themeId });
        if (!theme) {
            return res.status(404).json({
                success: false,
                message: 'Theme not found'
            });
        }

        const user = await User.findById(req.user._id);

        // Check if already owned
        if (user.ownedThemes.includes(themeId)) {
            return res.status(400).json({
                success: false,
                message: 'You already own this theme'
            });
        }

        // Check if user has enough coins
        if (user.coins < theme.price) {
            return res.status(400).json({
                success: false,
                message: `Insufficient coins. You need ${theme.price} coins but have ${user.coins}`,
                required: theme.price,
                current: user.coins
            });
        }

        // Deduct coins and add theme
        user.coins -= theme.price;
        user.ownedThemes.push(themeId);
        await user.save();

        res.status(200).json({
            success: true,
            message: `Successfully purchased ${theme.name}!`,
            data: {
                theme: theme.toObject(),
                remainingCoins: user.coins
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Select/activate a theme
// @route   PUT /api/themes/:themeId/select
// @access  Private
const selectTheme = async (req, res) => {
    try {
        const { themeId } = req.params;

        const user = await User.findById(req.user._id);

        // Check if user owns the theme
        if (!user.ownedThemes.includes(themeId)) {
            return res.status(403).json({
                success: false,
                message: 'You do not own this theme'
            });
        }

        // Update selected theme
        user.selectedTheme = themeId;
        await user.save();

        const theme = await Theme.findOne({ id: themeId });

        res.status(200).json({
            success: true,
            message: `Theme changed to ${theme.name}`,
            data: {
                selectedTheme: themeId
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getThemes,
    purchaseTheme,
    selectTheme
};
