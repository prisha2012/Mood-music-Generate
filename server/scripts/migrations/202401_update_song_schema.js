import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Song from '../../models/Song.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mood-music';

async function runMigration() {
  try {
    console.log('Starting migration: Update Song schema...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Get all songs
    const songs = await Song.find({});
    console.log(`Found ${songs.length} songs to update`);

    // Update each song with new fields and ensure proper formatting
    let updatedCount = 0;
    for (const song of songs) {
      const updates = {};
      
      // Set default values for new fields if they don't exist
      if (song.viewCount === undefined) updates.viewCount = 0;
      if (song.likeCount === undefined) updates.likeCount = 0;
      if (song.isExplicit === undefined) updates.isExplicit = false;
      if (song.source === undefined) updates.source = 'youtube';
      if (!song.publishedAt) updates.publishedAt = song.createdAt || new Date();
      
      // Ensure proper formatting of existing fields
      if (song.mood) updates.mood = song.mood.toLowerCase();
      if (song.language) updates.language = song.language.toLowerCase();
      
      // Update the song if there are any changes
      if (Object.keys(updates).length > 0) {
        await Song.updateOne({ _id: song._id }, { $set: updates });
        updatedCount++;
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} songs.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
