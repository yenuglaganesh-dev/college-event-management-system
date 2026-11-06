import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--ink-secondary)' }}>
                Validating session...
            </div>
        );
    }

    if (!isAuthenticated) {
        if (allowedRoles.includes('ROLE_ADMIN')) {
            return <Navigate to="/admin-login" state={{ from: location }} replace />;
        }
        if (allowedRoles.includes('ROLE_ORGANIZER')) {
            return <Navigate to="/organizer-login" state={{ from: location }} replace />;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect unauthorized user to their own dashboard
        if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
        if (user.role === 'ROLE_ORGANIZER') return <Navigate to="/organizer" replace />;
        return <Navigate to="/student" replace />;
    }

    return children;
}

