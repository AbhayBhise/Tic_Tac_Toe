import apiClient from '../utils/apiClient';

export const getUserProfile = async () => {
    const response = await apiClient.get('/api/user/profile');
    return response.data;
};

export const updateUserProfile = async (data) => {
    const response = await apiClient.put('/api/user/profile', data);
    return response.data;
};

export const getMatchHistory = async (page = 1, limit = 10) => {
    const response = await apiClient.get(`/api/user/matches?page=${page}&limit=${limit}`);
    return response.data;
};

export const updateTheme = async (themeId) => {
    const response = await apiClient.put('/api/user/theme', { themeId });
    return response.data;
};
