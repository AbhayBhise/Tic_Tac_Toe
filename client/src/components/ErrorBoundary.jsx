import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '40px',
                        maxWidth: '500px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }}>
                        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>😵</h1>
                        <h2 style={{ color: '#333', marginBottom: '10px' }}>Oops! Something went wrong</h2>
                        <p style={{ color: '#666', marginBottom: '30px' }}>
                            The application encountered an unexpected error. Please refresh the page to continue.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '12px 30px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Refresh Page
                        </button>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details style={{ marginTop: '20px', textAlign: 'left' }}>
                                <summary style={{ cursor: 'pointer', color: '#666' }}>Error Details</summary>
                                <pre style={{
                                    background: '#f5f5f5',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    overflow: 'auto',
                                    fontSize: '12px',
                                    marginTop: '10px'
                                }}>
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
