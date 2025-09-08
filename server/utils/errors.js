// Custom error class for API errors
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request
class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

// 401 Unauthorized
class UnauthenticatedError extends ApiError {
  constructor(message = 'Not authenticated') {
    super(message, 401);
  }
}

// 403 Forbidden
class UnauthorizedError extends ApiError {
  constructor(message = 'Not authorized to access this route') {
    super(message, 403);
  }
}

// 404 Not Found
class NotFoundError extends ApiError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

// 409 Conflict
class ConflictError extends ApiError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

// 422 Unprocessable Entity
class ValidationError extends ApiError {
  constructor(errors) {
    super('Validation failed', 422);
    this.errors = errors;
  }
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Default error response
  const errorResponse = {
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => ({
      field: el.path,
      message: el.message
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      errors
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token. Please log in again.'
    });
  }

  // Handle JWT expired error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Your token has expired. Please log in again.'
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value: ${field}. Please use another value.`;
    return res.status(400).json({
      success: false,
      error: message
    });
  }

  // Send the error response
  res.status(err.statusCode || 500).json(errorResponse);
};

export {
  ApiError,
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  ValidationError,
  errorHandler
};
