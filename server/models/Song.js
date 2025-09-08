import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  artist: {
    type: String,
    default: 'Unknown Artist',
    trim: true
  },
  youtubeId: {
    type: String,
    required: [true, 'YouTube ID is required'],
    unique: true
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail URL is required']
  },
  duration: {
    type: String,
    default: 'PT0S' // ISO 8601 duration format
  },
  mood: {
    type: String,
    required: [true, 'Mood is required'],
    enum: ['happy', 'sad', 'energetic', 'calm', 'romantic', 'motivated']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: ['hindi', 'english', 'punjabi']
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  playCount: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster querying
songSchema.index({ mood: 1, language: 1 });
songSchema.index({ title: 'text', artist: 'text' });

// Virtual for getting the number of likes
songSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Method to check if a user has liked the song
songSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => like.equals(userId));
};

const Song = mongoose.model('Song', songSchema);

export default Song;
