const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  stocks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
  }],
  stockSymbols: [{
    type: String,
    uppercase: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastRefetched: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Index for faster queries
watchlistSchema.index({ name: 1 });

module.exports = mongoose.model('Watchlist', watchlistSchema);