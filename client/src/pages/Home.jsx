import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Home.css';

const Home = () => {
    const { user, logout } = useAuth();

    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="nav-brand">
                    <h2>🎮 Tic-Tac-Toe</h2>
                </div>
                <div className="nav-user">
                    <span>Welcome, {user.username}!</span>
                    <button onClick={logout} className="btn-logout">Logout</button>
                </div>
            </nav>

            <div className="home-content">
                <div className="hero-section">
                    <h1>Choose Your Game Mode</h1>
                    <p>Challenge yourself or compete with others!</p>
                </div>

                <div className="game-modes">
                    <Link to="/single-player" className="mode-card">
                        <div className="mode-icon">🤖</div>
                        <h3>Single Player</h3>
                        <p>Challenge the AI with multiple difficulty levels</p>
                    </Link>

                    <Link to="/local-multiplayer" className="mode-card">
                        <div className="mode-icon">👥</div>
                        <h3>Local Multiplayer</h3>
                        <p>Play with a friend on the same device</p>
                    </Link>

                    <Link to="/online-multiplayer" className="mode-card">
                        <div className="mode-icon">🌐</div>
                        <h3>Online Multiplayer</h3>
                        <p>Play with others around the world</p>
                    </Link>
                </div>

                <div className="secondary-options">
                    <Link to="/profile" className="secondary-link">
                        <span>📊</span> View Profile & Stats
                    </Link>
                    <Link to="/theme-store" className="secondary-link">
                        <span>🎨</span> Theme Store
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
