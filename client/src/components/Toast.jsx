import { useToast } from '../contexts/ToastContext';
import '../styles/Toast.css';

const Toast = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`toast toast-${toast.type}`}
                    onClick={() => removeToast(toast.id)}
                >
                    <div className="toast-icon">
                        {toast.type === 'success' && '✓'}
                        {toast.type === 'error' && '✕'}
                        {toast.type === 'warning' && '⚠'}
                        {toast.type === 'info' && 'ℹ'}
                    </div>
                    <div className="toast-message">{toast.message}</div>
                    <button
                        className="toast-close"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeToast(toast.id);
                        }}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Toast;
