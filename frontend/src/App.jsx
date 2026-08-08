import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout }      from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public
import Login    from './pages/Login';
import Register from './pages/Register';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers     from './pages/admin/Users';
import UserDetail     from './pages/admin/UserDetail';
import AdminStores    from './pages/admin/Stores';

// User
import UserStores        from './pages/user/Stores';
import UserChangePw      from './pages/user/ChangePassword';

// Owner
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerChangePw  from './pages/owner/ChangePassword';

const ROLE_HOME = {
  admin:       '/admin/dashboard',
  user:        '/user/stores',
  store_owner: '/owner/dashboard',
};

/** Redirect authenticated users to their home; send others to /login */
function RootRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user?.role] || '/login'} replace />;
}

/** Public route — redirect authenticated users away from login/register */
function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) return <Navigate to={ROLE_HOME[user?.role] || '/'} replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ───────────────────────────────────────────────────── */}
      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* ── Authenticated shell (sidebar + topbar) ────────────────────── */}
      <Route element={<AppLayout />}>
        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users"     element={<ProtectedRoute allowedRole="admin"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/users/:id" element={<ProtectedRoute allowedRole="admin"><UserDetail /></ProtectedRoute>} />
        <Route path="/admin/stores"    element={<ProtectedRoute allowedRole="admin"><AdminStores /></ProtectedRoute>} />

        {/* Normal User */}
        <Route path="/user/stores"          element={<ProtectedRoute allowedRole="user"><UserStores /></ProtectedRoute>} />
        <Route path="/user/change-password" element={<ProtectedRoute allowedRole="user"><UserChangePw /></ProtectedRoute>} />

        {/* Store Owner */}
        <Route path="/owner/dashboard"        element={<ProtectedRoute allowedRole="store_owner"><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/owner/change-password"  element={<ProtectedRoute allowedRole="store_owner"><OwnerChangePw /></ProtectedRoute>} />
      </Route>

      {/* ── Root + catch-all ─────────────────────────────────────────── */}
      <Route path="/"   element={<RootRedirect />} />
      <Route path="*"   element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1a1a2e',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#0d0d14' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#0d0d14' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
