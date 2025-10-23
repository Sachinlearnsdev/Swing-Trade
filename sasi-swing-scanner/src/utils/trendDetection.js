import { ema } from 'technicalindicators'; // Import EMA from technicalindicators

// Function to calculate 44-day EMA
export const movingAverage = (arr, period = 44) => {
  if (arr.length < period) return null;
  return ema({ period, values: arr }); // Use EMA from the library
};

export const detectTrend = (data) => {
  const closes = data.map((d) => d.close); // Get closing prices

  // Calculate the 44-day EMA for current data and previous data
  const ma44 = movingAverage(closes, 44);
  const prevCloses = closes.slice(0, -5); // Slice the last 5 days to calculate the previous EMA
  const prevMA = movingAverage(prevCloses, 44);

  // Determine if the trend is UP, NEUTRAL, or DOWN based on EMA values
  const isUpTrend = ma44 && prevMA && ma44 > prevMA;
  const priceAboveMA = closes[closes.length - 1] > ma44;

  // Score to decide trend
  const score = (isUpTrend ? 1 : 0) + (priceAboveMA ? 1 : 0);
  const trend =
    score >= 2 ? "UP" : score === 1 ? "NEUTRAL" : "DOWN";

  // Calculate entry (last high price) and stop loss (min of last low and previous low)
  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const entry = last.high;
  const stopLoss = Math.min(last.low, prev.low);

  return { ma44, trend, entry, stopLoss };
};
