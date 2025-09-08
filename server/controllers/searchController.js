import axios from 'axios';
import { BadRequestError } from '../utils/errors.js';

// @desc    Search YouTube for videos
// @route   GET /api/search
// @access  Public
export const searchYouTube = async (req, res, next) => {
  try {
    const { q, maxResults = 10 } = req.query;

    if (!q) {
      throw new BadRequestError('Search query is required');
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${q} music`,
        type: 'video',
        maxResults: Math.min(parseInt(maxResults, 10), 20), // Limit to 20 results max
        key: process.env.YOUTUBE_API_KEY
      }
    });

    const results = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt
    }));

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    next(new Error('Failed to fetch search results from YouTube'));
  }
};

// @desc    Get YouTube video details
// @route   GET /api/search/video/:id
// @access  Public
export const getVideoDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails',
        id,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    if (response.data.items.length === 0) {
      throw new BadRequestError('Video not found');
    }

    const item = response.data.items[0];
    const videoData = {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url,
      duration: item.contentDetails.duration,
      publishedAt: item.snippet.publishedAt,
      tags: item.snippet.tags || []
    };

    res.status(200).json({
      success: true,
      data: videoData
    });
  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    next(new Error('Failed to fetch video details'));
  }
};
