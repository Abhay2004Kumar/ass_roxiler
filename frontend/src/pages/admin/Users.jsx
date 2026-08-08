import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { listUsers, createUser } from '../../api/admin.api';
import { createUserSchema } from '../../utils/validators';
import { useDebounce } from '../../hooks/useDebounce';
import { PageHeader } from '../../components/shared/PageHeader';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { RoleBadge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';

const COLUMNS = (onView) => [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  {
    key: 'address', label: 'Address', sortable: false,
    render: (v) => <span style={{ maxWidth: 220, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>{v || '—'}</span>
  },
  {
    key: 'role', label: 'Role', sortable: true,
    render: (v) => <RoleBadge role={v} />
  },
  {
    key: 'created_at', label: 'Joined', sortable: true,
    render: (v) => new Date(v).toLocaleDateString()
  },
  {
    key: 'actions', label: '', sortable: false,
    render: (_, row) => (
      <Button variant="ghost" size="sm" onClick={() => onView(row.id)}>
        <Eye size={14} /> View
      </Button>
    ),
  },
];

export default function AdminUsers() {
  const navigate = useNavigate();

  // ── Filters ──────────────────────────────────────────────────────────────
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const dName = useDebounce(nameFilter);
  const dEmail = useDebounce(emailFilter);
  const dAddress = useDebounce(addressFilter);

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('DESC');
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    listUsers({
      name: dName, email: dEmail, address: dAddress, role: roleFilter,
      page, sortBy, order, limit: 10,
    })
      .then((res) => { setRows(res.data.data); setMeta(res.data.meta); })
      .catch(() => toast.error('Failed to fetch users'))
      .finally(() => setLoading(false));
  }, [dName, dEmail, dAddress, roleFilter, page, sortBy, order]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [dName, dEmail, dAddress, roleFilter]);

  const handleSort = (col) => {
    if (sortBy === col) setOrder((o) => (o === 'ASC' ? 'DESC' : 'ASC'));
    else { setSortBy(col); setOrder('ASC'); }
    setPage(1);
  };


  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(createUserSchema),
    defaultValues: { role: 'user' },
  });

  const onAddUser = async (data) => {
    setSaving(true);
    try {
      await createUser(data);
      toast.success(`User "${data.name.split(' ')[0]}" created!`);
      reset();
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Users"
        subtitle={`${meta.total ?? 0} users registered on the platform`}
        actions={
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <Plus size={15} /> Add User
          </Button>
        }
      />

      {/* Filters */}
      <div className="table-container" style={{ marginBottom: 0 }}>
        <div className="filters-bar">
          <input className="form-input" placeholder="Search name…" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
          <input className="form-input" placeholder="Search email…" value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)} />
          <input className="form-input" placeholder="Search address…" value={addressFilter} onChange={(e) => setAddressFilter(e.target.value)} />
          <select className="form-input" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>

        <Table
          columns={COLUMNS((id) => navigate(`/admin/users/${id}`))}
          rows={rows}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
          loading={loading}
          emptyMessage="No users match the current filters"
        />

        <Pagination
          page={page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={10}
          onChange={setPage}
        />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); reset(); }}
        title="Add New User"
        subtitle="Creates a user account with the specified role"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setModalOpen(false); reset(); }}>Cancel</Button>
            <Button variant="primary" loading={saving} onClick={handleSubmit(onAddUser)}>Create User</Button>
          </>
        }
      >
        <Input label="Full Name" id="au-name" placeholder="Christopher James Nolan (min 20 chars)" error={errors.name?.message}    {...register('name')} />
        <Input label="Email" id="au-email" type="email" placeholder="user@example.com" error={errors.email?.message}   {...register('email')} />
        <Input label="Password" id="au-pw" type="password" placeholder="8–16 chars, 1 uppercase, 1 special" error={errors.password?.message} {...register('password')} />
        <Input label="Address" id="au-address" placeholder="123 Main St, City, Country" error={errors.address?.message} {...register('address')} />
        <Select label="Role" id="au-role" error={errors.role?.message} {...register('role')}>
          <option value="user">Normal User</option>
          <option value="admin">Admin</option>
          <option value="store_owner">Store Owner</option>
        </Select>
      </Modal>
    </>
  );
}
