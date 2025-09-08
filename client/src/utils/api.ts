import axios from 'axios';
import { Quote, Song, User } from '../types';

// Backend URL from Vercel environment
const API_URL = import.meta.env.VITE_API_URL;

// ----------------- Playlists -----------------
export const getPlaylist = async (mood: string, language: string): Promise<Song[]> => {
  try {
    const res = await axios.get(`${API_URL}/playlist/${mood}/${language}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error('Failed to fetch playlist:', err);
    return [];
  }
};

export const addSongToPlaylist = async (songId: string, mood: string, language: string) => {
  const res = await axios.post(`${API_URL}/playlist/add`, { songId, mood, language }, { withCredentials: true });
  return res.data;
};

// ----------------- Quotes -----------------
export const fetchQuotesByMood = async (mood: string): Promise<Quote[]> => {
  try {
    const res = await axios.get(`${API_URL}/quotes/${mood}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error('Backend fetch failed, falling back to public API');
    const fallback = await axios.get('https://api.quotable.io/random', {
      params: { tags: 'motivational', maxLength: 150 }
    });
    return [fallback.data];
  }
};

export const addQuote = async (content: string, author: string, mood: string) => {
  const res = await axios.post(`${API_URL}/quotes`, { content, author, mood }, { withCredentials: true });
  return res.data;
};

// ----------------- Favorites -----------------
export const getFavorites = async () => {
  const res = await axios.get(`${API_URL}/favorites`, { withCredentials: true });
  return res.data;
};

export const addFavorite = async (itemType: 'song' | 'quote', itemId: string) => {
  const res = await axios.post(`${API_URL}/favorites`, { itemType, itemId }, { withCredentials: true });
  return res.data;
};

export const removeFavorite = async (itemId: string) => {
  const res = await axios.delete(`${API_URL}/favorites/${itemId}`, { withCredentials: true });
  return res.data;
};

// ----------------- Auth -----------------
export const registerUser = async (name: string, email: string, password: string) => {
  const res = await axios.post(`${API_URL}/auth/register`, { name, email, password }, { withCredentials: true });
  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.get(`${API_URL}/auth/logout`, { withCredentials: true });
  return res.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
  return res.data;
};

// ----------------- YouTube Helpers -----------------
export const getYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&showinfo=0`;
};

export const getYouTubeMusicUrl = (videoId: string): string => {
  return `https://music.youtube.com/watch?v=${videoId}`;
};

// ----------------- Share Quotes -----------------
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
