import express from 'express';
import { body, query } from 'express-validator';
import { 
  getFavorites, 
  addToFavorites, 
  removeFromFavorites,
  checkFavorite
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation middleware
const validateAddFavorite = [
  body('type').isIn(['song', 'quote']).withMessage('Type must be either "song" or "quote"'),
  body('itemId').isMongoId().withMessage('Invalid item ID')
];

const validateCheckFavorite = [
  query('type').isIn(['song', 'quote']).withMessage('Type must be either "song" or "quote"'),
  query('itemId').isMongoId().withMessage('Invalid item ID')
];

// Routes
router.get('/', getFavorites);
router.post('/', validateAddFavorite, addToFavorites);
router.get('/check', validateCheckFavorite, checkFavorite);
router.delete('/:id', removeFromFavorites);

export default router;
