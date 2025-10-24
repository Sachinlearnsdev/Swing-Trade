const Watchlist = require('../models/Watchlist');
const Stock = require('../models/Stock');
const yahooFinanceAPI = require('../utils/yahooFinance');
const RateLimiter = require('../utils/rateLimiter');
const technicalIndicators = require('../utils/technicalIndicators');

const rateLimiter = new RateLimiter(process.env.API_RATE_LIMIT || 60);

const createWatchlist = async (req, res) => {
  try {
    const { name, description, stockSymbols } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Watchlist name is required',
      });
    }
    
    const stocks = await Stock.find({
      symbol: { $in: stockSymbols.map(s => s.toUpperCase()) },
    });
    
    const watchlist = await Watchlist.create({
      name,
      description: description || '',
      stocks: stocks.map(s => s._id),
      stockSymbols: stockSymbols.map(s => s.toUpperCase()),
    });
    
    res.status(201).json({
      success: true,
      data: watchlist,
    });
  } catch (error) {
    console.error('Error creating watchlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create watchlist',
    });
  }
};

const getWatchlists = async (req, res) => {
  try {
    const watchlists = await Watchlist.find({ isActive: true })
      .populate('stocks')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: watchlists.length,
      data: watchlists,
    });
  } catch (error) {
    console.error('Error fetching watchlists:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch watchlists',
    });
  }
};

const getWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    
    const watchlist = await Watchlist.findById(id).populate('stocks');
    
    if (!watchlist) {
      return res.status(404).json({
        success: false,
        error: 'Watchlist not found',
      });
    }
    
    res.json({
      success: true,
      data: watchlist,
    });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch watchlist',
    });
  }
};

const updateWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, stockSymbols } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    
    if (stockSymbols) {
      const stocks = await Stock.find({
        symbol: { $in: stockSymbols.map(s => s.toUpperCase()) },
      });
      updateData.stocks = stocks.map(s => s._id);
      updateData.stockSymbols = stockSymbols.map(s => s.toUpperCase());
    }
    
    const watchlist = await Watchlist.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('stocks');
    
    if (!watchlist) {
      return res.status(404).json({
        success: false,
        error: 'Watchlist not found',
      });
    }
    
    res.json({
      success: true,
      data: watchlist,
    });
  } catch (error) {
    console.error('Error updating watchlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update watchlist',
    });
  }
};

const refetchWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    
    const watchlist = await Watchlist.findById(id);
    
    if (!watchlist) {
      return res.status(404).json({
        success: false,
        error: 'Watchlist not found',
      });
    }
    
    console.log(`Starting to refetch ${watchlist.stockSymbols.length} stocks in watchlist "${watchlist.name}"...`);
    
    const results = {
      success: [],
      failed: [],
    };
    
    // Function to fetch stock data
    const fetchStockData = async (symbol) => {
      try {
        const quote = await yahooFinanceAPI.getQuote(symbol);
        
        if (!quote || !quote.c) {
          throw new Error(`No data available for ${symbol}`);
        }
        
        const profile = await yahooFinanceAPI.getCompanyProfile(symbol);
        
        const toTimestamp = Math.floor(Date.now() / 1000);
        const fromTimestamp = toTimestamp - (60 * 24 * 60 * 60);
        
        let candles;
        try {
          candles = await yahooFinanceAPI.getCandles(symbol, 'D', fromTimestamp, toTimestamp);
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
          marketCapitalization: profile?.marketCapitalization || 0,
          lastFetched: new Date(),
          isActive: true,
        };
      } catch (error) {
        console.error(`Error processing ${symbol}:`, error.message);
        throw error;
      }
    };
    
    for (let i = 0; i < watchlist.stockSymbols.length; i++) {
      const symbol = watchlist.stockSymbols[i];
      
      try {
        await rateLimiter.execute(async () => {
          const stockData = await fetchStockData(symbol);
          
          await Stock.findOneAndUpdate(
            { symbol },
            stockData,
            { new: true, upsert: true, runValidators: true }
          );
          
          results.success.push(symbol);
          console.log(`[${i + 1}/${watchlist.stockSymbols.length}] Successfully refetched ${symbol}`);
        });
      } catch (error) {
        results.failed.push({ symbol, error: error.message });
        console.log(`[${i + 1}/${watchlist.stockSymbols.length}] Failed to refetch ${symbol}: ${error.message}`);
      }
    }
    
    watchlist.lastRefetched = new Date();
    await watchlist.save();
    
    res.json({
      success: true,
      message: `Refetched ${results.success.length} out of ${watchlist.stockSymbols.length} stocks`,
      results,
    });
  } catch (error) {
    console.error('Error refetching watchlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refetch watchlist',
    });
  }
};

const deleteWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    
    const watchlist = await Watchlist.findByIdAndDelete(id);
    
    if (!watchlist) {
      return res.status(404).json({
        success: false,
        error: 'Watchlist not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Watchlist deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting watchlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete watchlist',
    });
  }
};

module.exports = {
  createWatchlist,
  getWatchlists,
  getWatchlist,
  updateWatchlist,
  refetchWatchlist,
  deleteWatchlist,
};