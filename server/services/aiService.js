/**
 * AI Service for Tic-Tac-Toe
 * Implements Minimax algorithm with difficulty levels
 */

const { getBoardState, getAvailableMoves, checkWinner, checkTie } = require('./gameLogic');

/**
 * Minimax algorithm with alpha-beta pruning
 * @param {Array} board - Current board state
 * @param {Number} depth - Current depth
 * @param {Boolean} isMaximizing - True if maximizing player
 * @param {String} aiSymbol - AI's symbol ('X' or 'O')
 * @param {String} humanSymbol - Human's symbol
 * @param {Number} alpha - Alpha value for pruning
 * @param {Number} beta - Beta value for pruning
 * @returns {Number} - Score of the move
 */
const minimax = (board, depth, isMaximizing, aiSymbol, humanSymbol, alpha = -Infinity, beta = Infinity) => {
    const winner = checkWinner(board);

    // Terminal states
    if (winner) {
        return winner.winner === aiSymbol ? 10 - depth : depth - 10;
    }
    if (checkTie(board)) {
        return 0;
    }

    const availableMoves = getAvailableMoves(board);

    if (isMaximizing) {
        let maxScore = -Infinity;

        for (const move of availableMoves) {
            board[move] = aiSymbol;
            const score = minimax(board, depth + 1, false, aiSymbol, humanSymbol, alpha, beta);
            board[move] = null;
            maxScore = Math.max(maxScore, score);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) {
                break; // Beta cutoff
            }
        }

        return maxScore;
    } else {
        let minScore = Infinity;

        for (const move of availableMoves) {
            board[move] = humanSymbol;
            const score = minimax(board, depth + 1, true, aiSymbol, humanSymbol, alpha, beta);
            board[move] = null;
            minScore = Math.min(minScore, score);
            beta = Math.min(beta, score);
            if (beta <= alpha) {
                break; // Alpha cutoff
            }
        }

        return minScore;
    }
};

/**
 * Get random move from available moves
 * @param {Array} board - Current board state
 * @returns {Number} - Random position
 */
const getRandomMove = (board) => {
    const availableMoves = getAvailableMoves(board);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

/**
 * Get best move using Minimax with limited depth
 * @param {Array} board - Current board state
 * @param {String} aiSymbol - AI's symbol
 * @param {String} humanSymbol - Human's symbol
 * @param {Number} maxDepth - Maximum depth to search (null for unlimited)
 * @returns {Number} - Best position
 */
const getBestMoveWithDepth = (board, aiSymbol, humanSymbol, maxDepth = null) => {
    const availableMoves = getAvailableMoves(board);
    let bestScore = -Infinity;
    let bestMove = availableMoves[0];

    // If maxDepth is set, use limited depth search
    if (maxDepth !== null) {
        for (const move of availableMoves) {
            board[move] = aiSymbol;
            const score = minimaxLimited(board, 0, false, aiSymbol, humanSymbol, maxDepth);
            board[move] = null;

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
    } else {
        // Full minimax
        for (const move of availableMoves) {
            board[move] = aiSymbol;
            const score = minimax(board, 0, false, aiSymbol, humanSymbol);
            board[move] = null;

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
    }

    return bestMove;
};

/**
 * Limited depth minimax (for medium difficulty)
 */
const minimaxLimited = (board, depth, isMaximizing, aiSymbol, humanSymbol, maxDepth) => {
    const winner = checkWinner(board);

    if (winner) {
        return winner.winner === aiSymbol ? 10 - depth : depth - 10;
    }
    if (checkTie(board) || depth >= maxDepth) {
        return 0;
    }

    const availableMoves = getAvailableMoves(board);

    if (isMaximizing) {
        let maxScore = -Infinity;
        for (const move of availableMoves) {
            board[move] = aiSymbol;
            const score = minimaxLimited(board, depth + 1, false, aiSymbol, humanSymbol, maxDepth);
            board[move] = null;
            maxScore = Math.max(maxScore, score);
        }
        return maxScore;
    } else {
        let minScore = Infinity;
        for (const move of availableMoves) {
            board[move] = humanSymbol;
            const score = minimaxLimited(board, depth + 1, true, aiSymbol, humanSymbol, maxDepth);
            board[move] = null;
            minScore = Math.min(minScore, score);
        }
        return minScore;
    }
};

/**
 * Get AI move based on difficulty level
 * @param {Array} moves - Array of moves made so far
 * @param {String} aiSymbol - AI's symbol ('X' or 'O')
 * @param {String} difficulty - 'easy' | 'medium' | 'hard'
 * @returns {Number} - Position to play (0-8)
 */
const getAIMove = (moves, aiSymbol, difficulty = 'hard') => {
    const board = getBoardState(moves);
    const humanSymbol = aiSymbol === 'X' ? 'O' : 'X';

    switch (difficulty) {
        case 'easy':
            // 50% random, 50% minimax with depth 1
            if (Math.random() < 0.5) {
                return getRandomMove(board);
            } else {
                return getBestMoveWithDepth(board, aiSymbol, humanSymbol, 1);
            }

        case 'medium':
            // Minimax with depth 3-4
            const mediumDepth = Math.random() < 0.5 ? 3 : 4;
            return getBestMoveWithDepth(board, aiSymbol, humanSymbol, mediumDepth);

        case 'hard':
            // Full minimax (unbeatable)
            return getBestMoveWithDepth(board, aiSymbol, humanSymbol, null);

        default:
            return getBestMoveWithDepth(board, aiSymbol, humanSymbol, null);
    }
};

module.exports = {
    getAIMove,
    minimax
};
