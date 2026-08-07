'use strict';

const db = require('../config/db');


/**
 * Fetch a single store with its aggregate rating.
 * @param {string} id UUID
 */
async function findById(id) {
  const { rows } = await db.query(
    `SELECT s.*,
            ROUND(AVG(r.value), 2)  AS avg_rating,
            COUNT(r.id)::int        AS rating_count
     FROM   stores s
     LEFT   JOIN ratings r ON r.store_id = s.id
     WHERE  s.id = $1
     GROUP  BY s.id`,
    [id],
  );
  return rows[0] || null;
}

/**
 * @param {string} email
 */
async function findByEmail(email) {
  const { rows } = await db.query(
    `SELECT * FROM stores WHERE email = $1`,
    [email],
  );
  return rows[0] || null;
}

/**
 * Fetch the store owned by a particular user (with avg rating).
 * Store owners have exactly one store.
 * @param {string} ownerId UUID
 */
async function findByOwnerId(ownerId) {
  const { rows } = await db.query(
    `SELECT s.*,
            ROUND(AVG(r.value), 2) AS avg_rating,
            COUNT(r.id)::int       AS rating_count
     FROM   stores s
     LEFT   JOIN ratings r ON r.store_id = s.id
     WHERE  s.owner_id = $1
     GROUP  BY s.id`,
    [ownerId],
  );
  return rows[0] || null;
}


async function create({ name, email, address, owner_id }) {
  const { rows } = await db.query(
    `INSERT INTO stores (name, email, address, owner_id)
     VALUES             ($1,   $2,    $3,      $4)
     RETURNING *`,
    [name, email, address, owner_id || null],
  );
  return rows[0];
}

/**
 * @param {{ name?, address?, limit, offset, sortBy, order, userId? }} opts
 * @returns {{ rows: object[], total: number }}
 */
async function listStores({ name, address, limit, offset, sortBy, order, userId = null }) {
  const filterParams = [];
  const filterClauses = [];

  if (name) {
    filterParams.push(`%${name}%`);
    filterClauses.push(`s.name ILIKE $${filterParams.length}`);
  }
  if (address) {
    filterParams.push(`%${address}%`);
    filterClauses.push(`s.address ILIKE $${filterParams.length}`);
  }

  const WHERE = filterClauses.length ? `WHERE ${filterClauses.join(' AND ')}` : '';

  // ── Count ────────────────────────────────────────────────────────────────
  const { rows: countRows } = await db.query(
    `SELECT COUNT(DISTINCT s.id)::int AS cnt FROM stores s ${WHERE}`,
    filterParams,
  );
  const total = countRows[0].cnt;

  const dataParams = [...filterParams];

  let userSelect = '';
  let userJoin = '';
  let groupExtra = '';

  if (userId) {
    dataParams.push(userId);
    const idx = dataParams.length;
    userSelect = `, ur.value AS user_rating, ur.id AS user_rating_id`;
    userJoin = `LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $${idx}`;
    groupExtra = ', ur.value, ur.id';
  }

  // Whitelist sort mapping (avg_rating uses the aggregate expression)
  const SORT_MAP = {
    name: 's.name',
    email: 's.email',
    address: 's.address',
    created_at: 's.created_at',
    avg_rating: 'ROUND(AVG(r.value), 2)',
  };
  const orderCol = SORT_MAP[sortBy] || 's.name';
  const safeOrder = order === 'DESC' ? 'DESC' : 'ASC';

  dataParams.push(limit, offset);
  const limitIdx = dataParams.length - 1;
  const offsetIdx = dataParams.length;

  const { rows } = await db.query(
    `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
            ROUND(AVG(r.value), 2)  AS avg_rating,
            COUNT(r.id)::int        AS rating_count
            ${userSelect}
     FROM   stores s
     LEFT   JOIN ratings r ON r.store_id = s.id
     ${userJoin}
     ${WHERE}
     GROUP  BY s.id ${groupExtra}
     ORDER  BY ${orderCol} ${safeOrder}
     LIMIT  $${limitIdx} OFFSET $${offsetIdx}`,
    dataParams,
  );

  return { rows, total };
}

module.exports = { findById, findByEmail, findByOwnerId, create, listStores };
