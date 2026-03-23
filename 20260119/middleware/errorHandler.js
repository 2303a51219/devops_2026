/**
 * QUESTION 5: Error Handling Middleware
 * 
 * Gracefully handles all errors and sends appropriate HTTP responses
 * Catches Sequelize-specific errors and custom errors
 */

const { ValidationError, NotFoundError, ConflictError, DatabaseError } = require('../utils/errors');

/**
 * Global error handler middleware
 * Must be last middleware in Express app
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.name, err.message);

  // Handle custom errors
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.name,
      message: err.message,
      details: err.errors
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.name,
      message: err.message
    });
  }

  if (err instanceof ConflictError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.name,
      message: err.message
    });
  }

  if (err instanceof DatabaseError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.name,
      message: err.message,
      originalError: process.env.NODE_ENV === 'development' ? err.originalError?.message : undefined
    });
  }

  // Handle Sequelize errors not caught above
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'Data validation failed',
      details: messages
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const fields = Object.keys(err.fields || {});
    return res.status(409).json({
      success: false,
      error: 'ConflictError',
      message: `Duplicate entry for field(s): ${fields.join(', ')}`
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      error: 'ForeignKeyError',
      message: `Invalid reference: ${err.message}`
    });
  }

  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      success: false,
      error: 'DatabaseConnectionError',
      message: 'Unable to connect to database'
    });
  }

  // Generic error
  res.status(500).json({
    success: false,
    error: err.name || 'InternalServerError',
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'An unexpected error occurred'
  });
};

/**
 * Async error wrapper for express routes
 * Catches promise rejections
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler
};
