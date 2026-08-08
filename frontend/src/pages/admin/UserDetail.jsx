import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Shield, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUserDetail } from '../../api/admin.api';
import { RoleBadge } from '../../components/ui/Badge';
import { StarRating } from '../../components/ui/StarRating';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserDetail(id)
      .then((res) => setUser(res.data.data))
      .catch(() => { toast.error('User not found'); navigate('/admin/users'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (!user)   return null;

  const initials = user.name?.slice(0, 2).toUpperCase();

  return (
    <>
      <button className="back-btn" onClick={() => navigate('/admin/users')}>
        <ArrowLeft size={15} /> Back to Users
      </button>

      <div className="user-detail-card">
        {/* Header */}
        <div className="user-detail-header">
          <div className="user-detail-avatar">{initials}</div>
          <div>
            <div className="user-detail-name">{user.name}</div>
            <div className="user-detail-email">{user.email}</div>
            <div style={{ marginTop: 8 }}><RoleBadge role={user.role} /></div>
          </div>
        </div>

        {/* Fields */}
        <div className="user-detail-fields">
          <div>
            <div className="udfield-label">
              <Mail size={11} style={{ display: 'inline', marginRight: 4 }} />Email
            </div>
            <div className="udfield-value">{user.email}</div>
          </div>
          <div>
            <div className="udfield-label">
              <MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />Address
            </div>
            <div className="udfield-value">{user.address || '—'}</div>
          </div>
          <div>
            <div className="udfield-label">
              <Shield size={11} style={{ display: 'inline', marginRight: 4 }} />Role
            </div>
            <div className="udfield-value" style={{ textTransform: 'capitalize' }}>{user.role?.replace('_', ' ')}</div>
          </div>
          <div>
            <div className="udfield-label">Joined</div>
            <div className="udfield-value">{new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>

        {/* Store section — only for store_owners */}
        {user.role === 'store_owner' && user.store && (
          <div style={{ padding: '24px 28px', borderTop: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 16 }}>
              <Star size={11} style={{ display: 'inline', marginRight: 4 }} />Owned Store
            </h3>
            <div style={{ background: 'var(--accent-muted)', border: '1px solid var(--border-hover)', borderRadius: 'var(--r-md)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{user.store.name}</div>
                <div style={{ fontSize: '.8125rem', color: 'var(--text-secondary)' }}>{user.store.address}</div>
                <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>{user.store.email}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>Avg Rating</div>
                <StarRating value={parseFloat(user.store.avg_rating) || 0} readonly size={18} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
