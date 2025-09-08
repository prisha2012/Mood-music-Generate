import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  itemType: {
    type: String,
    required: [true, 'Item type is required'],
    enum: ['song', 'quote']
  },
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: function() {
      return this.itemType === 'song';
    }
  },
  quote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quote',
    required: function() {
      return this.itemType === 'quote';
    }
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound indexes
favoriteSchema.index(
  { user: 1, song: 1 },
  { unique: true, partialFilterExpression: { song: { $exists: true } } }
);
favoriteSchema.index(
  { user: 1, quote: 1 },
  { unique: true, partialFilterExpression: { quote: { $exists: true } } }
);

// Pre-save hook
favoriteSchema.pre('validate', function(next) {
  if ((this.song && this.quote) || (!this.song && !this.quote)) {
    next(new Error('Must reference either a song or a quote, not both or neither'));
  } else {
    next();
  }
});

// Static method
favoriteSchema.statics.isFavorited = async function(userId, itemType, itemId) {
  const query = { user: userId, itemType };
  if (itemType === 'song') query.song = itemId;
  else query.quote = itemId;

  const count = await this.countDocuments(query);
  return count > 0;
};

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
