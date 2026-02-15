const express = require('express');
const router = express.Router();
const { startGame, makeMove } = require('../controllers/singlePlayerController');
const { protect } = require('../middleware/auth');
const { startSinglePlayerValidation, gameMoveValidation } = require('../utils/validation');

router.post('/start', protect, startSinglePlayerValidation, startGame);
router.post('/move', protect, gameMoveValidation, makeMove);

module.exports = router;
