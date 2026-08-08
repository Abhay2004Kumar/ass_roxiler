import { useEffect, useState, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { listStores, submitRating, updateRating } from '../../api/user.api';
import { useDebounce } from '../../hooks/useDebounce';
import { PageHeader } from '../../components/shared/PageHeader';
import { StarRating } from '../../components/ui/StarRating';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';

function RateModal({ open, onClose, store, onSuccess }) {
  const [value,   setValue]   = useState(store?.user_rating || 0);
  const [loading, setLoading] = useState(false);
  const isEdit = !!store?.user_rating;

  // Sync value when store changes
  useEffect(() => { setValue(store?.user_rating || 0); }, [store]);

  const handleSubmit = async () => {
    if (!value) return toast.error('Please select a rating first');
    setLoading(true);
    try {
      if (isEdit) {
        await updateRating(store.user_rating_id, { value });
        toast.success('Rating updated!');
      } else {
        await submitRating({ store_id: store.id, value });
        toast.success('Rating submitted!');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Update Your Rating' : 'Rate This Store'}
      subtitle={store?.name}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit}>
            {isEdit ? 'Update Rating' : 'Submit Rating'}
          </Button>
        </>
      }
    >
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <p style={{ fontSize: '.875rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
          {isEdit ? 'Change your rating for this store:' : 'How would you rate this store?'}
        </p>
        <StarRating value={value} onChange={setValue} size={36} />
        {!value && <p style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: 10 }}>Click a star to select your rating</p>}
      </div>
    </Modal>
  );
}

export default function UserStores() {
  const [nameFilter,    setNameFilter]    = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const dName    = useDebounce(nameFilter);
  const dAddress = useDebounce(addressFilter);

  const [sortBy, setSortBy] = useState('name');
  const [order,  setOrder]  = useState('ASC');
  const [page,   setPage]   = useState(1);

  const [stores,  setStores]  = useState([]);
  const [meta,    setMeta]    = useState({});
  const [loading, setLoading] = useState(true);

  const [modalStore, setModalStore] = useState(null);

  const fetchStores = useCallback(() => {
    setLoading(true);
    listStores({ name: dName, address: dAddress, sortBy, order, page, limit: 12 })
      .then((res) => { setStores(res.data.data); setMeta(res.data.meta); })
      .catch(() => toast.error('Failed to load stores'))
      .finally(() => setLoading(false));
  }, [dName, dAddress, sortBy, order, page]);

  useEffect(() => { fetchStores(); }, [fetchStores]);
  useEffect(() => { setPage(1); }, [dName, dAddress]);

  return (
    <>
      <PageHeader
        title="Browse Stores"
        subtitle={`${meta.total ?? 0} stores available`}
      />

      {/* Search + Sort bar */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
        <input className="form-input" style={{ maxWidth: 240 }} placeholder="Search by name…"    value={nameFilter}    onChange={(e) => setNameFilter(e.target.value)} />
        <input className="form-input" style={{ maxWidth: 240 }} placeholder="Search by address…" value={addressFilter} onChange={(e) => setAddressFilter(e.target.value)} />
        <select
          className="form-input"
          style={{ maxWidth: 180 }}
          value={`${sortBy}_${order}`}
          onChange={(e) => {
            const [s, o] = e.target.value.split('_');
            setSortBy(s); setOrder(o); setPage(1);
          }}
        >
          <option value="name_ASC">Name A–Z</option>
          <option value="name_DESC">Name Z–A</option>
          <option value="avg_rating_DESC">Highest Rated</option>
          <option value="avg_rating_ASC">Lowest Rated</option>
          <option value="created_at_DESC">Newest First</option>
        </select>
      </div>

      {/* Store Grid */}
      {loading ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : stores.length === 0 ? (
        <div className="empty-state">
          <h3>No stores found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="store-grid">
          {stores.map((store, i) => (
            <div key={store.id} className="store-card" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="store-card-name">{store.name}</div>
              <div className="store-card-address">
                <MapPin size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                {store.address}
              </div>

              {/* Rating summary */}
              <div className="store-ratings-row">
                <div className="store-rating-col">
                  <div className="store-rating-col-label">Overall</div>
                  <StarRating value={parseFloat(store.avg_rating) || 0} readonly size={14} />
                </div>
                <div style={{ width: 1, height: 36, background: 'var(--border)' }} />
                <div className="store-rating-col">
                  <div className="store-rating-col-label">Your Rating</div>
                  {store.user_rating
                    ? <StarRating value={store.user_rating} readonly size={14} />
                    : <span style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Not rated</span>
                  }
                </div>
                <div style={{ width: 1, height: 36, background: 'var(--border)' }} />
                <div className="store-rating-col">
                  <div className="store-rating-col-label">Count</div>
                  <div className="store-rating-col-val">{store.rating_count ?? 0}</div>
                </div>
              </div>

              {/* Action button */}
              <div className="store-card-actions">
                <Button
                  variant={store.user_rating ? 'secondary' : 'primary'}
                  size="sm"
                  className="btn-full"
                  onClick={() => setModalStore(store)}
                >
                  {store.user_rating ? '✏️ Edit Rating' : '⭐ Rate Store'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && meta.totalPages > 1 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', marginTop: 16 }}>
          <Pagination page={page} totalPages={meta.totalPages} total={meta.total} limit={12} onChange={setPage} />
        </div>
      )}

      {/* Rate/Edit Modal */}
      <RateModal
        open={!!modalStore}
        store={modalStore}
        onClose={() => setModalStore(null)}
        onSuccess={fetchStores}
      />
    </>
  );
}
