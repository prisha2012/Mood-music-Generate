import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import User from '../models/User.js';
import Song from '../models/Song.js';
import Quote from '../models/Quote.js';
import connectDB from '../config/db.js';

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    isEmailVerified: true
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    isEmailVerified: true
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    isEmailVerified: true
  }
];

const songs = [
  // Happy Mood - English
  {
    title: 'Happy - Pharrell Williams',
    artist: 'Pharrell Williams',
    youtubeId: 'ZbZSe6N_BXs',
    thumbnail: 'https://i.ytimg.com/vi/ZbZSe6N_BXs/hqdefault.jpg',
    mood: 'happy',
    language: 'english',
    isApproved: true,
    tags: ['pop', 'upbeat', 'feel good']
  },
  {
    title: 'Can\'t Stop The Feeling',
    artist: 'Justin Timberlake',
    youtubeId: 'ru0K8uYEZWw',
    thumbnail: 'https://i.ytimg.com/vi/ru0K8uYEZWw/hqdefault.jpg',
    mood: 'happy',
    language: 'english',
    isApproved: true,
    tags: ['pop', 'dance', 'upbeat']
  },
  // Add more happy English songs...
  
  // Happy Mood - Hindi
  {
    title: 'Badtameez Dil',
    artist: 'Arijit Singh, Benny Dayal',
    youtubeId: 'w5rFZwHr9t4',
    thumbnail: 'https://i.ytimg.com/vi/w5rFZwHr9t4/hqdefault.jpg',
    mood: 'happy',
    language: 'hindi',
    isApproved: true,
    tags: ['bollywood', 'dance', 'party']
  },
  
  // Sad Mood - English
  {
    title: 'Someone Like You',
    artist: 'Adele',
    youtubeId: 'hLQl3WQQoQ0',
    thumbnail: 'https://i.ytimg.com/vi/hLQl3WQQoQ0/hqdefault.jpg',
    mood: 'sad',
    language: 'english',
    isApproved: true,
    tags: ['ballad', 'heartbreak', 'emotional']
  },
  
  // Add more songs for different moods and languages...
];

const quotes = [
  // Happy Quotes
  {
    content: 'Happiness is not something ready made. It comes from your own actions.',
    author: 'Dalai Lama',
    mood: 'happy',
    tags: ['inspiration', 'happiness'],
    isApproved: true
  },
  {
    content: 'The best way to cheer yourself is to try to cheer someone else up.',
    author: 'Mark Twain',
    mood: 'happy',
    tags: ['kindness', 'happiness'],
    isApproved: true
  },
  
  // Sad Quotes
  {
    content: "The word 'happiness' would lose its meaning if it were not balanced by sadness.",
    author: 'Carl Jung',
    mood: 'sad',
    tags: ['philosophy', 'emotions'],
    isApproved: true
  },
  
  // Energetic Quotes
  {
    content: 'Energy and persistence conquer all things.',
    author: 'Benjamin Franklin',
    mood: 'energetic',
    tags: ['motivation', 'persistence'],
    isApproved: true
  },
  
  // Add more quotes for different moods...
];

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Song.deleteMany();
    await Quote.deleteMany();

    // Import users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // Prepare songs with addedBy field
    const songsWithUser = songs.map(song => ({
      ...song,
      addedBy: adminUser
    }));

    // Import songs
    await Song.insertMany(songsWithUser);

    // Prepare quotes with addedBy field
    const quotesWithUser = quotes.map(quote => ({
      ...quote,
      addedBy: adminUser
    }));

    // Import quotes
    await Quote.insertMany(quotesWithUser);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red);
    process.exit(1);
  }
};

// Destroy data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Song.deleteMany();
    await Quote.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red);
    process.exit(1);
  }
};

// Handle command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
