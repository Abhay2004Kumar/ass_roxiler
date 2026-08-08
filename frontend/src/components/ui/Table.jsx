import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

/**
 * Generic sortable data table.
 *
 * @param {Array}    columns   [{ key, label, sortable?, render?(value, row) }]
 * @param {Array}    rows      Data rows — must have a unique `id` field
 * @param {string}   sortBy    Currently active sort key
 * @param {string}   order     'ASC' | 'DESC'
 * @param {Function} onSort    Called with the clicked column key
 * @param {boolean}  loading
 * @param {string}   emptyMessage
 */
export function Table({ columns, rows, sortBy, order, onSort, loading, emptyMessage = 'No records found' }) {
  if (loading) {
    return (
      <div className="table-container">
        <div className="page-loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={col.sortable ? 'sortable' : ''}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <span className="th-inner">
                    {col.label}
                    {col.sortable && (
                      sortBy === col.key
                        ? order === 'ASC'
                          ? <ChevronUp   size={13} className="sort-icon active" />
                          : <ChevronDown size={13} className="sort-icon active" />
                        : <ChevronsUpDown size={13} className="sort-icon" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="table-empty">{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={row.id ?? idx}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : (row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
