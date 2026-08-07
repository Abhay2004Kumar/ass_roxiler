'use strict';

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  // Log anything that isn't a deliberate 4xx
  if (!err.statusCode || err.statusCode >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl} →`, err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const body = {
    success: false,
    message,
    ...(err.details ? { details: err.details } : {}),
  };

  // Only expose stack traces in development
  if (process.env.NODE_ENV === 'development' && statusCode >= 500) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
}

module.exports = errorHandler;
