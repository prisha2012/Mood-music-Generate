import axios from 'axios';
import { Quote } from '../types';

const QUOTABLE_BASE_URL = 'https://api.quotable.io';

export const fetchQuotesByTags = async (tags: string | string[]): Promise<Quote> => {
  try {
    // Convert single tag to array if needed
    const tagList = Array.isArray(tags) ? tags : [tags];
    const tagsParam = tagList.join('|');
    
    const response = await axios.get(`${QUOTABLE_BASE_URL}/random`, {
      params: {
        tags: tagsParam,
        maxLength: 150
      }
    });
    
    // Transform the response to match our Quote interface
    const quoteData = response.data;
    return {
      _id: quoteData._id || Math.random().toString(36).substr(2, 9),
      content: quoteData.content,
      author: quoteData.author,
      tags: quoteData.tags || [],
      authorSlug: quoteData.authorSlug || quoteData.author?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
      length: quoteData.length || quoteData.content?.length || 0
    };
  } catch (error) {
    console.error('Error fetching quote:', error);
    // Fallback to a default quote
    return {
      _id: 'fallback-quote',
      content: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs',
      tags: ['motivational', 'work'],
      authorSlug: 'steve-jobs',
      length: 52
    };
  }
};

export const getYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&showinfo=0`;
};

export const getYouTubeMusicUrl = (videoId: string): string => {
  return `https://music.youtube.com/watch?v=${videoId}`;
};

export const shareQuote = (quote: Quote, platform: 'twitter' | 'whatsapp' = 'twitter'): void => {
  try {
    if (!quote || !quote.content) {
      console.error('Invalid quote data');
      return;
    }

    const author = quote.author || 'Unknown';
    const text = `"${quote.content}" - ${author}`;
    let shareUrl = '';
    
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    } else if (platform === 'whatsapp') {
      shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    }

    if (shareUrl && typeof window !== 'undefined') {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  } catch (error) {
    console.error('Error sharing quote:', error);
  }
};
