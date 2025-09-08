import { Mood } from '../types';

export const MOODS: Mood[] = [
  {
    id: 'happy',
    name: 'Happy',
    emoji: '😊',
    gradient: 'from-amber-300 via-yellow-400 to-orange-400',
    tags: ['happiness', 'joy', 'positive', 'cheerful'],
    languages: {
      hindi: ['खुशी', 'आनंद', 'प्रसन्नता', 'हर्ष'],
      english: ['happiness', 'joy', 'positive', 'cheerful'],
      punjabi: ['ਖੁਸ਼ੀ', 'ਆਨੰਦ', 'ਮਸਤੀ', 'ਹਰਸ਼']
    }
  },
  {
    id: 'sad',
    name: 'Sad',
    emoji: '😢',
    gradient: 'from-slate-400 via-blue-500 to-indigo-600',
    tags: ['sadness', 'melancholy', 'grief', 'sorrow'],
    languages: {
      hindi: ['दुख', 'उदासी', 'गम', 'शोक'],
      english: ['sadness', 'melancholy', 'grief', 'sorrow'],
      punjabi: ['ਦੁੱਖ', 'ਉਦਾਸੀ', 'ਗਮ', 'ਸੋਗ']
    }
  },
  {
    id: 'calm',
    name: 'Calm',
    emoji: '🧘',
    gradient: 'from-emerald-300 via-teal-400 to-cyan-400',
    tags: ['peace', 'tranquility', 'serenity', 'mindfulness'],
    languages: {
      hindi: ['शांति', 'सुकून', 'ध्यान', 'स्थिरता'],
      english: ['peace', 'tranquility', 'serenity', 'mindfulness'],
      punjabi: ['ਸ਼ਾਂਤੀ', 'ਸੁਕੂਨ', 'ਧਿਆਨ', 'ਸਥਿਰਤਾ']
    }
  },
  {
    id: 'energetic',
    name: 'Energetic',
    emoji: '⚡',
    gradient: 'from-rose-400 via-pink-500 to-fuchsia-500',
    tags: ['energy', 'power', 'strength', 'motivation'],
    languages: {
      hindi: ['ऊर्जा', 'शक्ति', 'जोश', 'उत्साह'],
      english: ['energy', 'power', 'strength', 'motivation'],
      punjabi: ['ਊਰਜਾ', 'ਸ਼ਕਤੀ', 'ਜੋਸ਼', 'ਉਤਸ਼ਾਹ']
    }
  },
  {
    id: 'romantic',
    name: 'Romantic',
    emoji: '💕',
    gradient: 'from-pink-300 via-rose-400 to-purple-400',
    tags: ['love', 'romance', 'relationships', 'affection'],
    languages: {
      hindi: ['प्रेम', 'मोहब्बत', 'इश्क', 'प्यार'],
      english: ['love', 'romance', 'relationships', 'affection'],
      punjabi: ['ਪਿਆਰ', 'ਮੁਹੱਬਤ', 'ਇਸ਼ਕ', 'ਪ੍ਰੇਮ']
    }
  },
  {
    id: 'motivated',
    name: 'Motivated',
    emoji: '🚀',
    gradient: 'from-lime-400 via-green-400 to-emerald-500',
    tags: ['motivation', 'success', 'goals', 'achievement'],
    languages: {
      hindi: ['प्रेरणा', 'सफलता', 'लक्ष्य', 'उपलब्धि'],
      english: ['motivation', 'success', 'goals', 'achievement'],
      punjabi: ['ਪ੍ਰੇਰਨਾ', 'ਸਫਲਤਾ', 'ਲਕਸ਼', 'ਪ੍ਰਾਪਤੀ']
    }
  }
];

export const YOUTUBE_PLAYLISTS = {
  happy: {
    hindi: 'PLrHGsaF8wWGvjMJCwgQQhAU_8XKuJKwVp',
    english: 'PLrHGsaF8wWGunJiCbQR5C4SfWfAMCGODo',
    punjabi: 'PLrHGsaF8wWGtDVRaOrq3pXmJbQg7X7P3K'
  },
  sad: {
    hindi: 'PLrHGsaF8wWGvEUY3tYKHWJ2qe-D3j5B8w',
    english: 'PLrHGsaF8wWGsW3vJ4C7b6sXnK8TnJPJP3',
    punjabi: 'PLrHGsaF8wWGt9r5RqCcZKoJZaLHtH7YDx'
  },
  calm: {
    hindi: 'PLrHGsaF8wWGvjMJCwgQQhAU_8XKuJKwVp',
    english: 'PLrHGsaF8wWGunJiCbQR5C4SfWfAMCGODo',
    punjabi: 'PLrHGsaF8wWGtDVRaOrq3pXmJbQg7X7P3K'
  },
  energetic: {
    hindi: 'PLrHGsaF8wWGvEUY3tYKHWJ2qe-D3j5B8w',
    english: 'PLrHGsaF8wWGsW3vJ4C7b6sXnK8TnJPJP3',
    punjabi: 'PLrHGsaF8wWGt9r5RqCcZKoJZaLHtH7YDx'
  },
  romantic: {
    hindi: 'PLrHGsaF8wWGvjMJCwgQQhAU_8XKuJKwVp',
    english: 'PLrHGsaF8wWGunJiCbQR5C4SfWfAMCGODo',
    punjabi: 'PLrHGsaF8wWGtDVRaOrq3pXmJbQg7X7P3K'
  },
  motivated: {
    hindi: 'PLrHGsaF8wWGvEUY3tYKHWJ2qe-D3j5B8w',
    english: 'PLrHGsaF8wWGsW3vJ4C7b6sXnK8TnJPJP3',
    punjabi: 'PLrHGsaF8wWGt9r5RqCcZKoJZaLHtH7YDx'
  }
};

export const LANGUAGE_OPTIONS = [
  { id: 'hindi', name: 'Hindi Bollywood', flag: '🇮🇳' },
  { id: 'english', name: 'English', flag: '🇺🇸' },
  { id: 'punjabi', name: 'Punjabi', flag: '🇮🇳' }
];

export const SAMPLE_VIDEOS = {
  happy: {
    hindi: 'kffacxfA7G4',
    english: 'dQw4w9WgXcQ',
    punjabi: 'UfcAVejslrU'
  },
  sad: {
    hindi: 'fJ9rUzIMcZQ',
    english: 'kffacxfA7G4',
    punjabi: 'Ah9BibsV8PE'
  },
  calm: {
    hindi: 'btPJPFnesV4',
    english: 'UfcAVejslrU',
    punjabi: 'dQw4w9WgXcQ'
  },
  energetic: {
    hindi: 'dQw4w9WgXcQ',
    english: 'fJ9rUzIMcZQ',
    punjabi: 'kffacxfA7G4'
  },
  romantic: {
    hindi: 'Ah9BibsV8PE',
    english: 'UfcAVejslrU',
    punjabi: 'btPJPFnesV4'
  },
  motivated: {
    hindi: 'btPJPFnesV4',
    english: 'dQw4w9WgXcQ',
    punjabi: 'fJ9rUzIMcZQ'
  }
};