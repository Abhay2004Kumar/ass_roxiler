import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const TITLES = {
  '/admin/dashboard':       'Dashboard',
  '/admin/users':           'Manage Users',
  '/admin/stores':          'Manage Stores',
  '/user/stores':           'Browse Stores',
  '/user/change-password':  'Change Password',
  '/owner/dashboard':       'My Store Dashboard',
  '/owner/change-password': 'Change Password',
};

export function Topbar() {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const { pathname } = useLocation();

  const title = Object.entries(TITLES).find(([path]) => pathname.startsWith(path))?.[1] ?? 'RateHub';

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-actions">
        <button className="topbar-logout-btn" onClick={handleLogout}>
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </header>
  );
}
