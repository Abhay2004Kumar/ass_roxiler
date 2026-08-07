'use strict';

/**
 * Parse common list-query params and return safe, normalised values.
 *
 * @param {object}   query              Express req.query
 * @param {string[]} allowedSortFields  Whitelist of sortable columns
 * @returns {{ page, limit, offset, sortBy, order }}
 */
function parsePagination(query = {}, allowedSortFields = ['name', 'email', 'created_at']) {
  const page   = Math.max(parseInt(query.page,  10) || 1,  1);
  const limit  = Math.min(parseInt(query.limit, 10) || 20, 100);
  const offset = (page - 1) * limit;

  const rawSort = (query.sortBy || 'created_at').toLowerCase();
  const sortBy  = allowedSortFields.includes(rawSort) ? rawSort : allowedSortFields[0] || 'created_at';
  const order   = (query.order || '').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  return { page, limit, offset, sortBy, order };
}

/**
 * Wrap a data array and a total count into a consistent paginated envelope.
 *
 * @param {any[]}  data
 * @param {number} total
 * @param {{ page: number, limit: number }} pagination
 */
function buildPaginatedResponse(data, total, { page, limit }) {
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

module.exports = { parsePagination, buildPaginatedResponse };
