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

// Fallback quotes for each mood
const FALLBACK_QUOTES = {
  happy: [
    { content: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
    { content: "The best way to cheer yourself is to try to cheer somebody else up.", author: "Mark Twain" }
  ],
  sad: [
    { content: "The way sadness works is one of the strange riddles of the world.", author: "Lemony Snicket" },
    { content: "Tears are words that need to be written.", author: "Paulo Coelho" }
  ],
  energetic: [
    { content: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
    { content: "The energy of the mind is the essence of life.", author: "Aristotle" }
  ],
  calm: [
    { content: "Calm mind brings inner strength and self-confidence, so that's very important for good health.", author: "Dalai Lama" },
    { content: "The more tranquil a man becomes, the greater is his success, his influence, his power for good.", author: "James Allen" }
  ],
  romantic: [
    { content: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
    { content: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" }
  ],
  motivated: [
    { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
  ]
};

// Helper function to fetch a quote from Quotable API with fallback
async function fetchQuoteFromQuotable(mood, res) {
  try {
    // First try to get a random quote from our database
    const localQuote = await Quote.aggregate([
      { $match: { mood, isApproved: true } },
      { $sample: { size: 1 } }
    ]);

    if (localQuote && localQuote.length > 0) {
      return res.status(200).json({
        success: true,
        data: localQuote[0],
        isFallback: false
      });
    }

    // If no local quotes, try Quotable API
    try {
      // Map moods to Quotable API tags
      const moodTags = {
        happy: 'happiness|joy|positive|cheerful',
        sad: 'sadness|emotional|melancholy',
        energetic: 'energy|motivation|inspiration',
        calm: 'peace|calm|serenity',
        romantic: 'love|romance|heart',
        motivated: 'motivation|inspiration|determination'
      };

      const tags = moodTags[mood] || 'inspiration';
      
      const response = await axios.get(`https://api.quotable.io/random`, {
        params: {
          tags: tags,
          maxLength: 150
        },
        timeout: 5000 // 5 second timeout
      });
      
      const quote = {
        content: response.data.content,
        author: response.data.author || 'Unknown',
        mood,
        source: 'quotable',
        isApproved: true
      };

      // Save the quote to our database for future use
      const savedQuote = await Quote.create(quote);
      
      return res.status(200).json({
        success: true,
        data: savedQuote,
        isFallback: false
      });
      
    } catch (apiError) {
      console.error('Error fetching from Quotable API:', apiError.message);
      // Continue to fallback quotes
    }
    
    // If we get here, both database and API failed - use fallback quotes
    const fallbackQuotes = FALLBACK_QUOTES[mood] || FALLBACK_QUOTES.happy;
    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    
    const fallback = {
      content: randomQuote.content,
      author: randomQuote.author,
      mood,
      source: 'fallback',
      isApproved: true
    };
    
    // Save the fallback quote to our database
    const savedFallback = await Quote.create(fallback);
    
    return res.status(200).json({
      success: true,
      data: savedFallback,
      isFallback: true
    });
    
  } catch (error) {
    console.error('Unexpected error in fetchQuoteFromQuotable:', error);
    // Return a hardcoded fallback as last resort
    return res.status(200).json({
      success: true,
      data: {
        content: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs',
        mood: mood,
        source: 'hardcoded',
        isApproved: true
      },
      isFallback: true
    });
  }
}
