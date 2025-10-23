import { ema } from 'technicalindicators';
import { rsi } from 'technicalindicators'; // Import RSI indicator
import { macd } from 'technicalindicators'; // Import MACD indicator

// Helper function for calculating moving average (EMA)
export const movingAverage = (arr, period = 44) => {
  if (arr.length < period) return null;
  return ema({ period, values: arr });
};

// Enhanced trend detection using multiple indicators
export const detectTrend = (data) => {
  const closes = data.map(d => d.close);
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);

  // Calculate 44-day EMA
  const ma44 = movingAverage(closes, 44);
  const prevCloses = closes.slice(0, -5); // Previous 44-day period for comparison
  const prevMA = movingAverage(prevCloses, 44);

  // Check if the trend is upward
  const isUpTrend = ma44 && prevMA && ma44 > prevMA;
  const priceAboveMA = closes[closes.length - 1] > ma44;

  // Calculate RSI (Relative Strength Index) with a 14-day period
  const rsiValue = rsi({ period: 14, values: closes }).pop(); // Get latest RSI value

  // Calculate MACD (Moving Average Convergence Divergence)
  const macdValues = macd({ 
    values: closes,
    fastPeriod: 12, 
    slowPeriod: 26, 
    signalPeriod: 9 
  });
  const macdValue = macdValues[macdValues.length - 1].MACD; // Get latest MACD value

  // Scoring system based on trend indicators
  const trendScore = (isUpTrend ? 1 : 0) + (priceAboveMA ? 1 : 0) + (rsiValue > 50 ? 1 : 0) + (macdValue > 0 ? 1 : 0);
  const trend = trendScore >= 3 ? 'UP' : trendScore === 2 ? 'NEUTRAL' : 'DOWN';

  // Calculate Entry (last high price) and Stop Loss (min of last low and previous low)
  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const entry = last.high;
  const stopLoss = Math.min(last.low, prev.low);

  const difference = entry - stopLoss;
  const reward = 3; // Fixed reward ratio
  const targetPrice = entry + reward * difference;

  const quantity = 1000 / difference; // Example: assuming ₹1000 risk per trade

  return { ma44, trend, entry, stopLoss, targetPrice, quantity, difference };
};
