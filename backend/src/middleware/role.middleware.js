'use strict';

const ApiError = require('../utils/ApiError');

/**
 * Role-based access control factory.
 * @param {...string} roles  One or more allowed role strings
 */
function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access restricted to: ${roles.join(', ')}. Your role: ${req.user.role}`,
        ),
      );
    }

    next();
  };
}

module.exports = { requireRole };
