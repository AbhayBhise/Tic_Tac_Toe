/**
 * Game logic utilities for online multiplayer
 */

/**
 * Get current board state
 */
const getBoardState = (board) => {
    return board;
};

/**
 * Check win condition
 */
const checkWinner = (board) => {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return {
                winner: board[a],
                winningLine: pattern
            };
        }
    }

    return null;
};

/**
 * Get game result
 */
const getGameResult = (board) => {
    const winResult = checkWinner(board);

    if (winResult) {
        return {
            status: 'completed',
            winner: winResult.winner,
            winningLine: winResult.winningLine
        };
    }

    // Check for tie
    if (board.every(cell => cell !== null)) {
        return {
            status: 'completed',
            winner: 'tie',
            winningLine: []
        };
    }

    return {
        status: 'active',
        winner: null,
        winningLine: []
    };
};

/**
 * Validate move
 */
const validateMove = (board, position) => {
    if (position < 0 || position > 8) {
        return { valid: false, error: 'Invalid position' };
    }

    if (board[position] !== null) {
        return { valid: false, error: 'Cell already occupied' };
    }

    return { valid: true };
};

module.exports = {
    getBoardState,
    getGameResult,
    validateMove,
    checkWinner
};
