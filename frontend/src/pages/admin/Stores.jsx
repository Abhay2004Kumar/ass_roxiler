import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { listStores, createStore, listUsers } from '../../api/admin.api';
import { createStoreSchema } from '../../utils/validators';
import { useDebounce } from '../../hooks/useDebounce';
import { PageHeader } from '../../components/shared/PageHeader';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { StarRating } from '../../components/ui/StarRating';
import { Pagination } from '../../components/ui/Pagination';

const COLUMNS = [
  { key: 'name', label: 'Store Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  {
    key: 'address', label: 'Address', sortable: false,
    render: (v) => <span style={{ maxWidth: 200, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>{v || '—'}</span>
  },
  {
    key: 'avg_rating', label: 'Avg Rating', sortable: true,
    render: (v) => <StarRating value={parseFloat(v) || 0} readonly size={15} />
  },
  {
    key: 'rating_count', label: 'Ratings', sortable: false,
    render: (v) => <span style={{ color: 'var(--text-secondary)' }}>{v ?? 0}</span>
  },
  {
    key: 'created_at', label: 'Added', sortable: true,
    render: (v) => new Date(v).toLocaleDateString()
  },
];

export default function AdminStores() {

  const [nameFilter, setNameFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const dName = useDebounce(nameFilter);
  const dAddress = useDebounce(addressFilter);

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('DESC');
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchStores = useCallback(() => {
    setLoading(true);
    listStores({ name: dName, address: dAddress, page, sortBy, order, limit: 10 })
      .then((res) => { setRows(res.data.data); setMeta(res.data.meta); })
      .catch(() => toast.error('Failed to fetch stores'))
      .finally(() => setLoading(false));
  }, [dName, dAddress, page, sortBy, order]);

  useEffect(() => { fetchStores(); }, [fetchStores]);
  useEffect(() => { setPage(1); }, [dName, dAddress]);

  const handleSort = (col) => {
    if (sortBy === col) setOrder((o) => (o === 'ASC' ? 'DESC' : 'ASC'));
    else { setSortBy(col); setOrder('ASC'); }
    setPage(1);
  };


  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [owners, setOwners] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(createStoreSchema),
  });

  const openModal = () => {
    listUsers({ role: 'store_owner', limit: 100, sortBy: 'name', order: 'ASC' })
      .then((res) => setOwners(res.data.data))
      .catch(() => { });
    setModalOpen(true);
  };

  const onAddStore = async (data) => {
    setSaving(true);
    try {
      await createStore({ ...data, owner_id: data.owner_id || null });
      toast.success(`Store "${data.name.split(' ')[0]}…" created!`);
      reset();
      setModalOpen(false);
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create store');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Stores"
        subtitle={`${meta.total ?? 0} stores on the platform`}
        actions={
          <Button variant="primary" onClick={openModal}>
            <Plus size={15} /> Add Store
          </Button>
        }
      />

      <div className="table-container" style={{ marginBottom: 0 }}>
        <div className="filters-bar">
          <input className="form-input" placeholder="Search name…" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
          <input className="form-input" placeholder="Search address…" value={addressFilter} onChange={(e) => setAddressFilter(e.target.value)} />
        </div>

        <Table
          columns={COLUMNS}
          rows={rows}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
          loading={loading}
          emptyMessage="No stores match the current filters"
        />

        <Pagination page={page} totalPages={meta.totalPages} total={meta.total} limit={10} onChange={setPage} />
      </div>

      {/* Add Store Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); reset(); }}
        title="Add New Store"
        subtitle="Register a store on the platform"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setModalOpen(false); reset(); }}>Cancel</Button>
            <Button variant="primary" loading={saving} onClick={handleSubmit(onAddStore)}>Create Store</Button>
          </>
        }
      >
        <Input label="Store Name" id="as-name" placeholder="The Coffee Corner Experience (min 20 chars)" error={errors.name?.message}    {...register('name')} />
        <Input label="Email" id="as-email" type="email" placeholder="store@example.com" error={errors.email?.message}   {...register('email')} />
        <Input label="Address" id="as-address" placeholder="123 Commerce St, City, Country" error={errors.address?.message} {...register('address')} />
        <Select label="Assign Owner (optional)" id="as-owner" error={errors.owner_id?.message} {...register('owner_id')}>
          <option value="">— No owner —</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
          ))}
        </Select>
      </Modal>
    </>
  );
}
