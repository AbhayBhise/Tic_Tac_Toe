import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import SinglePlayer from './pages/SinglePlayer';
import LocalMultiplayer from './pages/LocalMultiplayer';
import OnlineMultiplayer from './pages/OnlineMultiplayer';
import Profile from './pages/Profile';
import ThemeStore from './pages/ThemeStore';
import './styles/App.css';

// Component to handle root route
const RootRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ToastProvider>
          <AuthProvider>
            <Toast />
            <Routes>
              <Route path="/" element={<RootRoute />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/single-player"
                element={
                  <ProtectedRoute>
                    <SinglePlayer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/local-multiplayer"
                element={
                  <ProtectedRoute>
                    <LocalMultiplayer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/online-multiplayer"
                element={
                  <ProtectedRoute>
                    <OnlineMultiplayer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/theme-store"
                element={
                  <ProtectedRoute>
                    <ThemeStore />
                  </ProtectedRoute>
                }
              />

              {/* 404 route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
