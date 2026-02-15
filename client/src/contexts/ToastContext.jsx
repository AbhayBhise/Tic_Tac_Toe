import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        const newToast = { id, message, type };

        setToasts(prev => [...prev, newToast]);

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message) => showToast(message, 'success'), [showToast]);
    const error = useCallback((message) => showToast(message, 'error'), [showToast]);
    const info = useCallback((message) => showToast(message, 'info'), [showToast]);
    const warning = useCallback((message) => showToast(message, 'warning'), [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, info, warning, toasts, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};
