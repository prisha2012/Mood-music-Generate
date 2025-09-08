import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { UnauthenticatedError, UnauthorizedError } from '../utils/errors.js';

// Protect routes - user must be authenticated
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    // Check for token in Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      throw new UnauthenticatedError('Not authorized to access this route');
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        throw new UnauthenticatedError('User not found');
      }

      next();
    } catch (error) {
      throw new UnauthenticatedError('Not authorized, token failed');
    }
  } catch (error) {
    next(error);
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError(
        `User role ${req.user.role} is not authorized to access this route`
      );
    }
    next();
  };
};

// Check if user is the owner of a resource
export const checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);
      
      if (!resource) {
        throw new NotFoundError('Resource not found');
      }

      // Check if user is admin or the owner
      if (req.user.role !== 'admin' && resource.addedBy.toString() !== req.user.id) {
        throw new UnauthorizedError('Not authorized to modify this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
