import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Quote content is required'],
    trim: true,
    maxlength: [500, 'Quote cannot be longer than 500 characters']
  },
  author: {
    type: String,
    default: 'Unknown',
    trim: true
  },
  mood: {
    type: String,
    required: [true, 'Mood is required'],
    enum: ['happy', 'sad', 'energetic', 'calm', 'romantic', 'motivated']
  },
  tags: [{
    type: String,
    trim: true
  }],
  source: {
    type: String,
    enum: ['quotable', 'user', 'admin'],
    default: 'user'
  },
  externalId: {
    type: String,
    index: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster querying
quoteSchema.index({ mood: 1 });
quoteSchema.index({ content: 'text', author: 'text' });

// Virtual for getting the number of likes
quoteSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Method to check if a user has liked the quote
quoteSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => like.equals(userId));
};

const Quote = mongoose.model('Quote', quoteSchema);

export default Quote;
