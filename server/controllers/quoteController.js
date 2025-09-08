import Quote from '../models/Quote.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import axios from 'axios';

// @desc    Get random quote by mood
// @route   GET /api/quotes/random/:mood
// @access  Public
export const getRandomQuoteByMood = async (req, res, next) => {
  try {
    const { mood } = req.params;
    
    // Validate mood
    const validMoods = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'motivated'];
    if (!validMoods.includes(mood)) {
      throw new BadRequestError('Invalid mood specified');
    }

    // Get a random quote for the specified mood from our database
    const quote = await Quote.aggregate([
      { $match: { mood, isApproved: true } },
      { $sample: { size: 1 } }
    ]);

    // If no quotes found in our DB, try fetching from Quotable API
    if (!quote || quote.length === 0) {
      return await fetchQuoteFromQuotable(mood, res);
    }

    res.status(200).json({
      success: true,
      data: quote[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all quotes by mood
// @route   GET /api/quotes/:mood
// @access  Public
export const getQuotesByMood = async (req, res, next) => {
  try {
    const { mood } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate mood
    const validMoods = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'motivated'];
    if (!validMoods.includes(mood)) {
      throw new BadRequestError('Invalid mood specified');
    }

    // Build query
    const query = { mood, isApproved: true };

    // Execute query with pagination
    const [quotes, total] = await Promise.all([
      Quote.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Quote.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: quotes.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: quotes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new quote
// @route   POST /api/quotes
// @access  Private
export const addQuote = async (req, res, next) => {
  try {
    const { content, author = 'Unknown', mood, tags = [] } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!content || !mood) {
      throw new BadRequestError('Content and mood are required');
    }

    // Validate mood
    const validMoods = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'motivated'];
    if (!validMoods.includes(mood)) {
      throw new BadRequestError('Invalid mood specified');
    }

    // Create quote
    const quote = await Quote.create({
      content,
      author,
      mood,
      tags,
      addedBy: userId,
      isApproved: req.user.role === 'admin'
    });

    res.status(201).json({
      success: true,
      data: quote
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like a quote
// @route   POST /api/quotes/:id/like
// @access  Private
export const likeQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);
    
    if (!quote) {
      throw new NotFoundError('Quote not found');
    }

    // Check if the quote has already been liked
    if (quote.likes.includes(req.user.id)) {
      throw new BadRequestError('Quote already liked');
    }

    quote.likes.push(req.user.id);
    await quote.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unlike a quote
// @route   DELETE /api/quotes/:id/like
// @access  Private
export const unlikeQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);
    
    if (!quote) {
      throw new NotFoundError('Quote not found');
    }

    // Check if the quote has been liked
    if (!quote.likes.includes(req.user.id)) {
      throw new BadRequestError('Quote not liked yet');
    }

    quote.likes = quote.likes.filter(
      id => id.toString() !== req.user.id
    );
    
    await quote.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to fetch a quote from Quotable API
async function fetchQuoteFromQuotable(mood, res) {
  try {
    // Map our moods to Quotable tags
    const moodToTags = {
      happy: ['happiness', 'joy', 'optimism'],
      sad: ['sadness', 'hope', 'inspirational'],
      energetic: ['energy', 'motivational', 'determination'],
      calm: ['peace', 'mindfulness', 'serenity'],
      romantic: ['love', 'romance', 'affection'],
      motivated: ['inspirational', 'determination', 'success']
    };

    const tags = moodToTags[mood] || ['inspirational'];
    const tagsParam = tags.join('|');

    const response = await axios.get('https://api.quotable.io/random', {
      params: {
        tags: tagsParam,
        maxLength: 150
      }
    });

    const { content, author, tags: quoteTags } = response.data;

    // Save the quote to our database for future use
    const newQuote = await Quote.create({
      content,
      author,
      mood,
      tags: quoteTags || [],
      source: 'quotable',
      externalId: response.data._id,
      isApproved: true
    });

    res.status(200).json({
      success: true,
      data: newQuote,
      fromExternal: true
    });
  } catch (error) {
    console.error('Quotable API Error:', error.message);
    throw new Error('Failed to fetch quote from external service');
  }
}
