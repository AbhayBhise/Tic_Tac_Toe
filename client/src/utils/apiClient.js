import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = error.response?.data?.message ||
            error.response?.data?.errors?.[0]?.message ||
            error.message ||
            'An unexpected error occurred';

        // Handle 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Only redirect if not already on login/signup page
            if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
                window.location.href = '/login';
            }
        }

        // Return structured error for components to handle
        const structuredError = new Error(errorMessage);
        structuredError.response = error.response;
        structuredError.validationErrors = error.response?.data?.errors;

        return Promise.reject(structuredError);
    }
);

export default apiClient;
