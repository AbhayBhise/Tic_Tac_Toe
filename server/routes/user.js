const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    getMatchHistory,
    updateTheme
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { updateProfileValidation } = require('../utils/validation');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidation, updateProfile);
router.get('/matches', protect, getMatchHistory);
router.put('/theme', protect, updateTheme);

module.exports = router;
