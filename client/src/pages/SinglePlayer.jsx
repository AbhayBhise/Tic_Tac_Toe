import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import GameBoard from '../components/GameBoard';
import { startSinglePlayerGame, makeSinglePlayerMove } from '../services/gameService';
import { getGameStatus } from '../utils/gameUtils';
import '../styles/SinglePlayer.css';

const SinglePlayer = () => {
    const { error: showError } = useToast();
    const [gameState, setGameState] = useState('setup'); // setup, playing, finished
    const [difficulty, setDifficulty] = useState('medium');
    const [playerSymbol, setPlayerSymbol] = useState('X');
    const [board, setBoard] = useState(Array(9).fill(null));
    const [matchId, setMatchId] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [gameResult, setGameResult] = useState(null);
    const [winningLine, setWinningLine] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const navigate = useNavigate();

    const handleStartGame = async () => {
        try {
            setIsProcessing(true);
            const response = await startSinglePlayerGame(difficulty, playerSymbol);

            if (response.success) {
                setMatchId(response.data.matchId);
                setBoard(Array(9).fill(null));
                setCurrentPlayer('X');
                setGameState('playing');
                setGameResult(null);
                setWinningLine([]);

                // If AI goes first
                if (response.data.firstMove === 'ai') {
                    // AI will make first move immediately
                    setTimeout(() => {
                        handleAIFirstMove(response.data.matchId);
                    }, 500);
                }
            }
        } catch (error) {
            console.error('Error starting game:', error);
            showError(error.message || 'Failed to start game. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAIFirstMove = async (matchIdParam) => {
        try {
            // For AI first move, send position 4 (center) as a dummy - backend will ignore and make AI move
            const response = await makeSinglePlayerMove(matchIdParam, 4);

            if (response.success) {
                const aiMove = response.data.aiMove;
                const newBoard = [...board];
                newBoard[aiMove] = 'O';
                setBoard(newBoard);
                setCurrentPlayer('X');
            }
        } catch (error) {
            console.error('Error with AI first move:', error);
        }
    };

    const handleCellClick = async (index) => {
        if (isProcessing || gameState !== 'playing' || board[index] !== null) {
            return;
        }

        setIsProcessing(true);

        try {
            // Make player move
            const newBoard = [...board];
            newBoard[index] = playerSymbol;
            setBoard(newBoard);

            // Check if player won
            const status = getGameStatus(newBoard);
            if (status.isOver) {
                setGameState('finished');
                setGameResult(status.result);
                setWinningLine(status.winningLine);
                setIsProcessing(false);
                return;
            }

            // Send move to backend (will get AI response)
            const response = await makeSinglePlayerMove(matchId, index);

            if (response.success) {
                if (response.data.gameOver) {
                    // Game ended
                    setGameState('finished');
                    setGameResult(response.data.winner === 'tie' ? "It's a Tie!" : `${response.data.winner} Wins!`);
                    setWinningLine(response.data.winningLine || []);
                } else {
                    // AI made a move
                    const aiMove = response.data.aiMove;
                    const boardAfterAI = [...newBoard];
                    boardAfterAI[aiMove] = playerSymbol === 'X' ? 'O' : 'X';
                    setBoard(boardAfterAI);

                    // Check if AI won
                    const statusAfterAI = getGameStatus(boardAfterAI);
                    if (statusAfterAI.isOver) {
                        setGameState('finished');
                        setGameResult(statusAfterAI.result);
                        setWinningLine(statusAfterAI.winningLine);
                    }
                }
            }
        } catch (error) {
            console.error('Error making move:', error);
            showError(error.message || 'Failed to make move. Please try again.');
            // Revert the move
            const revertBoard = [...board];
            revertBoard[index] = null;
            setBoard(revertBoard);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePlayAgain = () => {
        setGameState('setup');
        setBoard(Array(9).fill(null));
        setMatchId(null);
        setCurrentPlayer('X');
        setGameResult(null);
        setWinningLine([]);
    };

    const handleBackToHome = () => {
        navigate('/home');
    };

    return (
        <div className="single-player-container">
            <div className="game-header">
                <button onClick={handleBackToHome} className="btn-back">
                    ← Back to Home
                </button>
                <h1>Single Player</h1>
            </div>

            {gameState === 'setup' && (
                <div className="setup-panel">
                    <div className="setup-card">
                        <h2>Game Setup</h2>

                        <div className="setup-group">
                            <label>Choose Difficulty</label>
                            <div className="difficulty-options">
                                {['easy', 'medium', 'hard'].map((level) => (
                                    <button
                                        key={level}
                                        className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
                                        onClick={() => setDifficulty(level)}
                                    >
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <p className="difficulty-desc">
                                {difficulty === 'easy' && '🟢 Perfect for beginners'}
                                {difficulty === 'medium' && '🟡 A balanced challenge'}
                                {difficulty === 'hard' && '🔴 Unbeatable AI!'}
                            </p>
                        </div>

                        <div className="setup-group">
                            <label>Choose Your Symbol</label>
                            <div className="symbol-options">
                                <button
                                    className={`symbol-btn ${playerSymbol === 'X' ? 'active' : ''}`}
                                    onClick={() => setPlayerSymbol('X')}
                                >
                                    X
                                </button>
                                <button
                                    className={`symbol-btn ${playerSymbol === 'O' ? 'active' : ''}`}
                                    onClick={() => setPlayerSymbol('O')}
                                >
                                    O
                                </button>
                            </div>
                            <p className="symbol-note">
                                {playerSymbol === 'X' ? 'You go first!' : 'AI goes first!'}
                            </p>
                        </div>

                        <button
                            onClick={handleStartGame}
                            className="btn-start"
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Starting...' : 'Start Game'}
                        </button>
                    </div>
                </div>
            )}

            {(gameState === 'playing' || gameState === 'finished') && (
                <div className="game-panel">
                    <div className="game-info">
                        <div className="info-item">
                            <span className="label">Difficulty:</span>
                            <span className="value">{difficulty}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">You:</span>
                            <span className="value">{playerSymbol}</span>
                        </div>
                    </div>

                    <GameBoard
                        board={board}
                        onCellClick={handleCellClick}
                        winningLine={winningLine}
                        disabled={gameState === 'finished' || isProcessing}
                        currentPlayer={gameState === 'playing' && !isProcessing ? currentPlayer : null}
                    />

                    {gameResult && (
                        <div className="game-result">
                            <h2>{gameResult}</h2>
                            <div className="result-actions">
                                <button onClick={handlePlayAgain} className="btn-play-again">
                                    Play Again
                                </button>
                                <button onClick={handleBackToHome} className="btn-home">
                                    Home
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SinglePlayer;
