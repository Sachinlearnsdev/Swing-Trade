const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  companyName: {
    type: String,
    default: '',
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  entryPrice: {
    type: Number,
  },
  stopLoss: {
    type: Number,
  },
  targetPrice: {
    type: Number,
  },
  successProbability: {
    type: Number,
    min: 0,
    max: 100,
  },
  riskToReward: {
    type: Number,
  },
  trend: {
    type: String,
    enum: ['Uptrend', 'Downtrend', 'Neutral'],
    default: 'Neutral',
  },
  ema20: Number,
  ema50: Number,
  rsi: Number,
  macd: {
    macd: Number,
    signal: Number,
    histogram: Number,
  },
  volume: Number,
  marketCap: Number,
  lastFetched: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
stockSchema.index({ symbol: 1 });
stockSchema.index({ trend: 1 });
stockSchema.index({ lastFetched: -1 });

module.exports = mongoose.model('Stock', stockSchema);