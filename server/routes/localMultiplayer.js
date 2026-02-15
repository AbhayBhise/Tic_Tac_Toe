const express = require('express');
const router = express.Router();
const { startGame, makeMove } = require('../controllers/localMultiplayerController');
const { protect } = require('../middleware/auth');
const { localMultiplayerStartValidation, localMultiplayerMoveValidation } = require('../utils/validation');

router.post('/start', protect, localMultiplayerStartValidation, startGame);
router.post('/move', protect, localMultiplayerMoveValidation, makeMove);

module.exports = router;
