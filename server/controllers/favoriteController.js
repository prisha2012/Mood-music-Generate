import Favorite from '../models/Favorite.js';
import Song from '../models/Song.js';
import Quote from '../models/Quote.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
export const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;

    // Build query
    const query = { user: userId };
    if (type === 'song' || type === 'quote') {
      query.itemType = type;
    }

    // Get favorites with populated data
    const favorites = await Favorite.find(query)
      .populate({
        path: 'song',
        select: 'title artist youtubeId thumbnail mood language',
        populate: {
          path: 'addedBy',
          select: 'name'
        }
      })
      .populate({
        path: 'quote',
        select: 'content author mood tags',
        populate: {
          path: 'addedBy',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });

    // Separate songs and quotes
    const songs = [];
    const quotes = [];

    favorites.forEach(fav => {
      if (fav.song) {
        songs.push(fav.song);
      } else if (fav.quote) {
        quotes.push(fav.quote);
      }
    });

    res.status(200).json({
      success: true,
      data: {
        songs,
        quotes
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add to favorites
// @route   POST /api/favorites
// @access  Private
export const addToFavorites = async (req, res, next) => {
  try {
    const { type, itemId } = req.body;
    const userId = req.user.id;

    // Validate request
    if (!type || !itemId) {
      throw new BadRequestError('Type and item ID are required');
    }

    if (type !== 'song' && type !== 'quote') {
      throw new BadRequestError('Type must be either "song" or "quote"');
    }

    // Check if item exists
    let item;
    if (type === 'song') {
      item = await Song.findById(itemId);
    } else {
      item = await Quote.findById(itemId);
    }

    if (!item) {
      throw new NotFoundError(`${type} not found`);
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: userId,
      [type]: itemId
    });

    if (existingFavorite) {
      throw new BadRequestError(`This ${type} is already in your favorites`);
    }

    // Create favorite
    const favorite = await Favorite.create({
      user: userId,
      itemType: type,
      [type]: itemId
    });

    // Populate the favorite with item data
    await favorite.populate(type);

    res.status(201).json({
      success: true,
      data: favorite[type]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from favorites
// @route   DELETE /api/favorites/:id
// @access  Private
export const removeFromFavorites = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find and delete the favorite
    const favorite = await Favorite.findOneAndDelete({
      _id: id,
      user: userId
    });

    if (!favorite) {
      throw new NotFoundError('Favorite not found');
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if an item is favorited
// @route   GET /api/favorites/check
// @access  Private
export const checkFavorite = async (req, res, next) => {
  try {
    const { type, itemId } = req.query;
    const userId = req.user.id;

    // Validate request
    if (!type || !itemId) {
      throw new BadRequestError('Type and item ID are required');
    }

    if (type !== 'song' && type !== 'quote') {
      throw new BadRequestError('Type must be either "song" or "quote"');
    }

    // Check if item exists
    let item;
    if (type === 'song') {
      item = await Song.findById(itemId);
    } else {
      item = await Quote.findById(itemId);
    }

    if (!item) {
      throw new NotFoundError(`${type} not found`);
    }

    // Check if favorited
    const isFavorited = await Favorite.exists({
      user: userId,
      [type]: itemId
    });

    res.status(200).json({
      success: true,
      data: { isFavorited }
    });
  } catch (error) {
    next(error);
  }
};
