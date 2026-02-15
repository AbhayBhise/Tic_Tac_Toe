const express = require('express');
const router = express.Router();
const { getThemes, purchaseTheme, selectTheme } = require('../controllers/themeController');
const { protect } = require('../middleware/auth');

// GET all themes (public but shows ownership if logged in)
router.get('/', protect, getThemes);

// Purchase a theme (protected)
router.post('/:themeId/purchase', protect, purchaseTheme);

// Select/activate a theme (protected)
router.put('/:themeId/select', protect, selectTheme);

module.exports = router;
