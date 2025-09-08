import express from 'express';
import { searchYouTube, getVideoDetails } from '../controllers/searchController.js';

const router = express.Router();

// Public routes
router.get('/', searchYouTube);
router.get('/video/:id', getVideoDetails);

export default router;
