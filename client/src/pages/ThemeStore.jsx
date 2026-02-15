import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { getThemes, purchaseTheme, selectTheme } from '../services/themeService';
import '../styles/ThemeStore.css';

const ThemeStore = () => {
    const navigate = useNavigate();
    const { success: showSuccess, error: showError } = useToast();
    const [themes, setThemes] = useState([]);
    const [userCoins, setUserCoins] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        fetchThemes();
    }, []);

    const fetchThemes = async () => {
        try {
            const response = await getThemes();
            setThemes(response.data);
            setUserCoins(response.userCoins || 0);
        } catch (error) {
            console.error('Theme fetch error:', error);
            console.error('Error response:', error.response);
            showError(error.response?.data?.message || 'Failed to load themes');
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (themeId, themeName, price) => {
        setProcessing(themeId);
        try {
            const response = await purchaseTheme(themeId);
            showSuccess(response.message);
            setUserCoins(response.data.remainingCoins);

            // Update themes list
            setThemes(themes.map(theme =>
                theme.id === themeId ? { ...theme, owned: true } : theme
            ));
        } catch (error) {
            showError(error.message || 'Failed to purchase theme');
        } finally {
            setProcessing(null);
        }
    };

    const handleSelect = async (themeId, themeName) => {
        setProcessing(themeId);
        try {
            const response = await selectTheme(themeId);
            showSuccess(response.message);

            // Update selected theme in list
            setThemes(themes.map(theme => ({
                ...theme,
                selected: theme.id === themeId
            })));
        } catch (error) {
            showError('Failed to select theme');
        } finally {
            setProcessing(null);
        }
    };

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'free': return '#4CAF50';
            case 'common': return '#2196F3';
            case 'rare': return '#9C27B0';
            case 'epic': return '#FF9800';
            default: return '#666';
        }
    };

    const filteredThemes = filter === 'all'
        ? themes
        : themes.filter(theme => theme.rarity === filter);

    if (loading) {
        return (
            <div className="theme-store-container">
                <div className="loading">Loading themes...</div>
            </div>
        );
    }

    return (
        <div className="theme-store-container">
            <div className="store-header">
                <button onClick={() => navigate('/home')} className="btn-back">
                    ← Back to Home
                </button>
                <h1>Theme Store</h1>
                <div className="coin-display">
                    <span className="coin-icon">🪙</span>
                    <span className="coin-amount">{userCoins}</span>
                    <span className="coin-label">Coins</span>
                </div>
            </div>

            <div className="store-filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Themes
                </button>
                <button
                    className={`filter-btn ${filter === 'free' ? 'active' : ''}`}
                    onClick={() => setFilter('free')}
                >
                    Free
                </button>
                <button
                    className={`filter-btn ${filter === 'common' ? 'active' : ''}`}
                    onClick={() => setFilter('common')}
                >
                    Common
                </button>
                <button
                    className={`filter-btn ${filter === 'rare' ? 'active' : ''}`}
                    onClick={() => setFilter('rare')}
                >
                    Rare
                </button>
                <button
                    className={`filter-btn ${filter === 'epic' ? 'active' : ''}`}
                    onClick={() => setFilter('epic')}
                >
                    Epic
                </button>
            </div>

            <div className="themes-grid">
                {filteredThemes.map(theme => (
                    <div key={theme.id} className="theme-card">
                        <div
                            className="theme-preview"
                            style={{ background: theme.assets.background }}
                        >
                            <div className="preview-board">
                                <div className="preview-cell">X</div>
                                <div className="preview-cell">O</div>
                                <div className="preview-cell">X</div>
                            </div>
                        </div>

                        <div className="theme-info">
                            <div className="theme-header">
                                <h3>{theme.name}</h3>
                                <span
                                    className="rarity-badge"
                                    style={{ backgroundColor: getRarityColor(theme.rarity) }}
                                >
                                    {theme.rarity.toUpperCase()}
                                </span>
                            </div>

                            <p className="theme-description">{theme.description}</p>

                            <div className="theme-price">
                                {theme.price === 0 ? (
                                    <span className="free-tag">FREE</span>
                                ) : (
                                    <>
                                        <span className="coin-icon">🪙</span>
                                        <span className="price-amount">{theme.price}</span>
                                    </>
                                )}
                            </div>

                            <div className="theme-actions">
                                {theme.selected ? (
                                    <div className="selected-indicator">
                                        ✓ Currently Active
                                    </div>
                                ) : theme.owned ? (
                                    <button
                                        onClick={() => handleSelect(theme.id, theme.name)}
                                        disabled={processing === theme.id}
                                        className="btn-select"
                                    >
                                        {processing === theme.id ? 'Selecting...' : 'Select Theme'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handlePurchase(theme.id, theme.name, theme.price)}
                                        disabled={processing === theme.id || userCoins < theme.price}
                                        className="btn-purchase"
                                    >
                                        {processing === theme.id
                                            ? 'Purchasing...'
                                            : userCoins < theme.price
                                                ? `Need ${theme.price - userCoins} more`
                                                : 'Purchase'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredThemes.length === 0 && (
                <div className="no-themes">
                    No themes found in this category.
                </div>
            )}
        </div>
    );
};

export default ThemeStore;
