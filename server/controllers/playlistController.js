import Song from '../models/Song.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import axios from 'axios';

// @desc    Get playlist by mood and language
// @route   GET /api/playlist/:mood/:language
// @access  Public
export const getPlaylist = async (req, res, next) => {
  try {
    const { mood, language } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate mood and language
    const validMoods = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'motivated'];
    const validLanguages = ['hindi', 'english', 'punjabi'];

    if (!validMoods.includes(mood)) {
      throw new BadRequestError('Invalid mood specified');
    }

    if (!validLanguages.includes(language)) {
      throw new BadRequestError('Invalid language specified');
    }

    // Build query
    const query = { 
      mood, 
      language,
      isApproved: true 
    };

    // Execute query with pagination
    const [songs, total] = await Promise.all([
      Song.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('addedBy', 'name email'),
      Song.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: songs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: {
        mood,
        language,
        songs
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a song to playlist
// @route   POST /api/playlist/add
// @access  Private
export const addSong = async (req, res, next) => {
  try {
    const { mood, language, youtubeUrl, title, artist } = req.body;
    const userId = req.user.id;

    // Validate mood and language
    const validMoods = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'motivated'];
    const validLanguages = ['hindi', 'english', 'punjabi'];

    if (!validMoods.includes(mood)) {
      throw new BadRequestError('Invalid mood specified');
    }

    if (!validLanguages.includes(language)) {
      throw new BadRequestError('Invalid language specified');
    }

    // Extract video ID from URL if provided
    let videoId = youtubeUrl ? extractVideoId(youtubeUrl) : null;
    
    if (!videoId && !title) {
      throw new BadRequestError('Either YouTube URL or title must be provided');
    }

    let songData = {
      title,
      artist: artist || 'Unknown Artist',
      mood,
      language,
      addedBy: userId,
      isApproved: req.user.role === 'admin' // Auto-approve for admins
    };

    // If we have a video ID, fetch metadata from YouTube
    if (videoId) {
      const youtubeData = await fetchYouTubeVideoData(videoId);
      songData = {
        ...songData,
        youtubeId: videoId,
        title: title || youtubeData.title,
        artist: artist || youtubeData.channelTitle,
        thumbnail: youtubeData.thumbnail,
        duration: youtubeData.duration
      };
    } else {
      // If no video ID, require title and artist
      if (!title) {
        throw new BadRequestError('Title is required when not providing a YouTube URL');
      }
      songData.thumbnail = `https://via.placeholder.com/480x360?text=${encodeURIComponent(title)}`;
    }

    // Create song
    const song = await Song.create(songData);

    res.status(201).json({
      success: true,
      data: song
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a song from playlist
// @route   DELETE /api/playlist/:id
// @access  Private
export const deleteSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      throw new NotFoundError('Song not found');
    }

    // Check if user is admin or the one who added the song
    if (song.addedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new UnauthorizedError('Not authorized to delete this song');
    }

    await song.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to extract video ID from YouTube URL
function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Helper function to fetch video data from YouTube API
async function fetchYouTubeVideoData(videoId) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails',
        id: videoId,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    if (response.data.items.length === 0) {
      throw new Error('Video not found');
    }

    const item = response.data.items[0];
    return {
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url,
      duration: item.contentDetails.duration
    };
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    throw new Error('Failed to fetch video data from YouTube');
  }
}
