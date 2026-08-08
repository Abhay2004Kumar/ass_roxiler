import { useEffect, useState } from 'react';
import { Users, Store, Star } from 'lucide-react';
import { getDashboard } from '../../api/admin.api';
import { StatCard } from '../../components/shared/StatCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => setStats(res.data.data))
      .catch(() => toast.error('Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Here's what's happening on the platform today."
      />

      <div className="stat-cards-grid">
        <StatCard
          icon={Users}
          label="Total Users"
          value={loading ? '…' : stats?.totalUsers}
          colorClass="indigo"
          delay={0}
        />
        <StatCard
          icon={Store}
          label="Total Stores"
          value={loading ? '…' : stats?.totalStores}
          colorClass="emerald"
          delay={80}
        />
        <StatCard
          icon={Star}
          label="Total Ratings"
          value={loading ? '…' : stats?.totalRatings}
          colorClass="amber"
          delay={160}
        />
      </div>

      {/* Quick-access info card */}
      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: 10, fontSize: '1rem' }}>Quick Actions</h3>
        <p style={{ fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Use the sidebar to navigate to <strong style={{ color: 'var(--text-primary)' }}>Users</strong> to manage accounts,
          or <strong style={{ color: 'var(--text-primary)' }}>Stores</strong> to add and view registered stores.
        </p>
      </div>
    </>
  );
}
