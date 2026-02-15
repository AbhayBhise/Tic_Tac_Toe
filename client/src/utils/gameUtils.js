/**
 * Game utility functions for client-side
 */

export const WINNING_LINES = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal \
    [2, 4, 6]  // Diagonal /
];

export const checkWinner = (board) => {
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

export const checkTie = (board) => {
    return board.every(cell => cell !== null) && !checkWinner(board);
};

export const getGameStatus = (board) => {
    const winResult = checkWinner(board);

    if (winResult) {
        return {
            isOver: true,
            winner: winResult.winner,
            winningLine: winResult.line,
            result: `${winResult.winner} Wins!`
        };
    }

    if (checkTie(board)) {
        return {
            isOver: true,
            winner: null,
            winningLine: [],
            result: "It's a Tie!"
        };
    }

    return {
        isOver: false,
        winner: null,
        winningLine: [],
        result: null
    };
};
