import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ExternalLink, MessageSquare, Music, Quote as QuoteIcon } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { Quote, Track } from '../types';
import { shareQuote, getYouTubeMusicUrl } from '../utils/api';

export const Favorites: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const [activeTab, setActiveTab] = useState<'quotes' | 'tracks'>('quotes');

  const quotesFavorites = favorites.filter(fav => fav.type === 'quote');
  const tracksFavorites = favorites.filter(fav => fav.type === 'track');

  const handleRemove = (id: string) => {
    removeFromFavorites(id);
  };

  const handleShareQuote = (quote: Quote, platform: 'twitter' | 'whatsapp') => {
    shareQuote(quote, platform);
  };

  const openTrackInYouTube = (track: Track) => {
    window.open(getYouTubeMusicUrl(track.videoId), '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/15 dark:bg-black/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-white/10"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/15 dark:border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Favorites
            </h2>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('quotes')}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${activeTab === 'quotes' 
                  ? 'bg-indigo-500 text-white shadow-lg' 
                  : 'bg-white/15 hover:bg-white/25 text-gray-800 dark:text-white'
                }
              `}
            >
              <QuoteIcon className="w-4 h-4" />
              <span>Quotes ({quotesFavorites.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('tracks')}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${activeTab === 'tracks' 
                  ? 'bg-indigo-500 text-white shadow-lg' 
                  : 'bg-white/15 hover:bg-white/25 text-gray-800 dark:text-white'
                }
              `}
            >
              <Music className="w-4 h-4" />
              <span>Tracks ({tracksFavorites.length})</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'quotes' ? (
              <motion.div
                key="quotes"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {quotesFavorites.length === 0 ? (
                  <div className="text-center py-8 text-gray-700 dark:text-gray-300">
                    <QuoteIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No favorite quotes yet. Start exploring moods to save inspiring quotes!</p>
                  </div>
                ) : (
                  quotesFavorites.map((favorite) => {
                    const quote = favorite.data as Quote;
                    return (
                      <motion.div
                        key={favorite.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 dark:bg-black/20 rounded-xl p-6 border border-white/15 dark:border-white/10"
                      >
                        <blockquote className="text-gray-900 dark:text-white mb-3 italic text-lg">
                          "{quote.content}"
                        </blockquote>
                        <cite className="text-gray-700 dark:text-gray-300 text-sm block mb-4 font-medium">
                          — {quote.author}
                        </cite>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleShareQuote(quote, 'twitter')}
                              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-md"
                              title="Share on Twitter"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleShareQuote(quote, 'whatsapp')}
                              className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-md"
                              title="Share on WhatsApp"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleRemove(favorite.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md"
                            title="Remove from favorites"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            ) : (
              <motion.div
                key="tracks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {tracksFavorites.length === 0 ? (
                  <div className="text-center py-8 text-gray-700 dark:text-gray-300">
                    <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No favorite tracks yet. Start exploring moods to save amazing music!</p>
                  </div>
                ) : (
                  tracksFavorites.map((favorite) => {
                    const track = favorite.data as Track;
                    return (
                      <motion.div
                        key={favorite.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 dark:bg-black/20 rounded-xl p-6 border border-white/15 dark:border-white/10"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={track.thumbnail}
                            alt={track.title}
                            className="w-16 h-16 rounded-lg object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/64x64?text=🎵';
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {track.title}
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              {track.artist}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openTrackInYouTube(track)}
                              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md"
                              title="Open in YouTube Music"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemove(favorite.id)}
                              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md"
                              title="Remove from favorites"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};