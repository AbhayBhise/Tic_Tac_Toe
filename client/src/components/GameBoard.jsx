import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/GameBoard.css';

const GameBoard = ({
    board,
    onCellClick,
    winningLine,
    disabled,
    currentPlayer
}) => {
    const [animatingCells, setAnimatingCells] = useState([]);

    // Animate winning line
    useEffect(() => {
        if (winningLine && winningLine.length > 0) {
            setAnimatingCells(winningLine);
        } else {
            setAnimatingCells([]);
        }
    }, [winningLine]);

    const handleCellClick = (index) => {
        if (disabled || board[index] !== null) {
            return;
        }
        onCellClick(index);
    };

    const getCellClassName = (index) => {
        let className = 'cell';

        if (board[index]) {
            className += ` filled ${board[index].toLowerCase()}`;
        }

        if (animatingCells.includes(index)) {
            className += ' winning';
        }

        if (disabled) {
            className += ' disabled';
        }

        return className;
    };

    return (
        <div className={`game-board ${disabled ? 'board-disabled' : ''}`}>
            <div className="board-grid">
                {board.map((cell, index) => (
                    <div
                        key={index}
                        className={getCellClassName(index)}
                        onClick={() => handleCellClick(index)}
                    >
                        {cell && <span className="cell-value">{cell}</span>}
                    </div>
                ))}
            </div>
            {currentPlayer && !disabled && (
                <div className="turn-indicator">
                    <span className="player-symbol">{currentPlayer}</span>'s Turn
                </div>
            )}
            {disabled && !winningLine.length && (
                <div className="board-loading-overlay">
                    <div className="spinner-mini"></div>
                </div>
            )}
        </div>
    );
};

GameBoard.propTypes = {
    board: PropTypes.arrayOf(PropTypes.string).isRequired,
    onCellClick: PropTypes.func.isRequired,
    winningLine: PropTypes.arrayOf(PropTypes.number),
    disabled: PropTypes.bool,
    currentPlayer: PropTypes.string
};

GameBoard.defaultProps = {
    winningLine: [],
    disabled: false,
    currentPlayer: null
};

export default GameBoard;
