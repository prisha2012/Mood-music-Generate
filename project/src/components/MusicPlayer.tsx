import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, ExternalLink, Heart, Music, Plus } from 'lucide-react';
import { Mood, Track, Language } from '../types';
import { SAMPLE_VIDEOS } from '../utils/constants';
import { useFavorites } from '../hooks/useFavorites';

interface MusicPlayerProps {
  mood: Mood;
  language: Language;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ mood, language }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddMore, setShowAddMore] = useState(false);
  const { addToFavorites, isFavorite } = useFavorites();

  // Sample playlist data based on mood and language
  const generatePlaylist = (mood: Mood, language: Language): Track[] => {
    const moodPlaylists = {
      happy: {
        hindi: [
          { id: '1', title: 'Jai Ho', artist: 'A.R. Rahman', videoId: 'kffacxfA7G4', thumbnail: 'https://img.youtube.com/vi/kffacxfA7G4/maxresdefault.jpg' },
          { id: '2', title: 'Nagada Sang Dhol', artist: 'Shreya Ghoshal', videoId: 'ZTmF2v59CtI', thumbnail: 'https://img.youtube.com/vi/ZTmF2v59CtI/maxresdefault.jpg' },
          { id: '3', title: 'Gallan Goodiyaan', artist: 'Yashraj Mukhate', videoId: 'jGflUbPQfW8', thumbnail: 'https://img.youtube.com/vi/jGflUbPQfW8/maxresdefault.jpg' },
          { id: '4', title: 'Balam Pichkari', artist: 'Vishal Dadlani', videoId: 'Zd1BCiFaNfY', thumbnail: 'https://img.youtube.com/vi/Zd1BCiFaNfY/maxresdefault.jpg' },
          { id: '5', title: 'Kala Chashma', artist: 'Amar Arshi', videoId: 'yiUG267px3k', thumbnail: 'https://img.youtube.com/vi/yiUG267px3k/maxresdefault.jpg' },
          { id: '6', title: 'Badtameez Dil', artist: 'Raghav Mathur', videoId: 'QGpDF2ZcUAw', thumbnail: 'https://img.youtube.com/vi/QGpDF2ZcUAw/maxresdefault.jpg' },
          { id: '7', title: 'Tune Maari Entriyaan', artist: 'Vishal Dadlani', videoId: 'WsE_AvIJdxs', thumbnail: 'https://img.youtube.com/vi/WsE_AvIJdxs/maxresdefault.jpg' },
          { id: '8', title: 'Malhari', artist: 'Vishal Dadlani', videoId: 'l_MyUGq7pgs', thumbnail: 'https://img.youtube.com/vi/l_MyUGq7pgs/maxresdefault.jpg' },
          { id: '9', title: 'Senorita', artist: 'Farhan Akhtar', videoId: 'g6uxV8OdDPk', thumbnail: 'https://img.youtube.com/vi/g6uxV8OdDPk/maxresdefault.jpg' },
          { id: '10', title: 'Kar Gayi Chull', artist: 'Neha Kakkar', videoId: 'WKOBg_-xbK8', thumbnail: 'https://img.youtube.com/vi/WKOBg_-xbK8/maxresdefault.jpg' }
        ],
        english: [
          { id: '1', title: 'Happy', artist: 'Pharrell Williams', videoId: 'ZbZSe6N_BXs', thumbnail: 'https://img.youtube.com/vi/ZbZSe6N_BXs/maxresdefault.jpg' },
          { id: '2', title: 'Good as Hell', artist: 'Lizzo', videoId: 'SmbmeOgWsqE', thumbnail: 'https://img.youtube.com/vi/SmbmeOgWsqE/maxresdefault.jpg' },
          { id: '3', title: 'Can\'t Stop the Feeling', artist: 'Justin Timberlake', videoId: 'ru0K8uYEZWw', thumbnail: 'https://img.youtube.com/vi/ru0K8uYEZWw/maxresdefault.jpg' },
          { id: '4', title: 'Uptown Funk', artist: 'Bruno Mars', videoId: 'OPf0YbXqDm0', thumbnail: 'https://img.youtube.com/vi/OPf0YbXqDm0/maxresdefault.jpg' },
          { id: '5', title: 'Walking on Sunshine', artist: 'Katrina and the Waves', videoId: 'iPUmE-tne5U', thumbnail: 'https://img.youtube.com/vi/iPUmE-tne5U/maxresdefault.jpg' },
          { id: '6', title: 'Good Vibrations', artist: 'The Beach Boys', videoId: 'Eab_beh07HU', thumbnail: 'https://img.youtube.com/vi/Eab_beh07HU/maxresdefault.jpg' },
          { id: '7', title: 'I Got a Feeling', artist: 'Black Eyed Peas', videoId: 'uSD4vsh1zDA', thumbnail: 'https://img.youtube.com/vi/uSD4vsh1zDA/maxresdefault.jpg' },
          { id: '8', title: 'Shake It Off', artist: 'Taylor Swift', videoId: 'nfWlot6h_JM', thumbnail: 'https://img.youtube.com/vi/nfWlot6h_JM/maxresdefault.jpg' },
          { id: '9', title: 'Don\'t Worry Be Happy', artist: 'Bobby McFerrin', videoId: 'd-diB65scQU', thumbnail: 'https://img.youtube.com/vi/d-diB65scQU/maxresdefault.jpg' },
          { id: '10', title: 'Best Day of My Life', artist: 'American Authors', videoId: 'Y66j_BUCBMY', thumbnail: 'https://img.youtube.com/vi/Y66j_BUCBMY/maxresdefault.jpg' }
        ],
        punjabi: [
          { id: '1', title: 'Laembadgini', artist: 'Diljit Dosanjh', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' },
          { id: '2', title: 'High Rated Gabru', artist: 'Guru Randhawa', videoId: 'PCVzOcWjgpM', thumbnail: 'https://img.youtube.com/vi/PCVzOcWjgpM/maxresdefault.jpg' },
          { id: '3', title: 'Suit Suit', artist: 'Guru Randhawa', videoId: 'cRBl1PkGcbo', thumbnail: 'https://img.youtube.com/vi/cRBl1PkGcbo/maxresdefault.jpg' },
          { id: '4', title: 'Proper Patola', artist: 'Diljit Dosanjh', videoId: 'WKOBg_-xbK8', thumbnail: 'https://img.youtube.com/vi/WKOBg_-xbK8/maxresdefault.jpg' },
          { id: '5', title: 'Lahore', artist: 'Guru Randhawa', videoId: 'cRBl1PkGcbo', thumbnail: 'https://img.youtube.com/vi/cRBl1PkGcbo/maxresdefault.jpg' },
          { id: '6', title: 'Patiala Peg', artist: 'Diljit Dosanjh', videoId: 'WKOBg_-xbK8', thumbnail: 'https://img.youtube.com/vi/WKOBg_-xbK8/maxresdefault.jpg' },
          { id: '7', title: 'Ban Ja Rani', artist: 'Guru Randhawa', videoId: 'cRBl1PkGcbo', thumbnail: 'https://img.youtube.com/vi/cRBl1PkGcbo/maxresdefault.jpg' },
          { id: '8', title: 'Do You Know', artist: 'Diljit Dosanjh', videoId: 'WKOBg_-xbK8', thumbnail: 'https://img.youtube.com/vi/WKOBg_-xbK8/maxresdefault.jpg' },
          { id: '9', title: 'Made in India', artist: 'Guru Randhawa', videoId: 'cRBl1PkGcbo', thumbnail: 'https://img.youtube.com/vi/cRBl1PkGcbo/maxresdefault.jpg' },
          { id: '10', title: 'Ishare Tere', artist: 'Guru Randhawa', videoId: 'cRBl1PkGcbo', thumbnail: 'https://img.youtube.com/vi/cRBl1PkGcbo/maxresdefault.jpg' }
        ]
      },
      sad: {
        hindi: [
          { id: '1', title: 'Tum Hi Ho', artist: 'Arijit Singh', videoId: 'IJq0yyWug1k', thumbnail: 'https://img.youtube.com/vi/IJq0yyWug1k/maxresdefault.jpg' },
          { id: '2', title: 'Ae Dil Hai Mushkil', artist: 'Arijit Singh', videoId: 'Z_PODraXg4E', thumbnail: 'https://img.youtube.com/vi/Z_PODraXg4E/maxresdefault.jpg' },
          { id: '3', title: 'Channa Mereya', artist: 'Arijit Singh', videoId: 'bzSTpdcs-EI', thumbnail: 'https://img.youtube.com/vi/bzSTpdcs-EI/maxresdefault.jpg' },
          { id: '4', title: 'Hamari Adhuri Kahani', artist: 'Arijit Singh', videoId: 'Wq4tyDRjTCw', thumbnail: 'https://img.youtube.com/vi/Wq4tyDRjTCw/maxresdefault.jpg' },
          { id: '5', title: 'Tera Ban Jaunga', artist: 'Akhil Sachdeva', videoId: 'PgliVv-1Cck', thumbnail: 'https://img.youtube.com/vi/PgliVv-1Cck/maxresdefault.jpg' },
          { id: '6', title: 'Bekhayali', artist: 'Sachet Tandon', videoId: 'VOLKJJvfAbg', thumbnail: 'https://img.youtube.com/vi/VOLKJJvfAbg/maxresdefault.jpg' },
          { id: '7', title: 'Raabta', artist: 'Arijit Singh', videoId: 'Wq4tyDRjTCw', thumbnail: 'https://img.youtube.com/vi/Wq4tyDRjTCw/maxresdefault.jpg' },
          { id: '8', title: 'Phir Bhi Tumko Chaahunga', artist: 'Arijit Singh', videoId: 'PgliVv-1Cck', thumbnail: 'https://img.youtube.com/vi/PgliVv-1Cck/maxresdefault.jpg' },
          { id: '9', title: 'Agar Tum Saath Ho', artist: 'Alka Yagnik', videoId: 'sK7riqg2mr4', thumbnail: 'https://img.youtube.com/vi/sK7riqg2mr4/maxresdefault.jpg' },
          { id: '10', title: 'Kabira', artist: 'Tochi Raina', videoId: 'jHNNMj5bNQw', thumbnail: 'https://img.youtube.com/vi/jHNNMj5bNQw/maxresdefault.jpg' }
        ],
        english: [
          { id: '1', title: 'Someone Like You', artist: 'Adele', videoId: 'hLQl3WQQoQ0', thumbnail: 'https://img.youtube.com/vi/hLQl3WQQoQ0/maxresdefault.jpg' },
          { id: '2', title: 'Hello', artist: 'Adele', videoId: 'YQHsXMglC9A', thumbnail: 'https://img.youtube.com/vi/YQHsXMglC9A/maxresdefault.jpg' },
          { id: '3', title: 'Fix You', artist: 'Coldplay', videoId: 'k4V3Mo61fJM', thumbnail: 'https://img.youtube.com/vi/k4V3Mo61fJM/maxresdefault.jpg' },
          { id: '4', title: 'Mad World', artist: 'Gary Jules', videoId: '4N3N1MlvVc4', thumbnail: 'https://img.youtube.com/vi/4N3N1MlvVc4/maxresdefault.jpg' },
          { id: '5', title: 'Hurt', artist: 'Johnny Cash', videoId: '8AHCfZTRGiI', thumbnail: 'https://img.youtube.com/vi/8AHCfZTRGiI/maxresdefault.jpg' },
          { id: '6', title: 'Black', artist: 'Pearl Jam', videoId: 'cs-XZ_dN4Hc', thumbnail: 'https://img.youtube.com/vi/cs-XZ_dN4Hc/maxresdefault.jpg' },
          { id: '7', title: 'Everybody Hurts', artist: 'R.E.M.', videoId: '5rOiW_xY-kc', thumbnail: 'https://img.youtube.com/vi/5rOiW_xY-kc/maxresdefault.jpg' },
          { id: '8', title: 'Tears in Heaven', artist: 'Eric Clapton', videoId: 'JxPj3GAYYZ0', thumbnail: 'https://img.youtube.com/vi/JxPj3GAYYZ0/maxresdefault.jpg' },
          { id: '9', title: 'The Sound of Silence', artist: 'Disturbed', videoId: 'u9Dg-g7t2l4', thumbnail: 'https://img.youtube.com/vi/u9Dg-g7t2l4/maxresdefault.jpg' },
          { id: '10', title: 'Skinny Love', artist: 'Bon Iver', videoId: 'ssdgFoHLwnk', thumbnail: 'https://img.youtube.com/vi/ssdgFoHLwnk/maxresdefault.jpg' }
        ],
        punjabi: [
          { id: '1', title: 'Qismat', artist: 'Ammy Virk', videoId: 'Ah9BibsV8PE', thumbnail: 'https://img.youtube.com/vi/Ah9BibsV8PE/maxresdefault.jpg' },
          { id: '2', title: 'Sufna', artist: 'Ammy Virk', videoId: 'DjP8GKQnL88', thumbnail: 'https://img.youtube.com/vi/DjP8GKQnL88/maxresdefault.jpg' },
          { id: '3', title: 'Kya Baat Ay', artist: 'Harrdy Sandhu', videoId: 'Ah9BibsV8PE', thumbnail: 'https://img.youtube.com/vi/Ah9BibsV8PE/maxresdefault.jpg' },
          { id: '4', title: 'Titliaan', artist: 'Afsana Khan', videoId: 'Ah9BibsV8PE', thumbnail: 'https://img.youtube.com/vi/Ah9BibsV8PE/maxresdefault.jpg' },
          { id: '5', title: 'Filhaal', artist: 'B Praak', videoId: 'Ah9BibsV8PE', thumbnail: 'https://img.youtube.com/vi/Ah9BibsV8PE/maxresdefault.jpg' },
          { id: '6', title: 'Ranjha', artist: 'B Praak', videoId: 'Ah9BibsV8PE', thumbnail: 'https://img.YouTube.com/vi/Ah9BibsV8PE/maxresdefault.jpg' },
          { id: '7', title: 'Khaab', artist: 'Akhil', videoId: 'Ah9BibsV8PE', thumbnail: 'https://img.youtube.com/vi/Ah9BibsV8PE/maxresdefault.jpg' },
          { id: '8', title: 'Tera Ghata', artist: 'Gajendra Verma', videoId: 'Ah9BibsV8PE', thumbnail: 'https://img.youtube.com/vi/Ah9BibsV8PE/maxresdefault.jpg' },
          { id: '9', title: 'Dil Diyan Gallan', artist: 'Atif Aslam', videoId: 'Ah9BibsV8PE', thumbnail: 'https://img.youtube.com/vi/Ah9BibsV8PE/maxresdefault.jpg' },
          { id: '10', title: 'Ishq Tera', artist: 'Guru Randhawa', videoId: 'Ah9BibsV8PE', thumbnail: 'https://img.youtube.com/vi/Ah9BibsV8PE/maxresdefault.jpg' }
        ]
      },
      // Add more moods...
      calm: {
        hindi: [
          { id: '1', title: 'Kun Faya Kun', artist: 'A.R. Rahman', videoId: 'T94PHkuydcw', thumbnail: 'https://img.youtube.com/vi/T94PHkuydcw/maxresdefault.jpg' },
          { id: '2', title: 'Shukran Allah', artist: 'Kailash Kher', videoId: 'btPJPFnesV4', thumbnail: 'https://img.youtube.com/vi/btPJPFnesV4/maxresdefault.jpg' },
          { id: '3', title: 'Maula Mere', artist: 'Roop Kumar Rathod', videoId: 'T94PHkuydcw', thumbnail: 'https://img.youtube.com/vi/T94PHkuydcw/maxresdefault.jpg' },
          { id: '4', title: 'Allah Ke Bande', artist: 'Kailash Kher', videoId: 'btPJPFnesV4', thumbnail: 'https://img.youtube.com/vi/btPJPFnesV4/maxresdefault.jpg' },
          { id: '5', title: 'Arziyan', artist: 'Javed Ali', videoId: 'T94PHkuydcw', thumbnail: 'https://img.youtube.com/vi/T94PHkuydcw/maxresdefault.jpg' },
          { id: '6', title: 'Khwaja Mere Khwaja', artist: 'A.R. Rahman', videoId: 'btPJPFnesV4', thumbnail: 'https://img.youtube.com/vi/btPJPFnesV4/maxresdefault.jpg' },
          { id: '7', title: 'Piya Haji Ali', artist: 'A.R. Rahman', videoId: 'T94PHkuydcw', thumbnail: 'https://img.youtube.com/vi/T94PHkuydcw/maxresdefault.jpg' },
          { id: '8', title: 'Mitwa', artist: 'Shafqat Amanat Ali', videoId: 'btPJPFnesV4', thumbnail: 'https://img.youtube.com/vi/btPJPFnesV4/maxresdefault.jpg' },
          { id: '9', title: 'Jashn-E-Bahaaraa', artist: 'Javed Ali', videoId: 'T94PHkuydcw', thumbnail: 'https://img.youtube.com/vi/T94PHkuydcw/maxresdefault.jpg' },
          { id: '10', title: 'Tere Bina', artist: 'A.R. Rahman', videoId: 'btPJPFnesV4', thumbnail: 'https://img.youtube.com/vi/btPJPFnesV4/maxresdefault.jpg' }
        ],
        english: [
          { id: '1', title: 'Weightless', artist: 'Marconi Union', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' },
          { id: '2', title: 'Clair de Lune', artist: 'Claude Debussy', videoId: 'dQw4w9WgXcQ', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
          { id: '3', title: 'River', artist: 'Joni Mitchell', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' },
          { id: '4', title: 'Mad World', artist: 'Gary Jules', videoId: 'dQw4w9WgXcQ', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
          { id: '5', title: 'Breathe Me', artist: 'Sia', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' },
          { id: '6', title: 'The Night We Met', artist: 'Lord Huron', videoId: 'dQw4w9WgXcQ', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
          { id: '7', title: 'Holocene', artist: 'Bon Iver', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' },
          { id: '8', title: 'Skinny Love', artist: 'Bon Iver', videoId: 'dQw4w9WgXcQ', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
          { id: '9', title: 'To Build a Home', artist: 'The Cinematic Orchestra', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' },
          { id: '10', title: 'Hurt', artist: 'Johnny Cash', videoId: 'dQw4w9WgXcQ', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' }
        ],
        punjabi: [
          { id: '1', title: 'Waheguru', artist: 'Satinder Sartaaj', videoId: 'dQw4w9WgXcQ', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
          { id: '2', title: 'Ik Onkar', artist: 'Harshdeep Kaur', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' },
          { id: '3', title: 'Sarbat Da Bhala', artist: 'Satinder Sartaaj', videoId: 'dQw4w9WgXcQ', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
          { id: '4', title: 'Mool Mantar', artist: 'Harshdeep Kaur', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' },
          { id: '5', title: 'Dhan Guru Nanak', artist: 'Satinder Sartaaj', videoId: 'dQw4w9WgXcQ', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
          { id: '6', title: 'Sukhmani Sahib', artist: 'Harshdeep Kaur', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' },
          { id: '7', title: 'Ardaas', artist: 'Satinder Sartaaj', videoId: 'dQw4w9WgXcQ', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
          { id: '8', title: 'Simran', artist: 'Harshdeep Kaur', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' },
          { id: '9', title: 'Gurbani', artist: 'Satinder Sartaaj', videoId: 'dQw4w9WgXcQ', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
          { id: '10', title: 'Shabad', artist: 'Harshdeep Kaur', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' }
        ]
      },
      energetic: {
        hindi: [
          { id: '1', title: 'Jai Ho', artist: 'A.R. Rahman', videoId: 'kffacxfA7G4', thumbnail: 'https://img.youtube.com/vi/kffacxfA7G4/maxresdefault.jpg' },
          { id: '2', title: 'Malhari', artist: 'Vishal Dadlani', videoId: 'l_MyUGq7pgs', thumbnail: 'https://img.youtube.com/vi/l_MyUGq7pgs/maxresdefault.jpg' },
          { id: '3', title: 'Nagada Sang Dhol', artist: 'Shreya Ghoshal', videoId: 'ZTmF2v59CtI', thumbnail: 'https://img.youtube.com/vi/ZTmF2v59CtI/maxresdefault.jpg' },
          { id: '4', title: 'Tattad Tattad', artist: 'Arijit Singh', videoId: 'kffacxfA7G4', thumbnail: 'https://img.youtube.com/vi/kffacxfA7G4/maxresdefault.jpg' },
          { id: '5', title: 'Khalibali', artist: 'Shivam Tiwari', videoId: 'l_MyUGq7pgs', thumbnail: 'https://img.youtube.com/vi/l_MyUGq7pgs/maxresdefault.jpg' },
          { id: '6', title: 'Apna Time Aayega', artist: 'Ranveer Singh', videoId: 'ZTmF2v59CtI', thumbnail: 'https://img.youtube.com/vi/ZTmF2v59CtI/maxresdefault.jpg' },
          { id: '7', title: 'Zinda', artist: 'Shankar Mahadevan', videoId: 'kffacxfA7G4', thumbnail: 'https://img.youtube.com/vi/kffacxfA7G4/maxresdefault.jpg' },
          { id: '8', title: 'Chak De India', artist: 'Sukhwinder Singh', videoId: 'l_MyUGq7pgs', thumbnail: 'https://img.youtube.com/vi/l_MyUGq7pgs/maxresdefault.jpg' },
          { id: '9', title: 'Dangal', artist: 'Daler Mehndi', videoId: 'ZTmF2v59CtI', thumbnail: 'https://img.youtube.com/vi/ZTmF2v59CtI/maxresdefault.jpg' },
          { id: '10', title: 'Sultan', artist: 'Vishal Dadlani', videoId: 'kffacxfA7G4', thumbnail: 'https://img.youtube.com/vi/kffacxfA7G4/maxresdefault.jpg' }
        ],
        english: [
          { id: '1', title: 'Eye of the Tiger', artist: 'Survivor', videoId: 'btPJPFnesV4', thumbnail: 'https://img.youtube.com/vi/btPJPFnesV4/maxresdefault.jpg' },
          { id: '2', title: 'Thunder', artist: 'Imagine Dragons', videoId: 'fKopy74weus', thumbnail: 'https://img.youtube.com/vi/fKopy74weus/maxresdefault.jpg' },
          { id: '3', title: 'Believer', artist: 'Imagine Dragons', videoId: '7wtfhZwyrcc', thumbnail: 'https://img.youtube.com/vi/7wtfhZwyrcc/maxresdefault.jpg' },
          { id: '4', title: 'Stronger', artist: 'Kelly Clarkson', videoId: 'Xn676-fLq7I', thumbnail: 'https://img.youtube.com/vi/Xn676-fLq7I/maxresdefault.jpg' },
          { id: '5', title: 'Roar', artist: 'Katy Perry', videoId: 'CevxZvSJLk8', thumbnail: 'https://img.youtube.com/vi/CevxZvSJLk8/maxresdefault.jpg' },
          { id: '6', title: 'Titanium', artist: 'David Guetta ft. Sia', videoId: 'JRfuAukYTKg', thumbnail: 'https://img.youtube.com/vi/JRfuAukYTKg/maxresdefault.jpg' },
          { id: '7', title: 'We Will Rock You', artist: 'Queen', videoId: '-tJYN-eG1zk', thumbnail: 'https://img.youtube.com/vi/-tJYN-eG1zk/maxresdefault.jpg' },
          { id: '8', title: 'Don\'t Stop Me Now', artist: 'Queen', videoId: 'HgzGwKwLmgM', thumbnail: 'https://img.youtube.com/vi/HgzGwKwLmgM/maxresdefault.jpg' },
          { id: '9', title: 'Pump It', artist: 'Black Eyed Peas', videoId: 'ZaI2IlHwmgQ', thumbnail: 'https://img.youtube.com/vi/ZaI2IlHwmgQ/maxresdefault.jpg' },
          { id: '10', title: 'Can\'t Hold Us', artist: 'Macklemore', videoId: '2zNSgSzhBfM', thumbnail: 'https://img.youtube.com/vi/2zNSgSzhBfM/maxresdefault.jpg' }
        ],
        punjabi: [
          { id: '1', title: 'Sher Marna', artist: 'Ranjit Bawa', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' },
          { id: '2', title: 'Jatt Da Muqabala', artist: 'Sidhu Moose Wala', videoId: 'PCVzOcWjgpM', thumbnail: 'https://img.youtube.com/vi/PCVzOcWjgpM/maxresdefault.jpg' },
          { id: '3', title: 'Legend', artist: 'Sidhu Moose Wala', videoId: 'cRBl1PkGcbo', thumbnail: 'https://img.youtube.com/vi/cRBl1PkGcbo/maxresdefault.jpg' },
          { id: '4', title: 'Bambiha Bole', artist: 'Sidhu Moose Wala', videoId: 'WKOBg_-xbK8', thumbnail: 'https://img.youtube.com/vi/WKOBg_-xbK8/maxresdefault.jpg' },
          { id: '5', title: 'Jatt Jeone Morh', artist: 'Sidhu Moose Wala', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' },
          { id: '6', title: 'Power', artist: 'Ranjit Bawa', videoId: 'PCVzOcWjgpM', thumbnail: 'https://img.youtube.com/vi/PCVzOcWjgpM/maxresdefault.jpg' },
          { id: '7', title: 'Jatt Fire', artist: 'Diljit Dosanjh', videoId: 'cRBl1PkGcbo', thumbnail: 'https://img.youtube.com/vi/cRBl1PkGcbo/maxresdefault.jpg' },
          { id: '8', title: 'Gabru', artist: 'J Star', videoId: 'WKOBg_-xbK8', thumbnail: 'https://img.youtube.com/vi/WKOBg_-xbK8/maxresdefault.jpg' },
          { id: '9', title: 'Jatt & Juliet', artist: 'Diljit Dosanjh', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' },
          { id: '10', title: 'Singh Is King', artist: 'Snoop Dogg', videoId: 'PCVzOcWjgpM', thumbnail: 'https://img.youtube.com/vi/PCVzOcWjgpM/maxresdefault.jpg' }
        ]
      },
      romantic: {
        hindi: [
          { id: '1', title: 'Tere Naam', artist: 'Udit Narayan', videoId: 'IJq0yyWug1k', thumbnail: 'https://img.youtube.com/vi/IJq0yyWug1k/maxresdefault.jpg' },
          { id: '2', title: 'Jeene Laga Hoon', artist: 'Atif Aslam', videoId: 'Z_PODraXg4E', thumbnail: 'https://img.youtube.com/vi/Z_PODraXg4E/maxresdefault.jpg' },
          { id: '3', title: 'Tum Hi Ho', artist: 'Arijit Singh', videoId: 'bzSTpdcs-EI', thumbnail: 'https://img.youtube.com/vi/bzSTpdcs-EI/maxresdefault.jpg' },
          { id: '4', title: 'Raabta', artist: 'Arijit Singh', videoId: 'Wq4tyDRjTCw', thumbnail: 'https://img.youtube.com/vi/Wq4tyDRjTCw/maxresdefault.jpg' },
          { id: '5', title: 'Tera Ban Jaunga', artist: 'Akhil Sachdeva', videoId: 'PgliVv-1Cck', thumbnail: 'https://img.youtube.com/vi/PgliVv-1Cck/maxresdefault.jpg' },
          { id: '6', title: 'Dil Diyan Gallan', artist: 'Atif Aslam', videoId: 'sK7riqg2mr4', thumbnail: 'https://img.youtube.com/vi/sK7riqg2mr4/maxresdefault.jpg' },
          { id: '7', title: 'Hawayein', artist: 'Arijit Singh', videoId: 'jHNNMj5bNQw', thumbnail: 'https://img.youtube.com/vi/jHNNMj5bNQw/maxresdefault.jpg' },
          { id: '8', title: 'Bolna', artist: 'Arijit Singh', videoId: 'IJq0yyWug1k', thumbnail: 'https://img.youtube.com/vi/IJq0yyWug1k/maxresdefault.jpg' },
          { id: '9', title: 'Gerua', artist: 'Arijit Singh', videoId: 'Z_PODraXg4E', thumbnail: 'https://img.youtube.com/vi/Z_PODraXg4E/maxresdefault.jpg' },
          { id: '10', title: 'Janam Janam', artist: 'Arijit Singh', videoId: 'bzSTpdcs-EI', thumbnail: 'https://img.youtube.com/vi/bzSTpdcs-EI/maxresdefault.jpg' }
        ],
        english: [
          { id: '1', title: 'Perfect', artist: 'Ed Sheeran', videoId: '2Vv-BfVoq4g', thumbnail: 'https://img.youtube.com/vi/2Vv-BfVoq4g/maxresdefault.jpg' },
          { id: '2', title: 'All of Me', artist: 'John Legend', videoId: 'btPJPFnesV4', thumbnail: 'https://img.youtube.com/vi/btPJPFnesV4/maxresdefault.jpg' },
          { id: '3', title: 'Thinking Out Loud', artist: 'Ed Sheeran', videoId: 'lp-EO5I60KA', thumbnail: 'https://img.youtube.com/vi/lp-EO5I60KA/maxresdefault.jpg' },
          { id: '4', title: 'A Thousand Years', artist: 'Christina Perri', videoId: 'rtOvBOTyX00', thumbnail: 'https://img.youtube.com/vi/rtOvBOTyX00/maxresdefault.jpg' },
          { id: '5', title: 'Make You Feel My Love', artist: 'Adele', videoId: '0put0_a--Ng', thumbnail: 'https://img.youtube.com/vi/0put0_a--Ng/maxresdefault.jpg' },
          { id: '6', title: 'At Last', artist: 'Etta James', videoId: 'S-cbOl96RFM', thumbnail: 'https://img.youtube.com/vi/S-cbOl96RFM/maxresdefault.jpg' },
          { id: '7', title: 'Can\'t Help Myself', artist: 'Four Tops', videoId: 'T6QKqFPRZSA', thumbnail: 'https://img.youtube.com/vi/T6QKqFPRZSA/maxresdefault.jpg' },
          { id: '8', title: 'Wonderful Tonight', artist: 'Eric Clapton', videoId: 'fxAiUq8yn8k', thumbnail: 'https://img.youtube.com/vi/fxAiUq8yn8k/maxresdefault.jpg' },
          { id: '9', title: 'Unchained Melody', artist: 'The Righteous Brothers', videoId: 'qiiyq2xrSI0', thumbnail: 'https://img.youtube.com/vi/qiiyq2xrSI0/maxresdefault.jpg' },
          { id: '10', title: 'Stand by Me', artist: 'Ben E. King', videoId: 'hwZNL7QVJjE', thumbnail: 'https://img.youtube.com/vi/hwZNL7QVJjE/maxresdefault.jpg' }
        ],
        punjabi: [
          { id: '1', title: 'Ishq Tera', artist: 'Guru Randhawa', videoId: 'Ah9BibsV8PE', thumbnail: 'https://img.youtube.com/vi/Ah9BibsV8PE/maxresdefault.jpg' },
          { id: '2', title: 'Dil Diyan Gallan', artist: 'Atif Aslam', videoId: 'DjP8GKQnL88', thumbnail: 'https://img.youtube.com/vi/DjP8GKQnL88/maxresdefault.jpg' },
          { id: '3', title: 'Qismat', artist: 'Ammy Virk', videoId: 'Ah9BibsV8PE', thumbnail: 'https://img.youtube.com/vi/Ah9BibsV8PE/maxresdefault.jpg' },
          { id: '4', title: 'Filhaal', artist: 'B Praak', videoId: 'DjP8GKQnL88', thumbnail: 'https://img.youtube.com/vi/DjP8GKQnL88/maxresdefault.jpg' },
          { id: '5', title: 'Khaab', artist: 'Akhil', videoId: 'Ah9BibsV8PE', thumbnail: 'https://img.youtube.com/vi/Ah9BibsV8PE/maxresdefault.jpg' },
          { id: '6', title: 'Ranjha', artist: 'B Praak', videoId: 'DjP8GKQnL88', thumbnail: 'https://img.youtube.com/vi/DjP8GKQnL88/maxresdefault.jpg' },
          { id: '7', title: 'Titliaan', artist: 'Afsana Khan', videoId: 'Ah9BibsV8PE', thumbnail: 'https://img.youtube.com/vi/Ah9BibsV8PE/maxresdefault.jpg' },
          { id: '8', title: 'Tera Ghata', artist: 'Gajendra Verma', videoId: 'DjP8GKQnL88', thumbnail: 'https://img.youtube.com/vi/DjP8GKQnL88/maxresdefault.jpg' },
          { id: '9', title: 'Sufna', artist: 'Ammy Virk', videoId: 'Ah9BibsV8PE', thumbnail: 'https://img.youtube.com/vi/Ah9BibsV8PE/maxresdefault.jpg' },
          { id: '10', title: 'Kya Baat Ay', artist: 'Harrdy Sandhu', videoId: 'DjP8GKQnL88', thumbnail: 'https://img.youtube.com/vi/DjP8GKQnL88/maxresdefault.jpg' }
        ]
      },
      motivated: {
        hindi: [
          { id: '1', title: 'Zinda', artist: 'Shankar Mahadevan', videoId: 'kffacxfA7G4', thumbnail: 'https://img.youtube.com/vi/kffacxfA7G4/maxresdefault.jpg' },
          { id: '2', title: 'Chak De India', artist: 'Sukhwinder Singh', videoId: 'l_MyUGq7pgs', thumbnail: 'https://img.youtube.com/vi/l_MyUGq7pgs/maxresdefault.jpg' },
          { id: '3', title: 'Kar Har Maidaan Fateh', artist: 'Sukhwinder Singh', videoId: 'ZTmF2v59CtI', thumbnail: 'https://img.youtube.com/vi/ZTmF2v59CtI/maxresdefault.jpg' },
          { id: '4', title: 'Sultan', artist: 'Vishal Dadlani', videoId: 'kffacxfA7G4', thumbnail: 'https://img.youtube.com/vi/kffacxfA7G4/maxresdefault.jpg' },
          { id: '5', title: 'Dangal', artist: 'Daler Mehndi', videoId: 'l_MyUGq7pgs', thumbnail: 'https://img.youtube.com/vi/l_MyUGq7pgs/maxresdefault.jpg' },
          { id: '6', title: 'Apna Time Aayega', artist: 'Ranveer Singh', videoId: 'ZTmF2v59CtI', thumbnail: 'https://img.youtube.com/vi/ZTmF2v59CtI/maxresdefault.jpg' },
          { id: '7', title: 'Lakshya', artist: 'Shankar Mahadevan', videoId: 'kffacxfA7G4', thumbnail: 'https://img.youtube.com/vi/kffacxfA7G4/maxresdefault.jpg' },
          { id: '8', title: 'Bhaag Milkha Bhaag', artist: 'Shankar Mahadevan', videoId: 'l_MyUGq7pgs', thumbnail: 'https://img.youtube.com/vi/l_MyUGq7pgs/maxresdefault.jpg' },
          { id: '9', title: 'Mary Kom', artist: 'Priyanka Chopra', videoId: 'ZTmF2v59CtI', thumbnail: 'https://img.youtube.com/vi/ZTmF2v59CtI/maxresdefault.jpg' },
          { id: '10', title: 'Gold', artist: 'Akshay Kumar', videoId: 'kffacxfA7G4', thumbnail: 'https://img.youtube.com/vi/kffacxfA7G4/maxresdefault.jpg' }
        ],
        english: [
          { id: '1', title: 'Stronger', artist: 'Kelly Clarkson', videoId: 'Xn676-fLq7I', thumbnail: 'https://img.youtube.com/vi/Xn676-fLq7I/maxresdefault.jpg' },
          { id: '2', title: 'Roar', artist: 'Katy Perry', videoId: 'CevxZvSJLk8', thumbnail: 'https://img.youtube.com/vi/CevxZvSJLk8/maxresdefault.jpg' },
          { id: '3', title: 'Fight Song', artist: 'Rachel Platten', videoId: 'xo1VInw-SKc', thumbnail: 'https://img.youtube.com/vi/xo1VInw-SKc/maxresdefault.jpg' },
          { id: '4', title: 'Unstoppable', artist: 'Sia', videoId: 'cxjvTXo9WWM', thumbnail: 'https://img.youtube.com/vi/cxjvTXo9WWM/maxresdefault.jpg' },
          { id: '5', title: 'Confident', artist: 'Demi Lovato', videoId: 'cwjjSmpiANE', thumbnail: 'https://img.youtube.com/vi/cwjjSmpiANE/maxresdefault.jpg' },
          { id: '6', title: 'Titanium', artist: 'David Guetta ft. Sia', videoId: 'JRfuAukYTKg', thumbnail: 'https://img.youtube.com/vi/JRfuAukYTKg/maxresdefault.jpg' },
          { id: '7', title: 'Hall of Fame', artist: 'The Script', videoId: 'mk48xRzuNvA', thumbnail: 'https://img.youtube.com/vi/mk48xRzuNvA/maxresdefault.jpg' },
          { id: '8', title: 'Champion', artist: 'Carrie Underwood', videoId: 'oomkYi9_q5E', thumbnail: 'https://img.youtube.com/vi/oomkYi9_q5E/maxresdefault.jpg' },
          { id: '9', title: 'Rise Up', artist: 'Andra Day', videoId: 'lwgr_IMeEgA', thumbnail: 'https://img.youtube.com/vi/lwgr_IMeEgA/maxresdefault.jpg' },
          { id: '10', title: 'Believer', artist: 'Imagine Dragons', videoId: '7wtfhZwyrcc', thumbnail: 'https://img.youtube.com/vi/7wtfhZwyrcc/maxresdefault.jpg' }
        ],
        punjabi: [
          { id: '1', title: 'Jee Karda', artist: 'Babbal Rai', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' },
          { id: '2', title: 'Soorma', artist: 'Diljit Dosanjh', videoId: 'PCVzOcWjgpM', thumbnail: 'https://img.youtube.com/vi/PCVzOcWjgpM/maxresdefault.jpg' },
          { id: '3', title: 'Udta Punjab', artist: 'Diljit Dosanjh', videoId: 'cRBl1PkGcbo', thumbnail: 'https://img.youtube.com/vi/cRBl1PkGcbo/maxresdefault.jpg' },
          { id: '4', title: 'Arjun Patiala', artist: 'Diljit Dosanjh', videoId: 'WKOBg_-xbK8', thumbnail: 'https://img.youtube.com/vi/WKOBg_-xbK8/maxresdefault.jpg' },
          { id: '5', title: 'Jatt & Juliet', artist: 'Diljit Dosanjh', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' },
          { id: '6', title: 'Sardaar Ji', artist: 'Diljit Dosanjh', videoId: 'PCVzOcWjgpM', thumbnail: 'https://img.youtube.com/vi/PCVzOcWjgpM/maxresdefault.jpg' },
          { id: '7', title: 'Punjab 1984', artist: 'Diljit Dosanjh', videoId: 'cRBl1PkGcbo', thumbnail: 'https://img.youtube.com/vi/cRBl1PkGcbo/maxresdefault.jpg' },
          { id: '8', title: 'Angrej', artist: 'Amrinder Gill', videoId: 'WKOBg_-xbK8', thumbnail: 'https://img.youtube.com/vi/WKOBg_-xbK8/maxresdefault.jpg' },
          { id: '9', title: 'Bambukat', artist: 'Ammy Virk', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/maxresdefault.jpg' },
          { id: '10', title: 'Nikka Zaildar', artist: 'Ammy Virk', videoId: 'PCVzOcWjgpM', thumbnail: 'https://img.youtube.com/vi/PCVzOcWjgpM/maxresdefault.jpg' }
        ]
      }
    };

    return moodPlaylists[mood.id as keyof typeof moodPlaylists]?.[language] || [];
  };

  useEffect(() => {
    setIsLoading(true);
    const newPlaylist = generatePlaylist(mood, language);
    setPlaylist(newPlaylist);
    if (newPlaylist.length > 0) {
      setCurrentTrack(newPlaylist[0]);
      setCurrentIndex(0);
    }
    setIsLoading(false);
  }, [mood, language]);

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentTrack(playlist[nextIndex]);
    }
  };

  const handleTrackSelect = (track: Track, index: number) => {
    setCurrentTrack(track);
    setCurrentIndex(index);
  };

  const handleFavorite = (track: Track) => {
    addToFavorites('track', track);
  };

  const handleAddMoreSongs = () => {
    setShowAddMore(!showAddMore);
  };

  const openInYouTube = (videoId: string) => {
    window.open(`https://music.youtube.com/watch?v=${videoId}`, '_blank');
  };

  if (isLoading) {
    return (
      <motion.div
        className="bg-white/15 dark:bg-black/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center">
          <Music className="w-12 h-12 mx-auto mb-4 text-white animate-pulse" />
          <p className="text-white">Loading your playlist...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white/15 dark:bg-black/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/15 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {mood.emoji} {mood.name} Playlist
            </h3>
            <p className="text-white/70 text-sm">
              {language.charAt(0).toUpperCase() + language.slice(1)} • {playlist.length} songs
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddMoreSongs}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              title="Add more songs"
            >
              <Plus className="w-5 h-5" />
            </button>
            <Music className="w-8 h-8 text-white/70" />
          </div>
        </div>
      </div>

      {/* Current Track */}
      {currentTrack && (
        <div className="p-6 border-b border-white/15 dark:border-white/10">
          <div className="aspect-video mb-4 rounded-xl overflow-hidden bg-black/20">
            <iframe
              src={`https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=0&rel=0&showinfo=0`}
              title={currentTrack.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">{currentTrack.title}</h4>
              <p className="text-white/70 text-sm">{currentTrack.artist}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleFavorite(currentTrack)}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite('track', currentTrack.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentIndex >= playlist.length - 1}
                className="p-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <SkipForward className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => openInYouTube(currentTrack.videoId)}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Playlist */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">Up Next</h4>
          <span className="text-white/70 text-sm">{playlist.length} songs</span>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {playlist.slice(1).map((track, index) => (
            <motion.div
              key={track.id}
              className="flex items-center space-x-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors"
              onClick={() => handleTrackSelect(track, index + 1)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/48x48?text=🎵';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{track.title}</p>
                <p className="text-white/70 text-sm truncate">{track.artist}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavorite(track);
                }}
                className={`p-1 rounded transition-colors ${
                  isFavorite('track', track.id)
                    ? 'text-red-500'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add More Songs Section */}
      {showAddMore && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-6 border-t border-white/15 dark:border-white/10 bg-white/5"
        >
          <h4 className="text-lg font-semibold text-white mb-4">Add More Songs</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Search for songs to add..."
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                Search YouTube
              </button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                Add Custom Song
              </button>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-3">
            Note: This feature allows you to search and add more songs to your current playlist.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};