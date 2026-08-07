'use strict';

/**
 * Application-level HTTP error.
 *
 * Throw this anywhere in services/controllers; the central errorHandler
 * middleware will catch it and serialise it into a clean JSON response.
 *
 * Usage:
 *   throw new ApiError(400, 'Validation failed', details);
 *   throw ApiError.notFound('User not found');
 */
class ApiError extends Error {
  /**
   * @param {number}  statusCode  HTTP status (4xx / 5xx)
   * @param {string}  message     Human-readable error message
   * @param {any}     [details]   Optional structured payload (e.g. Joi errors)
   */
  constructor(statusCode, message, details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;

    // Keep the original call-site in V8 stack traces
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }


  static badRequest(msg, details) { return new ApiError(400, msg, details); }
  static unauthorized(msg = 'Unauthorized') { return new ApiError(401, msg); }
  static forbidden(msg = 'Forbidden') { return new ApiError(403, msg); }
  static notFound(msg = 'Resource not found') { return new ApiError(404, msg); }
  static conflict(msg) { return new ApiError(409, msg); }
  static internal(msg = 'Internal server error') { return new ApiError(500, msg); }
}

module.exports = ApiError;
