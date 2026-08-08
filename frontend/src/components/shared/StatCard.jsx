export function StatCard({ icon: Icon, label, value, colorClass = 'indigo', delay = 0 }) {
  return (
    <div className="stat-card" style={{ animationDelay: `${delay}ms` }}>
      <div className={`stat-card-icon ${colorClass}`}>
        <Icon size={22} />
      </div>
      <div className="stat-card-body">
        <div className="stat-card-value">{value ?? <span style={{ opacity: .3 }}>—</span>}</div>
        <div className="stat-card-label">{label}</div>
      </div>
    </div>
  );
}
