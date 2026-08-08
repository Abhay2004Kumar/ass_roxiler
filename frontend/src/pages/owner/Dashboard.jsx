import { useEffect, useState } from 'react';
import { Mail, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDashboard } from '../../api/owner.api';
import { PageHeader } from '../../components/shared/PageHeader';
import { StarRating } from '../../components/ui/StarRating';
import { Table } from '../../components/ui/Table';

const RATER_COLUMNS = [
  { key: 'name',       label: 'Customer Name', sortable: false },
  { key: 'email',      label: 'Email',          sortable: false },
  { key: 'value',      label: 'Rating',         sortable: false,
    render: (v) => <StarRating value={v} readonly size={16} /> },
  { key: 'updated_at', label: 'Last Updated',   sortable: false,
    render: (v) => new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
];

export default function OwnerDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (!data)   return null;

  const { store, raters } = data;
  const avgRating = parseFloat(store.avg_rating) || 0;

  return (
    <>
      <PageHeader
        title="My Store Dashboard"
        subtitle="Overview of your store's performance and ratings"
      />

      {/* Store hero card */}
      <div className="owner-hero">
        <div className="owner-hero-circle">
          <div className="owner-hero-num">{avgRating ? avgRating.toFixed(1) : '—'}</div>
          <div className="owner-hero-sub">/ 5.0</div>
        </div>
        <div className="owner-hero-info">
          <div className="owner-hero-name">{store.name}</div>
          <div className="owner-hero-addr">
            <MapPin size={13} style={{ display: 'inline', marginRight: 5 }} />
            {store.address}
          </div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <StarRating value={avgRating} readonly size={18} />
            <span style={{ fontSize: '.8125rem', color: 'var(--text-secondary)' }}>
              {store.rating_count} rating{store.rating_count !== 1 ? 's' : ''}
            </span>
            <span style={{ fontSize: '.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Mail size={12} /> {store.email}
            </span>
          </div>
        </div>
      </div>

      {/* Raters table */}
      <PageHeader
        title="Customer Ratings"
        subtitle={`${raters.length} customer${raters.length !== 1 ? 's' : ''} have rated your store`}
      />

      <Table
        columns={RATER_COLUMNS}
        rows={raters}
        loading={false}
        emptyMessage="No ratings yet — your store hasn't been rated yet"
      />
    </>
  );
}
