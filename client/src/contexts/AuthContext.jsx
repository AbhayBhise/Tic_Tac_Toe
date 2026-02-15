import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error('Error parsing stored user:', err);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }

        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            setError(null);
            const data = await loginService(credentials);
            setUser(data.data);
            return { success: true, data: data.data };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, message };
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const data = await registerService(userData);
            setUser(data.data);
            return { success: true, data: data.data };
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, message };
        }
    };

    const logout = () => {
        logoutService();
        setUser(null);
        setError(null);
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
