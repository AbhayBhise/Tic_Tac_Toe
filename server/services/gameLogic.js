/**
 * Core Tic-Tac-Toe Game Logic
 * Server-authoritative game functions
 */

// Winning combinations
const WINNING_LINES = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

/**
 * Convert moves array to 3x3 board representation
 * @param {Array} moves - Array of move objects [{position, symbol}]
 * @returns {Array} - 3x3 board array
 */
const getBoardState = (moves) => {
    const board = Array(9).fill(null);
    moves.forEach(move => {
        board[move.position] = move.symbol;
    });
    return board;
};

/**
 * Check if there's a winner
 * @param {Array} board - 3x3 board array
 * @returns {Object|null} - {winner: 'X'|'O', line: [positions]} or null
 */
const checkWinner = (board) => {
    for (const line of WINNING_LINES) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return {
                winner: board[a],
                line: line
            };
        }
    }
    return null;
};

/**
 * Check if the game is a tie
 * @param {Array} board - 3x3 board array
 * @returns {Boolean} - True if tie
 */
const checkTie = (board) => {
    return board.every(cell => cell !== null) && !checkWinner(board);
};

/**
 * Validate if a move is legal
 * @param {Array} board - 3x3 board array
 * @param {Number} position - Position (0-8)
 * @returns {Boolean} - True if valid
 */
const validateMove = (board, position) => {
    if (position < 0 || position > 8) {
        return false;
    }
    return board[position] === null;
};

/**
 * Get all available moves
 * @param {Array} board - 3x3 board array
 * @returns {Array} - Array of available positions
 */
const getAvailableMoves = (board) => {
    return board.map((cell, index) => cell === null ? index : null).filter(pos => pos !== null);
};

/**
 * Get game result from board state
 * @param {Array} board - 3x3 board array
 * @returns {Object} - {status: 'active'|'completed', winner: 'X'|'O'|'tie'|null, winningLine: [positions]|null}
 */
const getGameResult = (board) => {
    const winResult = checkWinner(board);

    if (winResult) {
        return {
            status: 'completed',
            winner: winResult.winner,
            winningLine: winResult.line
        };
    }

    if (checkTie(board)) {
        return {
            status: 'completed',
            winner: 'tie',
            winningLine: null
        };
    }

    return {
        status: 'active',
        winner: null,
        winningLine: null
    };
};

module.exports = {
    WINNING_LINES,
    getBoardState,
    checkWinner,
    checkTie,
    validateMove,
    getAvailableMoves,
    getGameResult
};
