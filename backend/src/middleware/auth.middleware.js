'use strict';

const { verifyToken } = require('../utils/jwt.util');
const ApiError = require('../utils/ApiError');
const UserModel = require('../models/user.model');

async function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization || '';

    if (!header.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Authorization header missing or malformed');
    }

    const token = header.slice(7).trim();
    const decoded = verifyToken(token); // throws on expiry / bad signature

    // Re-fetch from DB to catch cases where the user was deleted after token issuance
    const user = await UserModel.findById(decoded.sub);
    if (!user) throw ApiError.unauthorized('Account no longer exists');

    req.user = user;
    next();
  } catch (err) {
    // Pass ApiErrors through as-is; wrap JWT library errors in a 401
    if (err.statusCode) return next(err);
    next(ApiError.unauthorized(err.message));
  }
}

module.exports = { authenticate };
