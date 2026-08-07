'use strict';

const db = require('../config/db');

async function findByUserAndStore(userId, storeId) {
  const { rows } = await db.query(
    `SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2`,
    [userId, storeId],
  );
  return rows[0] || null;
}


async function findById(id) {
  const { rows } = await db.query(
    `SELECT * FROM ratings WHERE id = $1`,
    [id],
  );
  return rows[0] || null;
}


async function create({ userId, storeId, value }) {
  const { rows } = await db.query(
    `INSERT INTO ratings (user_id, store_id, value)
     VALUES              ($1,      $2,       $3)
     RETURNING *`,
    [userId, storeId, value],
  );
  return rows[0];
}


async function update(id, value) {
  const { rows } = await db.query(
    `UPDATE ratings
     SET    value      = $1,
            updated_at = NOW()
     WHERE  id         = $2
     RETURNING *`,
    [value, id],
  );
  return rows[0] || null;
}

/**
 * Total number of ratings across the platform (admin dashboard).
 * @returns {number}
 */
async function getTotalCount() {
  const { rows } = await db.query(`SELECT COUNT(*)::int AS cnt FROM ratings`);
  return rows[0].cnt;
}

/**
 * List every user who has rated a specific store.
 * Used by the Store Owner dashboard.
 *
 * @param {string} storeId UUID
 */
async function listRatersForStore(storeId) {
  const { rows } = await db.query(
    `SELECT u.id, u.name, u.email,
            r.id         AS rating_id,
            r.value,
            r.created_at,
            r.updated_at
     FROM   ratings r
     JOIN   users   u ON u.id = r.user_id
     WHERE  r.store_id = $1
     ORDER  BY r.updated_at DESC`,
    [storeId],
  );
  return rows;
}

module.exports = {
  findByUserAndStore,
  findById,
  create,
  update,
  getTotalCount,
  listRatersForStore,
};
