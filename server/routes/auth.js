import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, logout, getGoogleAuthUrl, googleCallback } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation middleware
const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
];

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/google/url', getGoogleAuthUrl);
router.get('/google/callback', googleCallback);

// Protected routes
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

export default router;
