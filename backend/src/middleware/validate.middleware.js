'use strict';

const ApiError = require('../utils/ApiError');

/**
 * @param {import('joi').ObjectSchema} schema
 */
function validate(schema) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,  // collect all errors, not just the first
      stripUnknown: true,   // drop keys not in the schema
      convert: true,   // coerce strings to numbers etc. where defined
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message.replace(/["']/g, ''),
      }));
      return next(ApiError.badRequest('Validation failed', details));
    }

    req.body = value;
    next();
  };
}

module.exports = { validate };
