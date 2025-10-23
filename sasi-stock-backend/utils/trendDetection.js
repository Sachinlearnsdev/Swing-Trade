// src/utils/trendDetection.js

// Function to calculate the simple moving average
export const movingAverage = (arr, period = 44) => {
  if (arr.length < period) {
    console.warn(`Not enough data to calculate moving average. Required: ${period}, Found: ${arr.length}`);
    return null;
  }
  return arr.slice(-period).reduce((a, b) => a + b, 0) / period;
};

// Function to detect the trend (up, down, or neutral)
export const detectTrend = (data) => {
  const closes = data.map((d) => d.close);

  // Ensure enough data points are available
  if (closes.length < 44) {
    console.warn("Not enough data points to detect trend. Data length: ", closes.length);
    return { trend: "NEUTRAL", entry: null, stopLoss: null, targetPrice: null, ma44: null };
  }

  // Calculate moving averages
  const ma44 = movingAverage(closes, 44); // Calculate the 44-day moving average
  const prevMA = movingAverage(closes.slice(0, -5), 44); // Calculate previous 44-day MA (excluding the last 5 days)

  // Log the moving averages for debugging
  console.log("Current MA44:", ma44);
  console.log("Previous MA44:", prevMA);

  if (!ma44 || !prevMA) {
    console.error("Error: Moving averages could not be calculated.");
    return { trend: "NEUTRAL", entry: null, stopLoss: null, targetPrice: null, ma44: null };
  }

  // Check if the trend is upward
  const isUpTrend = ma44 > prevMA; // Current MA should be greater than the previous
  const priceAboveMA = closes[closes.length - 1] > ma44; // Current closing price should be above the moving average

  // Log the trend conditions for debugging
  console.log("isUpTrend:", isUpTrend);
  console.log("priceAboveMA:", priceAboveMA);

  // Calculate score and trend
  const score = (isUpTrend ? 1 : 0) + (priceAboveMA ? 1 : 0);
  const trend = score >= 2 ? "UP" : score === 1 ? "NEUTRAL" : "DOWN";

  // Log the trend result
  console.log("Detected Trend:", trend);

  // Calculate entry, stop loss, and target price for 'UP' trend
  const last = data[data.length - 1]; // Last data point
  const prev = data[data.length - 2]; // Previous data point

  const entry = last.high; // Entry price is the high of the last day
  const stopLoss = Math.min(last.low, prev.low); // Stop loss is the lower value of the last two lows
  const difference = Math.abs(entry - stopLoss); // Difference between entry and stop loss

  const reward = 3; // Reward ratio (this could be dynamic)
  const targetPrice = entry + reward * difference; // Target price based on the difference

  return { ma44, trend, entry, stopLoss, targetPrice, difference };
};
