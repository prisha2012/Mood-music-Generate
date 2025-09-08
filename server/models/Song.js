import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  artist: {
    type: String,
    default: 'Unknown Artist',
    trim: true,
    maxlength: [100, 'Artist name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  
  // YouTube Information
  youtubeId: {
    type: String,
    required: [true, 'YouTube ID is required'],
    unique: true,
    trim: true,
    match: [/^[a-zA-Z0-9_-]{11}$/, 'Please provide a valid YouTube video ID']
  },
  thumbnail: {
    type: String,
    trim: true,
    default: function() {
      return this.youtubeId ? `https://img.youtube.com/vi/${this.youtubeId}/maxresdefault.jpg` : '';
    }
  },
  duration: {
    type: String,
    default: 'PT0S', // ISO 8601 duration format
    trim: true
  },
  viewCount: {
    type: Number,
    default: 0,
    min: [0, 'View count cannot be negative']
  },
  likeCount: {
    type: Number,
    default: 0,
    min: [0, 'Like count cannot be negative']
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  
  // Categorization
  mood: {
    type: String,
    required: [true, 'Mood is required'],
    enum: {
      values: ['happy', 'sad', 'energetic', 'calm', 'romantic', 'motivated'],
      message: 'Invalid mood specified'
    },
    lowercase: true,
    trim: true
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: {
      values: ['hindi', 'english', 'punjabi'],
      message: 'Invalid language specified'
    },
    lowercase: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Ownership & Moderation
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  isApproved: {
    type: Boolean,
    default: true,
    index: true
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Statistics
  playCount: {
    type: Number,
    default: 0,
    min: [0, 'Play count cannot be negative']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  }],
  
  // Additional metadata
  isExplicit: {
    type: Boolean,
    default: false
  },
  isSample: {
    type: Boolean,
    default: false
  },
  source: {
    type: String,
    enum: ['youtube', 'spotify', 'soundcloud', 'other'],
    default: 'youtube'
  },
  externalIds: {
    type: Map,
    of: String,
    default: {}
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  // Schema options
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  minimize: false
});

// Indexes for better query performance
songSchema.index({ title: 'text', artist: 'text', description: 'text' });
songSchema.index({ mood: 1, language: 1, isApproved: 1 });
songSchema.index({ 'addedBy': 1, 'createdAt': -1 });

// Virtual for duration in seconds
songSchema.virtual('durationInSeconds').get(function() {
  if (!this.duration) return 0;
  
  // Simple ISO 8601 duration parsing (PT#M#S format)
  const match = this.duration.match(/PT(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  return (hours * 3600) + (minutes * 60) + seconds;
});

// Virtual for formatted duration (MM:SS)
songSchema.virtual('formattedDuration').get(function() {
  const totalSeconds = this.durationInSeconds;
  if (!totalSeconds) return '0:00';
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Method to increment play count
songSchema.methods.incrementPlayCount = async function() {
  this.playCount += 1;
  this.lastUpdated = new Date();
  return this.save();
};

// Method to toggle like for a user
songSchema.methods.toggleLike = async function(userId) {
  const index = this.likes.indexOf(userId);
  
  if (index === -1) {
    // Add like
    this.likes.push(userId);
    this.likeCount += 1;
  } else {
    // Remove like
    this.likes.splice(index, 1);
    this.likeCount = Math.max(0, this.likeCount - 1);
  }
  
  this.lastUpdated = new Date();
  await this.save();
  
  return {
    isLiked: index === -1, // true if like was added, false if removed
    likeCount: this.likeCount
  };
};

// Static method to get popular songs
songSchema.statics.getPopularSongs = function(limit = 10) {
  return this.find({ isApproved: true })
    .sort({ likeCount: -1, playCount: -1 })
    .limit(limit)
    .lean();
};

// Pre-save hook to update lastUpdated
songSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  
  // Ensure viewCount and likeCount are not negative
  this.viewCount = Math.max(0, this.viewCount || 0);
  this.likeCount = Math.max(0, this.likeCount || 0);
  this.playCount = Math.max(0, this.playCount || 0);
  
  next();
});

// Query helper to filter by mood and language
songSchema.query.byMoodAndLanguage = function(mood, language) {
  return this.find({
    mood: { $regex: new RegExp(`^${mood}$`, 'i') },
    language: { $regex: new RegExp(`^${language}$`, 'i') },
    isApproved: true
  });
};

// Query helper to get only approved songs
songSchema.query.approved = function(approved = true) {
  return this.where({ isApproved: approved });
};
// Method to check if a user has liked the song
songSchema.methods.isLikedBy = function(userId) {
  if (!userId) return false;
  return this.likes.some(like => like && like.toString() === userId.toString());
};

// Create and export the model
const Song = mongoose.model('Song', songSchema);

export default Song;
