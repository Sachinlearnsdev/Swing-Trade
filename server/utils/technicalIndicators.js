const { EMA, RSI, MACD } = require('technicalindicators');

class TechnicalIndicators {
  calculateEMA(prices, period) {
    if (prices.length < period) return null;
    
    const emaValues = EMA.calculate({
      period: period,
      values: prices,
    });
    
    return emaValues.length > 0 ? emaValues[emaValues.length - 1] : null;
  }

  calculateRSI(prices, period = 14) {
    if (prices.length < period) return null;
    
    const rsiValues = RSI.calculate({
      period: period,
      values: prices,
    });
    
    return rsiValues.length > 0 ? rsiValues[rsiValues.length - 1] : null;
  }

  calculateMACD(prices) {
    if (prices.length < 26) return null;
    
    const macdValues = MACD.calculate({
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      values: prices,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    });
    
    return macdValues.length > 0 ? macdValues[macdValues.length - 1] : null;
  }

  determineTrend(ema20, ema50, currentPrice) {
    if (!ema20 || !ema50) return 'Neutral';
    
    if (currentPrice > ema20 && ema20 > ema50) {
      return 'Uptrend';
    } else if (currentPrice < ema20 && ema20 < ema50) {
      return 'Downtrend';
    }
    
    return 'Neutral';
  }

  calculateRiskToReward(entryPrice, stopLoss, targetPrice) {
    if (!entryPrice || !stopLoss || !targetPrice) return null;
    
    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(targetPrice - entryPrice);
    
    if (risk === 0) return null;
    
    return (reward / risk).toFixed(2);
  }

  calculateSuccessProbability(rsi, trend, riskToReward) {
    let probability = 50;
    
    if (trend === 'Uptrend') probability += 15;
    else if (trend === 'Downtrend') probability -= 15;
    
    if (rsi) {
      if (rsi < 30) probability += 10;
      else if (rsi > 70) probability -= 10;
      else if (rsi >= 40 && rsi <= 60) probability += 5;
    }
    
    if (riskToReward) {
      if (riskToReward >= 3) probability += 10;
      else if (riskToReward >= 2) probability += 5;
      else if (riskToReward < 1) probability -= 10;
    }
    
    return Math.min(Math.max(probability, 0), 100);
  }
}

module.exports = new TechnicalIndicators();