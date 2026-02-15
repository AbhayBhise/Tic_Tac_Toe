import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setLocalError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        // Validation
        if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
            setLocalError('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        if (formData.username.length < 3) {
            setLocalError('Username must be at least 3 characters');
            return;
        }

        setIsLoading(true);

        const result = await register({
            email: formData.email,
            username: formData.username,
            password: formData.password
        });

        setIsLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setLocalError(result.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join the game and compete with others</p>
                </div>

                {localError && (
                    <div className="error-message">
                        {localError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            disabled={isLoading}
                            required
                            minLength={3}
                            maxLength={20}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            disabled={isLoading}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
