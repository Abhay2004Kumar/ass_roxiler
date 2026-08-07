'use strict';

const jwt = require('jsonwebtoken');

// Lazily read the secret so it's always the live env value
const getSecret = () => process.env.JWT_SECRET;
const EXPIRY    = () => process.env.JWT_EXPIRY || '7d';

/**
 * Sign a JWT access token.
 *
 * @param {{ sub: string, role: string }} payload
 * @returns {string} Signed JWT
 */
function signToken(payload) {
  return jwt.sign(payload, getSecret(), {
    expiresIn: EXPIRY(),
    algorithm: 'HS256',
  });
}

/**
 * Verify and decode a JWT.
 * Throws a JsonWebTokenError (or TokenExpiredError) on failure.
 *
 * @param {string} token
 * @returns {object} Decoded payload
 */
function verifyToken(token) {
  return jwt.verify(token, getSecret(), { algorithms: ['HS256'] });
}

module.exports = { signToken, verifyToken };
