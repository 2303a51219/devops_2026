/**
 * QUESTION 5: Error Handling in Sequelize
 * 
 * Custom error classes for graceful error handling:
 * - ValidationError: Data validation failures
 * - NotFoundError: Resource not found
 * - DatabaseError: Unexpected database errors
 * - ConflictError: Duplicate entries or constraint violations
 */

class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ConflictError extends Error {
  constructor(message = 'Conflict: Resource already exists') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

class DatabaseError extends Error {
  constructor(message = 'Database operation failed', originalError = null) {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = 500;
    this.originalError = originalError;
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
  ConflictError,
  DatabaseError
};
