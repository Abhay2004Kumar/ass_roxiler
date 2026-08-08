import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Store, Lock, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = {
  admin: [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users',     icon: Users,           label: 'Users' },
    { to: '/admin/stores',    icon: Store,           label: 'Stores' },
  ],
  user: [
    { to: '/user/stores',          icon: Store, label: 'Browse Stores' },
    { to: '/user/change-password', icon: Lock,  label: 'Change Password' },
  ],
  store_owner: [
    { to: '/owner/dashboard',         icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/owner/change-password',   icon: Lock,            label: 'Change Password' },
  ],
};

export function Sidebar() {
  const { user } = useAuth();
  const navItems = NAV[user?.role] || [];
  const initials = user?.name?.slice(0, 2).toUpperCase() || '??';

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Star size={18} />
        </div>
        <div>
          <div className="sidebar-brand-text">RateHub</div>
          <div className="sidebar-brand-sub">Store Rating Platform</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User chip */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role?.replace('_', ' ')}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
