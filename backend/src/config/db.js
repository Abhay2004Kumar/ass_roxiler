'use strict';

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for cloud providers
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('connect', () => {
  console.log('New client connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Unexpected pool error:', err.message);
});

/**
 * Run a single parameterised query against the pool.
 *
 * @param {string}  text    SQL statement with $1..$n placeholders
 * @param {any[]}   [params]
 * @returns {Promise<import('pg').QueryResult>}
 */
const query = (text, params) => pool.query(text, params);

/**
 * Checkout a client for manual transaction management.
 * Remember to call client.release() in a finally block.
 *
 * @returns {Promise<import('pg').PoolClient>}
 */
const getClient = () => pool.connect();

module.exports = { query, getClient, pool };
