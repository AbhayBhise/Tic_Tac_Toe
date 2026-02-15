const { body, param, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path || err.param,
                message: err.msg
            }))
        });
    }

    next();
};

/**
 * Auth validation rules
 */
const registerValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('username')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    handleValidationErrors
];

const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    handleValidationErrors
];

/**
 * Game validation rules
 */
const startSinglePlayerValidation = [
    body('difficulty')
        .isIn(['easy', 'medium', 'hard'])
        .withMessage('Difficulty must be easy, medium, or hard'),

    body('playerSymbol')
        .isIn(['X', 'O'])
        .withMessage('Player symbol must be X or O'),

    handleValidationErrors
];

const gameMoveValidation = [
    body('matchId')
        .isMongoId()
        .withMessage('Invalid match ID'),

    body('position')
        .isInt({ min: 0, max: 8 })
        .withMessage('Position must be between 0 and 8'),

    handleValidationErrors
];

const localMultiplayerStartValidation = [
    body('player1Name')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Player 1 name must be 20 characters or less'),

    body('player2Name')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Player 2 name must be 20 characters or less'),

    handleValidationErrors
];

const localMultiplayerMoveValidation = [
    body('matchId')
        .isMongoId()
        .withMessage('Invalid match ID'),

    body('position')
        .isInt({ min: 0, max: 8 })
        .withMessage('Position must be between 0 and 8'),

    body('symbol')
        .isIn(['X', 'O'])
        .withMessage('Symbol must be X or O'),

    handleValidationErrors
];

/**
 * User validation rules
 */
const updateProfileValidation = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),

    body('avatar')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Avatar URL too long'),

    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    registerValidation,
    loginValidation,
    startSinglePlayerValidation,
    gameMoveValidation,
    localMultiplayerStartValidation,
    localMultiplayerMoveValidation,
    updateProfileValidation
};
