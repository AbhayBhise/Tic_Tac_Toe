import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameBoard from '../components/GameBoard';
import { startLocalMultiplayerGame, makeLocalMultiplayerMove } from '../services/gameService';
import { getGameStatus } from '../utils/gameUtils';
import '../styles/LocalMultiplayer.css';

const LocalMultiplayer = () => {
    const [gameState, setGameState] = useState('setup'); // setup, playing, finished
    const [player1Name, setPlayer1Name] = useState('');
    const [player2Name, setPlayer2Name] = useState('');
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
            const response = await startLocalMultiplayerGame(player1Name, player2Name);

            if (response.success) {
                setMatchId(response.data.matchId);
                setBoard(Array(9).fill(null));
                setCurrentPlayer('X');
                setGameState('playing');
                setGameResult(null);
                setWinningLine([]);
            }
        } catch (error) {
            console.error('Error starting game:', error);
            alert('Failed to start game. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCellClick = async (index) => {
        if (isProcessing || gameState !== 'playing' || board[index] !== null) {
            return;
        }

        setIsProcessing(true);

        try {
            // Make move
            const newBoard = [...board];
            newBoard[index] = currentPlayer;
            setBoard(newBoard);

            // Send move to backend
            const response = await makeLocalMultiplayerMove(matchId, index, currentPlayer);

            if (response.success) {
                if (response.data.gameOver) {
                    // Game ended
                    setGameState('finished');
                    setGameResult(response.data.winner === 'tie' ? "It's a Tie!" : `${response.data.winner} Wins!`);
                    setWinningLine(response.data.winningLine || []);
                } else {
                    // Switch player
                    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
                }
            }
        } catch (error) {
            console.error('Error making move:', error);
            alert('Failed to make move. Please try again.');
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
        <div className="local-multiplayer-container">
            <div className="game-header">
                <button onClick={handleBackToHome} className="btn-back">
                    ← Back to Home
                </button>
                <h1>Local Multiplayer</h1>
            </div>

            {gameState === 'setup' && (
                <div className="setup-panel">
                    <div className="setup-card">
                        <h2>Player Setup</h2>
                        <p className="subtitle">Pass and play on the same device!</p>

                        <div className="setup-group">
                            <label>
                                <span className="player-icon x">X</span>
                                Player 1 Name
                            </label>
                            <input
                                type="text"
                                value={player1Name}
                                onChange={(e) => setPlayer1Name(e.target.value)}
                                placeholder="Enter Player 1 name (optional)"
                                className="input-field"
                            />
                        </div>

                        <div className="setup-group">
                            <label>
                                <span className="player-icon o">O</span>
                                Player 2 Name
                            </label>
                            <input
                                type="text"
                                value={player2Name}
                                onChange={(e) => setPlayer2Name(e.target.value)}
                                placeholder="Enter Player 2 name (optional)"
                                className="input-field"
                            />
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
                    <div className="players-info">
                        <div className={`player-card ${currentPlayer === 'X' && gameState === 'playing' ? 'active' : ''}`}>
                            <span className="player-symbol">X</span>
                            <span className="player-name">{player1Name || 'Player 1'}</span>
                        </div>
                        <div className="vs">VS</div>
                        <div className={`player-card ${currentPlayer === 'O' && gameState === 'playing' ? 'active' : ''}`}>
                            <span className="player-symbol">O</span>
                            <span className="player-name">{player2Name || 'Player 2'}</span>
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

export default LocalMultiplayer;
