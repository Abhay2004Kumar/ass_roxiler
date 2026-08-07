'use strict';

const db = require('../config/db');


/**
 * Fetch a user by PK (no password in result set).
 * @param {string} id UUID
 */
async function findById(id) {
  const { rows } = await db.query(
    `SELECT id, name, email, address, role, created_at
     FROM   users
     WHERE  id = $1`,
    [id],
  );
  return rows[0] || null;
}

/**
 * Fetch a user by email, including the hashed password.
 * Used exclusively by auth flows.
 * @param {string} email
 */
async function findByEmail(email) {
  const { rows } = await db.query(
    `SELECT * FROM users WHERE email = $1`,
    [email],
  );
  return rows[0] || null;
}


async function create({ name, email, hashedPassword, address, role = 'user' }) {
  const { rows } = await db.query(
    `INSERT INTO users (name, email, password, address, role)
     VALUES             ($1,   $2,    $3,       $4,      $5)
     RETURNING id, name, email, address, role, created_at`,
    [name, email, hashedPassword, address, role],
  );
  return rows[0];
}


async function updatePassword(id, hashedPassword) {
  const { rows } = await db.query(
    `UPDATE users
     SET    password   = $1
     WHERE  id         = $2
     RETURNING id, name, email, role`,
    [hashedPassword, id],
  );
  return rows[0] || null;
}

/**
 * List users with optional ILIKE filters, sort, and pagination.
 *
 * @param {{ name?, email?, address?, role?, limit, offset, sortBy, order }} opts
 * @returns {{ rows: object[], total: number }}
 */
async function listUsers({ name, email, address, role, limit, offset, sortBy, order }) {
  const clauses = [];
  const params = [];

  if (name) {
    params.push(`%${name}%`);
    clauses.push(`u.name ILIKE $${params.length}`);
  }
  if (email) {
    params.push(`%${email}%`);
    clauses.push(`u.email ILIKE $${params.length}`);
  }
  if (address) {
    params.push(`%${address}%`);
    clauses.push(`u.address ILIKE $${params.length}`);
  }
  if (role) {
    params.push(role);
    clauses.push(`u.role = $${params.length}`);
  }

  const WHERE = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';


  const ALLOWED_SORT = ['name', 'email', 'role', 'created_at'];
  const col = ALLOWED_SORT.includes(sortBy) ? `u.${sortBy}` : 'u.created_at';
  const dir = order === 'DESC' ? 'DESC' : 'ASC';

  const [countResult, dataResult] = await Promise.all([
    db.query(`SELECT COUNT(*)::int AS cnt FROM users u ${WHERE}`, params),
    db.query(
      `SELECT u.id, u.name, u.email, u.address, u.role, u.created_at
       FROM   users u
       ${WHERE}
       ORDER  BY ${col} ${dir}
       LIMIT  $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset],
    ),
  ]);

  return {
    rows: dataResult.rows,
    total: countResult.rows[0].cnt,
  };
}

module.exports = { findById, findByEmail, create, updatePassword, listUsers };
