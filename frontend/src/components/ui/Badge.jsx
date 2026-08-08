const ROLE_LABELS = { admin: 'Admin', user: 'User', store_owner: 'Store Owner' };

export function Badge({ variant, children }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export function RoleBadge({ role }) {
  return <Badge variant={role}>{ROLE_LABELS[role] || role}</Badge>;
}
