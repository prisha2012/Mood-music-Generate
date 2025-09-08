import { useState, useEffect } from 'react';

export type Language = 'hindi' | 'english' | 'punjabi';

export const useLanguage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mood-app-language');
      return (saved as Language) || 'english';
    }
    return 'english';
  });

  useEffect(() => {
    localStorage.setItem('mood-app-language', selectedLanguage);
  }, [selectedLanguage]);

  return { selectedLanguage, setSelectedLanguage };
};