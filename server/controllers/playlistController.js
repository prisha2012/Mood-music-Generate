import Song from '../models/Song.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import axios from 'axios';

// Helper function to search YouTube videos
async function searchYouTubeVideos(mood, language, maxResults = 10) {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  // Map moods to search terms
  const moodSearchTerms = {
    happy: ['happy', 'upbeat', 'joyful', 'cheerful'],
    sad: ['sad', 'emotional', 'melancholic', 'heartbreak'],
    energetic: ['energetic', 'upbeat', 'party', 'dance'],
    calm: ['calm', 'relaxing', 'peaceful', 'soothing'],
    romantic: ['romantic', 'love', 'romance', 'heartfelt'],
    motivated: ['motivational', 'inspirational', 'uplifting', 'empowering']
  };

  const languageSearchTerms = {
    hindi: ['hindi', 'bollywood', 'indian'],
    english: ['english', 'pop', 'rock'],
    punjabi: ['punjabi', 'bhangra', 'punjabi pop']
  };

  const moodTerm = moodSearchTerms[mood]?.[0] || mood;
  const languageTerm = languageSearchTerms[language]?.[0] || language;
  const query = `${moodTerm} ${languageTerm} music`;

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults,
        key: YOUTUBE_API_KEY,
        videoEmbeddable: 'true',
        videoCategoryId: '10' // Music category
      },
      timeout: 5000
    });

    return response.data.items.map(item => ({
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      youtubeId: item.id.videoId,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      mood,
      language,
      source: 'youtube',
      isExternal: true
    }));
  } catch (error) {
    console.error('YouTube API Error:', error.message);
    throw new Error('Failed to fetch videos from YouTube');
  }
}

// @desc    Get playlist by mood and language
// @route   GET /api/playlist/:mood/:language
// @access  Public
export const getPlaylist = async (req, res, next) => {
  try {
    const { mood, language } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 10; // Fixed limit of 10 songs per page
    const skip = (page - 1) * limit;

    console.log(`Fetching playlist - Mood: ${mood}, Language: ${language}, Page: ${page}`);

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

    // Execute query with pagination
    const [songs, total] = await Promise.all([
      Song.find(query)
        .select('-__v -likes -playCount -addedBy -isApproved -__t')
        .sort({ createdAt: -1, viewCount: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Song.countDocuments(query)
    ]);

    console.log(`Found ${songs.length} songs out of ${total} total`);

    // If no songs found in database, try to find from YouTube
    if (songs.length === 0) {
      console.log('No songs found in database, trying YouTube search...');
      try {
        const youtubeSongs = await searchYouTubeVideos(normalizedMood, normalizedLanguage, 10);
        return res.status(200).json({
          success: true,
          data: youtubeSongs,
          pagination: {
            total: youtubeSongs.length,
            totalPages: 1,
            page: 1,
            limit: 10,
            hasNextPage: false,
            hasPreviousPage: false,
            nextPage: null,
            previousPage: null
          },
          message: `Found ${youtubeSongs.length} YouTube videos for ${normalizedMood} mood in ${normalizedLanguage}`
        });
      } catch (youtubeError) {
        console.error('YouTube search failed:', youtubeError);
        return getSampleVideos(normalizedMood, normalizedLanguage, res);
      }
    }

    // If we have some songs but less than requested, try to supplement with YouTube
    if (songs.length < limit && page === 1) {
      try {
        const remaining = limit - songs.length;
        const youtubeSongs = await searchYouTubeVideos(normalizedMood, normalizedLanguage, remaining);
        songs.push(...youtubeSongs);
        console.log(`Added ${youtubeSongs.length} songs from YouTube`);
      } catch (youtubeError) {
        console.error('Failed to supplement with YouTube videos:', youtubeError);
      }
    }

    // Prepare response with pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.status(200).json({
      success: true,
      data: songs,
      pagination: {
        total: Math.max(total, songs.length), // In case we added YouTube results
        totalPages: Math.max(totalPages, 1),
        page,
        limit,
        hasNextPage: hasNextPage || songs.length >= limit,
        hasPreviousPage,
        nextPage: hasNextPage ? page + 1 : null,
        previousPage: hasPreviousPage ? page - 1 : null
      },
      message: `Found ${songs.length} ${songs.length === 1 ? 'song' : 'songs'} for ${normalizedMood} mood in ${normalizedLanguage}`
    });
  } catch (error) {
    next(error);
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

// YouTube API configuration - Get from environment variables
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  console.error('❌ YouTube API key is not configured. Please set YOUTUBE_API_KEY in your environment variables.');
}

// Helper function to fetch video data from YouTube API
async function fetchYouTubeVideoData(videoId) {
  if (!videoId) {
    throw new Error('YouTube video ID is required');
  }

  if (!YOUTUBE_API_KEY) {
    console.error('YouTube API key is not configured');
    throw new Error('YouTube API is not properly configured. Please contact support.');
  }

  console.log(`Fetching YouTube data for video ID: ${videoId}`);
  
  try {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/videos',
      {
        params: {
          part: 'snippet,contentDetails,statistics',
          id: videoId,
          key: YOUTUBE_API_KEY
        },
        timeout: 10000, // 10 second timeout
        headers: {
          'Accept-Encoding': 'gzip,deflate,compress'
        }
      }
    );

    console.log('YouTube API Response:', {
      status: response.status,
      data: response.data
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('No video found with the provided ID');
    }

    const video = response.data.items[0];
    
    return {
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high?.url || 
                video.snippet.thumbnails.medium?.url || 
                video.snippet.thumbnails.default?.url,
      duration: video.contentDetails.duration,
      viewCount: parseInt(video.statistics.viewCount) || 0,
      likeCount: parseInt(video.statistics.likeCount) || 0,
      channelTitle: video.snippet.channelTitle
    };
  } catch (error) {
    console.error('YouTube API Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      videoId,
      stack: error.stack
    });
    
    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request to YouTube timed out. Please try again.');
    }
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 403) {
        if (error.response.data?.error?.errors?.[0]?.reason === 'quotaExceeded') {
          throw new Error('YouTube API quota exceeded. Please try again later or contact support.');
        }
        throw new Error('Access to YouTube API is forbidden. The API key may be invalid or restricted.');
      } 
      
      if (error.response.status === 404) {
        throw new Error('The requested video was not found on YouTube.');
      }
      
      if (error.response.status === 400) {
        throw new Error('Invalid request to YouTube API. The video ID may be incorrect.');
      }
      
      throw new Error(`YouTube API error: ${error.response.status} - ${error.response.statusText}`);
    } 
    
    if (error.request) {
      // The request was made but no response was received
      throw new Error('Could not connect to YouTube. Please check your internet connection.');
    }
    
    // Something happened in setting up the request that triggered an Error
    throw new Error(`Failed to fetch video data: ${error.message}`);
  }
}
