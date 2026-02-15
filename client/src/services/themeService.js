import apiClient from '../utils/apiClient';

// Get all themes
export const getThemes = async () => {
    const response = await apiClient.get('/api/themes');
    return response.data;
};

// Purchase a theme
export const purchaseTheme = async (themeId) => {
    const response = await apiClient.post(`/api/themes/${themeId}/purchase`);
    return response.data;
};

// Select/activate a theme
export const selectTheme = async (themeId) => {
    const response = await apiClient.put(`/api/themes/${themeId}/select`);
    return response.data;
};
