import { useState, useEffect } from 'react';
import { Favorite, Quote, Track } from '../types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('mood-app-favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const saveFavorites = (newFavorites: Favorite[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('mood-app-favorites', JSON.stringify(newFavorites));
  };

  const addToFavorites = (type: 'quote' | 'track', data: Quote | Track) => {
    const favorite: Favorite = {
      id: `${type}-${Date.now()}`,
      type,
      data,
      savedAt: new Date().toISOString()
    };
    
    const newFavorites = [...favorites, favorite];
    saveFavorites(newFavorites);
  };

  const removeFromFavorites = (id: string) => {
    const newFavorites = favorites.filter(fav => fav.id !== id);
    saveFavorites(newFavorites);
  };

  const isFavorite = (type: 'quote' | 'track', itemId: string) => {
    return favorites.some(fav => 
      fav.type === type && 
      (fav.data as any)._id === itemId || (fav.data as any).id === itemId
    );
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };
};