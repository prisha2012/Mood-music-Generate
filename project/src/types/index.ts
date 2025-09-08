export interface Mood {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  tags: string[];
  languages: {
    hindi: string[];
    english: string[];
    punjabi: string[];
  };
}

export interface Quote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
  duration?: string;
}

export interface Playlist {
  id: string;
  title: string;
  tracks: Track[];
  mood: string;
  language: string;
}

export interface Favorite {
  id: string;
  type: 'quote' | 'track';
  data: Quote | Track;
  savedAt: string;
}

export type Language = 'hindi' | 'english' | 'punjabi';