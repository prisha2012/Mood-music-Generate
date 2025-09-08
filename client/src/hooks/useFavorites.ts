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

  const isFavorite = (type: 'quote' | 'track', item: Quote | Track | string): boolean => {
    // If item is a string, treat it as an ID
    if (typeof item === 'string') {
      return favorites.some(fav => 
        fav.type === type && 
        ((fav.data as any)._id === item || (fav.data as any).id === item)
      );
    }
    
    // If item is an object, check both _id and id fields
    return favorites.some(fav => {
      if (fav.type !== type) return false;
      
      const favData = fav.data as any;
      const itemData = item as any;
      
      return (
        favData._id === itemData._id || 
        favData.id === itemData.id ||
        favData._id === itemData.id ||
        favData.id === itemData._id
      );
    });
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };
};
