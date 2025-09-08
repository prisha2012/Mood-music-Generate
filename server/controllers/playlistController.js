import Song from '../models/Song.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import axios from 'axios';

// @desc    Get playlist by mood and language
// @route   GET /api/playlist/:mood/:language
// @access  Public
export const getPlaylist = async (req, res, next) => {
  try {
    const { mood, language } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10)); // Limit to max 50 items
    const skip = (page - 1) * limit;

    console.log(`Fetching playlist - Mood: ${mood}, Language: ${language}, Page: ${page}, Limit: ${limit}`);

    // Validate mood and language
    const validMoods = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'motivated'];
    const validLanguages = ['hindi', 'english', 'punjabi'];

    const normalizedMood = mood.toLowerCase();
    const normalizedLanguage = language.toLowerCase();

    if (!validMoods.includes(normalizedMood)) {
      throw new BadRequestError(`Invalid mood specified. Must be one of: ${validMoods.join(', ')}`);
    }

    if (!validLanguages.includes(normalizedLanguage)) {
      throw new BadRequestError(`Invalid language specified. Must be one of: ${validLanguages.join(', ')}`);
    }

    // Build query with case-insensitive matching
    const query = { 
      mood: { $regex: `^${normalizedMood}$`, $options: 'i' },
      language: { $regex: `^${normalizedLanguage}$`, $options: 'i' },
      isApproved: true
    };
    
    console.log('Searching for songs with query:', JSON.stringify(query, null, 2));

    console.log('Database query:', JSON.stringify(query, null, 2));

    // Execute query with pagination
    const [songs, total] = await Promise.all([
      Song.find(query)
        .select('-__v -likes -playCount -addedBy -isApproved -__t')
        .sort({ createdAt: -1, viewCount: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // Convert to plain JavaScript objects
      Song.countDocuments(query)
    ]);

    console.log(`Found ${songs.length} songs out of ${total} total`);

    // Transform the response to match the frontend's expected format
    const transformedSongs = songs.map(song => {
      const thumbnail = song.thumbnail || 
        (song.youtubeId ? `https://img.youtube.com/vi/${song.youtubeId}/maxresdefault.jpg` : null);
      
      return {
        id: song._id.toString(),
        title: song.title || 'Unknown Track',
        artist: song.artist || 'Unknown Artist',
        videoId: song.youtubeId,
        thumbnail: thumbnail,
        duration: song.duration || 'PT0S',
        viewCount: song.viewCount || 0,
        likeCount: song.likeCount || 0,
        language: song.language,
        mood: song.mood,
        createdAt: song.createdAt,
        isFavorite: false // Will be set by the frontend if needed
      };
    });

    // If no songs found, try to return sample videos as fallback
    if (transformedSongs.length === 0) {
      console.warn('No songs found in database, returning sample videos');
      const sampleVideos = await getSampleVideos(normalizedMood, normalizedLanguage);
      return res.status(200).json({
        success: true,
        count: sampleVideos.length,
        total: sampleVideos.length,
        page: 1,
        pages: 1,
        isFallback: true,
        data: {
          songs: sampleVideos
        }
      });
    }

    res.status(200).json({
      success: true,
      count: transformedSongs.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: {
        songs: transformedSongs
      }
    });

  } catch (error) {
    console.error('Error in getPlaylist:', {
      error: error.message,
      stack: error.stack,
      params: req.params,
      query: req.query
    });
    
    // Return sample videos as fallback in case of error
    try {
      const sampleVideos = await getSampleVideos(
        req.params.mood?.toLowerCase() || 'happy',
        req.params.language?.toLowerCase() || 'english'
      );
      
      return res.status(200).json({
        success: true,
        count: sampleVideos.length,
        total: sampleVideos.length,
        page: 1,
        pages: 1,
        isFallback: true,
        data: {
          songs: sampleVideos
        }
      });
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      next(error); // Return the original error if fallback fails
    }
  }
};

// Helper function to get sample videos when no songs are found
async function getSampleVideos(mood, language) {
  console.log(`Getting sample videos for mood: ${mood}, language: ${language}`);
  
  // This is a simplified example - replace with your actual sample videos logic
  const sampleVideos = [
    {
      id: 'sample-1',
      title: 'Sample Track 1',
      artist: 'Sample Artist',
      videoId: 'dQw4w9WgXcQ', // YouTube video ID
      thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
      duration: 'PT3M30S',
      viewCount: 0,
      likeCount: 0,
      language,
      mood,
      isFavorite: false,
      isSample: true
    }
  ];
  
  return sampleVideos;
}

