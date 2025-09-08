import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, ExternalLink, Heart, Music, Plus } from 'lucide-react';
import { Mood, Track, Language } from '../types';
import { SAMPLE_VIDEOS, MOODS } from '../utils/constants';
import { useFavorites } from '../hooks/useFavorites';

interface MusicPlayerProps {
  mood: Mood;
  language: Language;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ mood, language }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddMore, setShowAddMore] = useState(false);
  const { addToFavorites, isFavorite } = useFavorites();

  // Fetch playlist from backend API based on mood and language
  const fetchPlaylist = async (mood: Mood, language: Language): Promise<Track[]> => {
    try {
      setIsLoading(true);
      // Always fetch exactly 10 songs
      const limit = 10;
      const response = await fetch(`/api/playlist/${mood.id}/${language}?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch playlist');
      }
      
      const data = await response.json();
      
      if (data.success && data.data?.songs) {
        // Transform the API response to match the Track interface
        return data.data.songs.map((song: any) => ({
          id: song._id,
          title: song.title,
          artist: song.artist || 'Unknown Artist',
          videoId: song.youtubeId,
          thumbnail: song.thumbnail || `https://img.youtube.com/vi/${song.youtubeId}/maxresdefault.jpg`,
          language: song.language,
          mood: song.mood,
          duration: song.duration || 'PT0S' // Default duration if not provided
        }));
      }
      
      // Fallback to sample videos if no songs found
      console.warn('No songs found, using sample videos');
      const moodId = mood.id as keyof typeof SAMPLE_VIDEOS;
      const sampleVideoId = SAMPLE_VIDEOS[moodId]?.[language];
      if (sampleVideoId) {
        return [{
          id: 'sample-1',
          title: 'Sample Track',
          artist: 'Artist',
          videoId: sampleVideoId,
          thumbnail: `https://img.youtube.com/vi/${sampleVideoId}/maxresdefault.jpg`,
          language,
          mood: mood.id,
          duration: 'PT3M30S'
        }];
      }
      return [];
    } catch (error) {
      console.error('Error fetching playlist, using fallback:', error);
      // Fallback to sample videos on error
      const moodId = mood.id as keyof typeof SAMPLE_VIDEOS;
      const sampleVideoId = SAMPLE_VIDEOS[moodId]?.[language];
      if (sampleVideoId) {
        return [{
          id: 'sample-1',
          title: 'Sample Track',
          artist: 'Artist',
          videoId: sampleVideoId,
          thumbnail: `https://img.youtube.com/vi/${sampleVideoId}/maxresdefault.jpg`,
          language,
          mood: mood.id,
          duration: 'PT3M30S'
        }];
      }
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize playlist when component mounts or mood/language changes
  useEffect(() => {
    if (mood && language) {
      const loadPlaylist = async () => {
        const tracks = await fetchPlaylist(mood, language);
        setPlaylist(tracks);
        setCurrentTrack(tracks[0] || null);
        setCurrentIndex(0);
        setIsPlaying(false);
      };
      
      loadPlaylist();
    }
  }, [mood, language]);

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentTrack(playlist[nextIndex]);
    }
  };

  const handleTrackSelect = (track: Track, index: number) => {
    setCurrentTrack(track);
    setCurrentIndex(index);
  };

  const handleFavorite = (track: Track) => {
    addToFavorites('track', track);
  };

  const handleAddMoreSongs = () => {
    setShowAddMore(!showAddMore);
  };

  const openInYouTube = (videoId: string) => {
    window.open(`https://music.youtube.com/watch?v=${videoId}`, '_blank');
  };

  if (isLoading) {
    return (
      <motion.div
        className="bg-white/15 dark:bg-black/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center">
          <Music className="w-12 h-12 mx-auto mb-4 text-white animate-pulse" />
          <p className="text-white">Loading your playlist...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white/15 dark:bg-black/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/15 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {mood.emoji} {mood.name} Playlist
            </h3>
            <p className="text-white/70 text-sm">
              {language.charAt(0).toUpperCase() + language.slice(1)} • {playlist.length} songs
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddMoreSongs}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              title="Add more songs"
            >
              <Plus className="w-5 h-5" />
            </button>
            <Music className="w-8 h-8 text-white/70" />
          </div>
        </div>
      </div>

      {/* Current Track */}
      {currentTrack && (
        <div className="p-6 border-b border-white/15 dark:border-white/10">
          <div className="aspect-video mb-4 rounded-xl overflow-hidden bg-black/20">
            <iframe
              src={`https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=0&rel=0&showinfo=0`}
              title={currentTrack.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">{currentTrack.title}</h4>
              <p className="text-white/70 text-sm">{currentTrack.artist}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleFavorite(currentTrack)}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite('track', currentTrack.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentIndex >= playlist.length - 1}
                className="p-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <SkipForward className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => openInYouTube(currentTrack.videoId)}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Playlist */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">Up Next</h4>
          <span className="text-white/70 text-sm">{playlist.length} songs</span>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {playlist.slice(1).map((track, index) => (
            <motion.div
              key={track.id}
              className="flex items-center space-x-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors"
              onClick={() => handleTrackSelect(track, index + 1)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/48x48?text=🎵';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{track.title}</p>
                <p className="text-white/70 text-sm truncate">{track.artist}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavorite(track);
                }}
                className={`p-1 rounded transition-colors ${
                  isFavorite('track', track.id)
                    ? 'text-red-500'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add More Songs Section */}
      {showAddMore && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-6 border-t border-white/15 dark:border-white/10 bg-white/5"
        >
          <h4 className="text-lg font-semibold text-white mb-4">Add More Songs</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Search for songs to add..."
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                Search YouTube
              </button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                Add Custom Song
              </button>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-3">
            Note: This feature allows you to search and add more songs to your current playlist.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
