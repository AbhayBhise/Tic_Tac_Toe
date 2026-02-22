import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getUserProfile, getMatchHistory } from '../services/userService';
import '../styles/Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { error: showError, success: showSuccess } = useToast();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [matchesLoading, setMatchesLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ username: '', avatar: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
        fetchMatches(1);
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await getUserProfile();
            if (response.success) {
                setProfile(response.data);
                setEditData({
                    username: response.data.username,
                    avatar: response.data.avatar || ''
                });
            }
        } catch (err) {
            showError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchMatches = async (page) => {
        try {
            setMatchesLoading(true);
            const response = await getMatchHistory(page, 10);
            if (response.success) {
                setMatches(response.data.matches);
                setTotalPages(response.data.pagination.pages);
                setCurrentPage(page);
            }
        } catch (err) {
            showError(err.message || 'Failed to load match history');
        } finally {
            setMatchesLoading(false);
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing - reset data
            setEditData({
                username: profile.username,
                avatar: profile.avatar || ''
            });
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const response = await updateUserProfile(editData);
            if (response.success) {
                setProfile(response.data);
                updateUser(response.data);
                showSuccess('Profile updated successfully');
                setIsEditing(false);
            }
        } catch (err) {
            showError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchMatches(newPage);
        }
    };

    if (loading || !profile) {
        return (
            <div className="profile-loading">
                <div className="spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    const stats = profile.stats || {};
    const winRate = stats.gamesPlayed > 0
        ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1)
        : 0;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <button onClick={() => navigate('/home')} className="btn-back">
                    ← Back to Home
                </button>
                <h1>Player Profile</h1>
            </div>

            <div className="profile-content">
                {/* User Info Card */}
                <div className="profile-card user-info-card">
                    {isEditing ? (
                        <form onSubmit={handleSave} className="edit-profile-form">
                            <div className="avatar-preview-section">
                                <div className="avatar-large">
                                    {editData.avatar ? (
                                        <img src={editData.avatar} alt="Preview" />
                                    ) : (
                                        <span className="avatar-placeholder">
                                            {editData.username?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={editData.username}
                                    onChange={handleInputChange}
                                    required
                                    minLength="3"
                                    maxLength="20"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="avatar">Avatar URL</label>
                                <input
                                    type="url"
                                    id="avatar"
                                    name="avatar"
                                    value={editData.avatar}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/avatar.png"
                                />
                            </div>
                            <div className="edit-actions">
                                <button type="submit" className="btn-save" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" className="btn-cancel" onClick={handleEditToggle} disabled={saving}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="avatar-section">
                            <div className="avatar">
                                {profile.avatar ? (
                                    <img src={profile.avatar} alt="Avatar" />
                                ) : (
                                    <span className="avatar-placeholder">
                                        {profile.username?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="user-details">
                                <h2>{profile.username}</h2>
                                <p className="email">{profile.email}</p>
                                <button className="btn-edit-profile" onClick={handleEditToggle}>
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon games">🎮</div>
                        <div className="stat-value">{stats.gamesPlayed || 0}</div>
                        <div className="stat-label">Games Played</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon wins">🏆</div>
                        <div className="stat-value">{stats.wins || 0}</div>
                        <div className="stat-label">Wins</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon losses">📉</div>
                        <div className="stat-value">{stats.losses || 0}</div>
                        <div className="stat-label">Losses</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon ties">🤝</div>
                        <div className="stat-value">{stats.ties || 0}</div>
                        <div className="stat-label">Ties</div>
                    </div>

                    <div className="stat-card featured">
                        <div className="stat-icon rate">📊</div>
                        <div className="stat-value">{winRate}%</div>
                        <div className="stat-label">Win Rate</div>
                    </div>

                    <div className="stat-card featured">
                        <div className="stat-icon streak">🔥</div>
                        <div className="stat-value">{stats.bestStreak || 0}</div>
                        <div className="stat-label">Best Streak</div>
                    </div>
                </div>

                {/* Match History */}
                <div className="profile-card match-history-card">
                    <h3>Match History</h3>

                    {matchesLoading ? (
                        <div className="matches-loading">
                            <div className="spinner-small"></div>
                            <p>Loading matches...</p>
                        </div>
                    ) : matches.length === 0 ? (
                        <div className="no-matches">
                            <p>No matches played yet</p>
                            <button onClick={() => navigate('/home')} className="btn-play">
                                Start Playing
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="matches-table">
                                <div className="table-header">
                                    <div>Mode</div>
                                    <div>Opponent</div>
                                    <div>Result</div>
                                    <div>Date</div>
                                </div>
                                {matches.map((match) => (
                                    <div key={match._id} className="table-row">
                                        <div className="mode-badge">{match.mode}</div>
                                        <div className="opponent-name">{match.opponentName}</div>
                                        <div className={`result-badge result-${match.result}`}>
                                            {match.result === 'win' && '🏆 Win'}
                                            {match.result === 'loss' && '📉 Loss'}
                                            {match.result === 'tie' && '🤝 Tie'}
                                        </div>
                                        <div className="match-date">
                                            {new Date(match.completedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="btn-page"
                                    >
                                        Previous
                                    </button>
                                    <span className="page-info">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="btn-page"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