// @desc    Add a song to playlist
// @route   POST /api/playlist/add
// @access  Private
export const addSong = async (req, res, next) => {
  try {
    const { mood, language, youtubeUrl, title, artist } = req.body;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    console.log('Add song request:', { mood, language, youtubeUrl, userId });

    // Validate required fields
    if (!mood || !language) {
      throw new BadRequestError('Mood and language are required');
    }

    // Validate mood and language
    const validMoods = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'motivated'];
    const validLanguages = ['hindi', 'english', 'punjabi'];

    if (!validMoods.includes(mood.toLowerCase())) {
      throw new BadRequestError(`Invalid mood. Must be one of: ${validMoods.join(', ')}`);
    }

    if (!validLanguages.includes(language.toLowerCase())) {
      throw new BadRequestError(`Invalid language. Must be one of: ${validLanguages.join(', ')}`);
    }

    // Extract video ID from URL if provided
    let videoId = youtubeUrl ? extractVideoId(youtubeUrl) : null;
    
    if (!videoId && !title) {
      throw new BadRequestError('Either YouTube URL or title must be provided');
    }

    let songData = {
      title: title?.trim() || 'Untitled Track',
      artist: artist?.trim() || 'Unknown Artist',
      mood: mood.toLowerCase(),
      language: language.toLowerCase(),
      addedBy: userId,
      isApproved: isAdmin, // Auto-approve for admins
      lastUpdated: new Date()
    };

    // If we have a video ID, fetch metadata from YouTube
    if (videoId) {
      try {
        console.log('Fetching YouTube data for video ID:', videoId);
        const youtubeData = await fetchYouTubeVideoData(videoId);
        
        songData = {
          ...songData,
          youtubeId: videoId,
          title: title?.trim() || youtubeData.title,
          artist: artist?.trim() || youtubeData.artist,
          description: youtubeData.description,
          thumbnail: youtubeData.thumbnail,
          duration: youtubeData.duration,
          viewCount: parseInt(youtubeData.viewCount) || 0,
          likeCount: parseInt(youtubeData.likeCount) || 0,
          publishedAt: youtubeData.publishedAt
        };
        
        console.log('YouTube data fetched successfully');
      } catch (youtubeError) {
        console.error('Error fetching YouTube data:', youtubeError);
        // Continue with basic data if YouTube fetch fails
        songData.youtubeId = videoId;
        songData.thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    } else {
      // If no video ID, require title
      if (!title?.trim()) {
        throw new BadRequestError('Title is required when not providing a YouTube URL');
      }
      songData.thumbnail = `https://via.placeholder.com/480x360.png?text=${encodeURIComponent(title.substring(0, 30))}`;
    }

    console.log('Creating song with data:', {
      ...songData,
      description: songData.description ? `${songData.description.substring(0, 50)}...` : 'No description'
    });

    // Create song
    const song = await Song.create(songData);
    
    console.log('Song created successfully:', song._id);

    res.status(201).json({
      success: true,
      message: 'Song added successfully',
      data: {
        id: song._id,
        title: song.title,
        artist: song.artist,
        youtubeId: song.youtubeId,
        thumbnail: song.thumbnail,
        isApproved: song.isApproved
      }
    });
    
  } catch (error) {
    console.error('Error in addSong:', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      user: req.user
    });
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return next(new BadRequestError('This song already exists in the playlist'));
    }
    
    next(error);
  }
};

// @desc    Delete a song from playlist
// @route   DELETE /api/playlist/:id
// @access  Private
export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    
    console.log(`Delete song request - ID: ${id}, User: ${userId}, Is Admin: ${isAdmin}`);

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestError('Invalid song ID format');
    }

    const song = await Song.findById(id);

    if (!song) {
      console.warn(`Song not found with ID: ${id}`);
      throw new NotFoundError('Song not found');
    }

    // Check if user is admin or the one who added the song
    const isOwner = song.addedBy && song.addedBy.toString() === userId;
    if (!isOwner && !isAdmin) {
      console.warn(`Unauthorized delete attempt - User: ${userId}, Song Owner: ${song.addedBy}`);
      throw new Error('Not authorized to delete this song');
    }

    // Soft delete by marking as not approved
    song.isApproved = false;
    song.deletedAt = new Date();
    song.deletedBy = userId;
    
    await song.save();
    
    console.log(`Song soft-deleted - ID: ${id}, Title: ${song.title}`);

    res.status(200).json({
      success: true,
      message: 'Song removed successfully',
      data: {
        id: song._id,
        title: song.title,
        artist: song.artist,
        removed: true
      }
    });
    
  } catch (error) {
    console.error('Error in deleteSong:', {
      error: error.message,
      stack: error.stack,
      params: req.params,
      user: req.user
    });
    
    if (error.name === 'CastError') {
      return next(new BadRequestError('Invalid song ID'));
    }
    
    next(error);
  }
};

// Helper function to extract video ID from YouTube URL
function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// YouTube API configuration
const YOUTUBE_API_KEY = 'AIzaSyBPzgjKlnFhDhLVu_MTSq1e0z505QuMUII';

// Helper function to fetch video data from YouTube API
async function fetchYouTubeVideoData(videoId) {
  if (!videoId) {
    throw new Error('YouTube video ID is required');
  }

  try {
    console.log(`Fetching YouTube data for video ID: ${videoId}`);
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: YOUTUBE_API_KEY
      },
      timeout: 5000 // 5 second timeout
    });

    console.log('YouTube API response status:', response.status);
    
    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('YouTube video not found');
    }

    const item = response.data.items[0];
    if (!item || !item.snippet || !item.contentDetails) {
      throw new Error('Invalid YouTube API response format');
    }

    // Get highest resolution thumbnail available
    const thumbnail = item.snippet.thumbnails?.maxres?.url || 
                     item.snippet.thumbnails?.standard?.url || 
                     item.snippet.thumbnails?.high?.url ||
                     item.snippet.thumbnails?.medium?.url ||
                     item.snippet.thumbnails?.default?.url;

    return {
      title: item.snippet.title || 'Untitled Video',
      artist: item.snippet.channelTitle || 'Unknown Artist',
      description: item.snippet.description || '',
      thumbnail: thumbnail,
      duration: item.contentDetails.duration || 'PT0S',
      viewCount: item.statistics?.viewCount || '0',
      likeCount: item.statistics?.likeCount || '0',
      publishedAt: item.snippet.publishedAt || new Date().toISOString()
    };
    
  } catch (error) {
    console.error('YouTube API Error:', {
      message: error.message,
      response: error.response?.data,
      videoId: videoId
    });
    
    // Return a fallback object if the video exists but API fails
    return {
      title: 'YouTube Video',
      artist: 'Unknown Artist',
      description: '',
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      duration: 'PT0S',
      viewCount: '0',
      likeCount: '0',
      publishedAt: new Date().toISOString(),
      _error: error.message
    };
  }
}
