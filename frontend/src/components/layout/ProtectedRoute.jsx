import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROLE_HOME = {
  admin:       '/admin/dashboard',
  user:        '/user/stores',
  store_owner: '/owner/dashboard',
};

/**
 * Guards a route by role.
 * If the user is authenticated but has the wrong role, they're sent to their home.
 *
 * @param {string} allowedRole  — 'admin' | 'user' | 'store_owner'
 */
export function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={ROLE_HOME[user?.role] || '/login'} replace />;
  }

  return children;
}
