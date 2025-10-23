const Stock = require('../models/Stock');
const finnhubAPI = require('../utils/finnhub');
const RateLimiter = require('../utils/rateLimiter');
const technicalIndicators = require('../utils/technicalIndicators');

const rateLimiter = new RateLimiter(process.env.API_RATE_LIMIT || 60);

const getStocks = async (req, res) => {
  try {
    const { trend, minRiskReward, maxRiskReward, minPrice, maxPrice } = req.query;
    
    let filter = { isActive: true };
    
    if (trend) filter.trend = trend;
    if (minRiskReward) filter.riskToReward = { $gte: parseFloat(minRiskReward) };
    if (maxRiskReward) {
      filter.riskToReward = {
        ...filter.riskToReward,
        $lte: parseFloat(maxRiskReward),
      };
    }
    if (minPrice) filter.currentPrice = { $gte: parseFloat(minPrice) };
    if (maxPrice) {
      filter.currentPrice = {
        ...filter.currentPrice,
        $lte: parseFloat(maxPrice),
      };
    }
    
    const stocks = await Stock.find(filter).sort({ lastFetched: -1 });
    
    res.json({
      success: true,
      count: stocks.length,
      data: stocks,
    });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stocks',
    });
  }
};

const fetchStockData = async (symbol) => {
  try {
    const quote = await finnhubAPI.getQuote(symbol);
    
    if (!quote || !quote.c) {
      throw new Error(`No data available for ${symbol}`);
    }
    
    const profile = await finnhubAPI.getCompanyProfile(symbol);
    
    const toTimestamp = Math.floor(Date.now() / 1000);
    const fromTimestamp = toTimestamp - (60 * 24 * 60 * 60);
    
    let candles;
    try {
      candles = await finnhubAPI.getCandles(symbol, 'D', fromTimestamp, toTimestamp);
    } catch (error) {
      console.log(`Could not fetch candles for ${symbol}, using quote data only`);
      candles = null;
    }
    
    let ema20 = null, ema50 = null, rsi = null, macd = null;
    
    if (candles && candles.c && candles.c.length >= 50) {
      const closes = candles.c;
      ema20 = technicalIndicators.calculateEMA(closes, 20);
      ema50 = technicalIndicators.calculateEMA(closes, 50);
      rsi = technicalIndicators.calculateRSI(closes, 14);
      macd = technicalIndicators.calculateMACD(closes);
    }
    
    const currentPrice = quote.c;
    const entryPrice = currentPrice;
    const stopLoss = currentPrice * 0.95;
    const targetPrice = currentPrice * 1.10;
    
    const trend = technicalIndicators.determineTrend(ema20, ema50, currentPrice);
    const riskToReward = technicalIndicators.calculateRiskToReward(entryPrice, stopLoss, targetPrice);
    const successProbability = technicalIndicators.calculateSuccessProbability(rsi, trend, riskToReward);
    
    return {
      symbol: symbol.toUpperCase(),
      companyName: profile?.name || '',
      currentPrice,
      entryPrice,
      stopLoss,
      targetPrice,
      successProbability,
      riskToReward: parseFloat(riskToReward),
      trend,
      ema20,
      ema50,
      rsi,
      macd,
      volume: quote.v,
      marketCap: profile?.marketCapitalization || 0,
      lastFetched: new Date(),
      isActive: true,
    };
  } catch (error) {
    console.error(`Error processing ${symbol}:`, error.message);
    throw error;
  }
};

const refetchStock = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const stockData = await fetchStockData(symbol.toUpperCase());
    
    const stock = await Stock.findOneAndUpdate(
      { symbol: symbol.toUpperCase() },
      stockData,
      { new: true, upsert: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: stock,
    });
  } catch (error) {
    console.error('Error refetching stock:', error);
    res.status(500).json({
      success: false,
      error: `Failed to refetch stock: ${error.message}`,
    });
  }
};

const fetchMultipleStocks = async (req, res) => {
  try {
    const { symbols } = req.body;
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of stock symbols',
      });
    }
    
    console.log(`Starting to fetch ${symbols.length} stocks...`);
    
    const results = {
      success: [],
      failed: [],
    };
    
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i].toUpperCase();
      
      try {
        await rateLimiter.execute(async () => {
          const stockData = await fetchStockData(symbol);
          
          await Stock.findOneAndUpdate(
            { symbol },
            stockData,
            { new: true, upsert: true, runValidators: true }
          );
          
          results.success.push(symbol);
          console.log(`[${i + 1}/${symbols.length}] Successfully fetched ${symbol}`);
        });
      } catch (error) {
        results.failed.push({ symbol, error: error.message });
        console.log(`[${i + 1}/${symbols.length}] Failed to fetch ${symbol}: ${error.message}`);
      }
    }
    
    res.json({
      success: true,
      message: `Fetched ${results.success.length} out of ${symbols.length} stocks`,
      results,
    });
  } catch (error) {
    console.error('Error fetching multiple stocks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stocks',
    });
  }
};

const deleteStock = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    await Stock.findOneAndDelete({ symbol: symbol.toUpperCase() });
    
    res.json({
      success: true,
      message: `Stock ${symbol} deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete stock',
    });
  }
};

module.exports = {
  getStocks,
  refetchStock,
  fetchMultipleStocks,
  deleteStock,
};