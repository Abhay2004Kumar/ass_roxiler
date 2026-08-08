import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ page, totalPages, total, limit, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  // Build the visible page numbers with ellipsis logic
  const buildPages = () => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end   = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };
  const pages = buildPages();

  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing {from}–{to} of {total.toLocaleString()} results
      </span>

      <div className="pagination-controls">
        <button className="page-btn" onClick={() => onChange(page - 1)} disabled={page === 1}>
          <ChevronLeft size={14} />
        </button>

        {pages[0] > 1 && (
          <>
            <button className="page-btn" onClick={() => onChange(1)}>1</button>
            {pages[0] > 2 && <span className="page-btn" style={{ cursor: 'default' }}>…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            className={`page-btn ${p === page ? 'active' : ''}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="page-btn" style={{ cursor: 'default' }}>…</span>
            )}
            <button className="page-btn" onClick={() => onChange(totalPages)}>{totalPages}</button>
          </>
        )}

        <button className="page-btn" onClick={() => onChange(page + 1)} disabled={page === totalPages}>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
