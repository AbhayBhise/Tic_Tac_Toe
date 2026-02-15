import apiClient from '../utils/apiClient';

// Register new user
export const register = async (userData) => {
    const response = await apiClient.post('/api/auth/register', userData);
    if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
};

// Login user
export const login = async (credentials) => {
    const response = await apiClient.post('/api/auth/login', credentials);
    if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
};

// Get current user
export const getCurrentUser = async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
};

// Logout user
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
