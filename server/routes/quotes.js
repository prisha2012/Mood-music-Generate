import express from 'express';
import { body } from 'express-validator';
import { 
  getRandomQuoteByMood, 
  getQuotesByMood, 
  addQuote, 
  likeQuote, 
  unlikeQuote 
} from '../controllers/quoteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation middleware
const validateAddQuote = [
  body('content').notEmpty().withMessage('Content is required'),
  body('mood').isIn(['happy', 'sad', 'energetic', 'calm', 'romantic', 'motivated'])
    .withMessage('Invalid mood specified'),
  body('author').optional().isString(),
  body('tags').optional().isArray()
];

// Public routes
router.get('/random/:mood', getRandomQuoteByMood);
router.get('/:mood', getQuotesByMood);

// Protected routes
router.use(protect);

// User routes
router.post('/', validateAddQuote, addQuote);
router.post('/:id/like', likeQuote);
router.delete('/:id/like', unlikeQuote);

export default router;
