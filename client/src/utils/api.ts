import axios from 'axios';
import { Quote } from '../types';

const QUOTABLE_BASE_URL = 'https://api.quotable.io';

export const fetchQuotesByTags = async (tags: string[]): Promise<Quote> => {
  try {
    const tagsParam = tags.join('|');
    const response = await axios.get(`${QUOTABLE_BASE_URL}/random`, {
      params: {
        tags: tagsParam,
        maxLength: 150
      }
    });
    return response.data;
  } catch (error) {
    // Fallback to general motivational quotes if mood-specific fails
    try {
      const response = await axios.get(`${QUOTABLE_BASE_URL}/random`, {
        params: {
          tags: 'motivational',
          maxLength: 150
        }
      });
      return response.data;
    } catch (fallbackError) {
      throw fallbackError;
    }
  }
};

export const getYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&showinfo=0`;
};

export const getYouTubeMusicUrl = (videoId: string): string => {
  return `https://music.youtube.com/watch?v=${videoId}`;
};

export const shareQuote = (quote: Quote, platform: 'twitter' | 'whatsapp'): void => {
  const text = `"${quote.content}" - ${quote.author}`;
  
  if (platform === 'twitter') {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  } else if (platform === 'whatsapp') {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
};