'use strict';

const bcrypt = require('bcryptjs');

// 12 rounds strikes a reasonable balance between security and latency
const SALT_ROUNDS = 12;

/**
 * Hash a plaintext password.
 * @param {string} plain
 * @returns {Promise<string>} bcrypt hash
 */
const hashPassword = (plain) => bcrypt.hash(plain, SALT_ROUNDS);

/**
 * Compare a plaintext password against a stored bcrypt hash.
 * @param {string} plain
 * @param {string} hashed
 * @returns {Promise<boolean>}
 */
const comparePasswords = (plain, hashed) => bcrypt.compare(plain, hashed);

module.exports = { hashPassword, comparePasswords };
