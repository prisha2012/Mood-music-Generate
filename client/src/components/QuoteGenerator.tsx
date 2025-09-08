import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Heart, Share2, MessageSquare, Quote as QuoteIcon } from 'lucide-react';
import { Mood, Quote } from '../types';
import { fetchQuotesByTags, shareQuote } from '../utils/api';
import { useFavorites } from '../hooks/useFavorites';

interface QuoteGeneratorProps {
  mood: Mood;
}

export const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({ mood }) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { 
    favorites, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite 
  } = useFavorites();

  const fetchNewQuote = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newQuote = await fetchQuotesByTags(mood.tags);
      setQuote(newQuote);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewQuote();
  }, [mood]);

  const handleFavorite = () => {
    if (quote) {
      if (isFavorite('quote', quote)) {
        // Find and remove the favorite if it exists
        const favorite = favorites.find(fav => 
          fav.type === 'quote' && 
          ((fav.data as any)._id === quote._id || (fav.data as any).id === quote._id)
        );
        if (favorite) {
          removeFromFavorites(favorite.id);
        }
      } else {
        addToFavorites('quote', quote);
      }
    }
  };

  const handleShare = (platform: 'twitter' | 'whatsapp') => {
    if (quote) {
      shareQuote(quote, platform);
    }
  };

  return (
    <motion.div
      className="bg-white/15 dark:bg-black/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <QuoteIcon className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold text-white">
            Inspirational Quote
          </h3>
        </div>
        <button
          onClick={fetchNewQuote}
          disabled={isLoading}
          className="p-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-white/20 rounded mb-4"></div>
            <div className="h-4 bg-white/20 rounded mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={fetchNewQuote}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : quote ? (
        <div>
          <blockquote className="text-white text-lg mb-4 italic leading-relaxed">
            "{quote.content}"
          </blockquote>
          <cite className="text-white/80 text-sm block mb-6 font-medium">
            — {quote.author}
          </cite>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                title="Share on Twitter"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                title="Share on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4 mt-6">
              <button
                onClick={handleFavorite}
                disabled={!quote}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  quote && isFavorite('quote', quote)
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-white/10 hover:bg-white/20 text-white/80 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <Heart 
                  size={18} 
                  className={quote && isFavorite('quote', quote) ? 'fill-current' : ''} 
                />
                <span>{quote && isFavorite('quote', quote) ? 'Favorited' : 'Favorite'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
};
