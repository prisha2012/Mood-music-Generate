import express from 'express';
import { getPlaylist, addSong, deleteSong } from '../controllers/playlistController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/:mood/:language', getPlaylist);

// Protected routes
router.use(protect);

// User routes
router.post('/add', addSong);

// Admin routes
router.use(authorize('admin'));
router.delete('/:id', deleteSong);

export default router;
