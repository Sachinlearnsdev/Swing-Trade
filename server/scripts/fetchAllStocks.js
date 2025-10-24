// Batch fetch script
require('dotenv').config();
const mongoose = require('mongoose');
const Stock = require('../models/Stock');
const finnhubAPI = require('../utils/finnhub');
const RateLimiter = require('../utils/rateLimiter');
const technicalIndicators = require('../utils/technicalIndicators');

const rateLimiter = new RateLimiter(process.env.API_RATE_LIMIT || 60);

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

const fetchAllStocks = async (symbols) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    console.log(`Starting to fetch ${symbols.length} stocks...`);
    console.log(`Estimated time: ${Math.ceil(symbols.length / 60)} minutes`);
    
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
          
          if ((i + 1) % 50 === 0) {
            console.log(`Progress: ${i + 1}/${symbols.length} stocks processed`);
          }
        });
      } catch (error) {
        results.failed.push({ symbol, error: error.message });
      }
    }
    
    console.log('\n=== Fetch Complete ===');
    console.log(`Successfully fetched: ${results.success.length} stocks`);
    console.log(`Failed: ${results.failed.length} stocks`);
    
    if (results.failed.length > 0) {
      console.log('\nFailed stocks:');
      results.failed.forEach(({ symbol, error }) => {
        console.log(`  - ${symbol}: ${error}`);
      });
    }
    
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    
  } catch (error) {
    console.error('Error in fetchAllStocks:', error);
    process.exit(1);
  }
};

const nseStocks = [
  // Nifty 50 (Top stocks)
  'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS',
  'HINDUNILVR.NS', 'ITC.NS', 'SBIN.NS', 'BHARTIARTL.NS', 'KOTAKBANK.NS',
  'BAJFINANCE.NS', 'LT.NS', 'ASIANPAINT.NS', 'HCLTECH.NS', 'AXISBANK.NS',
  'MARUTI.NS', 'SUNPHARMA.NS', 'TITAN.NS', 'ULTRACEMCO.NS', 'NESTLEIND.NS',
  'BAJAJFINSV.NS', 'WIPRO.NS', 'ADANIGREEN.NS', 'ONGC.NS', 'NTPC.NS',
  'TECHM.NS', 'M&M.NS', 'POWERGRID.NS', 'TATASTEEL.NS', 'JSWSTEEL.NS',
  'INDUSINDBK.NS', 'GRASIM.NS', 'DIVISLAB.NS', 'EICHERMOT.NS', 'TATAMOTORS.NS',
  'CIPLA.NS', 'DRREDDY.NS', 'BRITANNIA.NS', 'BPCL.NS', 'HINDALCO.NS',
  'COALINDIA.NS', 'HEROMOTOCO.NS', 'SHREECEM.NS', 'UPL.NS', 'BAJAJ-AUTO.NS',
  'ADANIPORTS.NS', 'TATACONSUM.NS', 'APOLLOHOSP.NS', 'SBILIFE.NS', 'HDFCLIFE.NS',
  
  // Additional Mid-cap stocks
  'PIDILITIND.NS', 'GODREJCP.NS', 'MCDOWELL-N.NS', 'BERGEPAINT.NS', 'HAVELLS.NS',
  'DABUR.NS', 'MARICO.NS', 'BOSCHLTD.NS', 'SIEMENS.NS', 'ABB.NS',
  'BANDHANBNK.NS', 'BANKBARODA.NS', 'PNB.NS', 'CANBK.NS', 'UNIONBANK.NS',
  'VEDL.NS', 'JINDALSTEL.NS', 'SAIL.NS', 'NMDC.NS', 'GAIL.NS',
  'IOC.NS', 'ONGC.NS', 'PETRONET.NS', 'TATAPOWER.NS', 'ADANIPOWER.NS',
  'TORNTPHARM.NS', 'LUPIN.NS', 'BIOCON.NS', 'AUROPHARMA.NS', 'CADILAHC.NS',
  'PAGEIND.NS', 'DMART.NS', 'TRENT.NS', 'JUBLFOOD.NS', 'PVR.NS',
  'MOTHERSON.NS', 'BALKRISIND.NS', 'MRF.NS', 'APOLLOTYRE.NS', 'CEAT.NS',
  'AMBUJACEM.NS', 'ACC.NS', 'RAMCOCEM.NS', 'JKCEMENT.NS', 'STARCEMENT.NS',
  'DLF.NS', 'GODREJPROP.NS', 'OBEROIRLTY.NS', 'PRESTIGE.NS', 'SOBHA.NS',
];
RELIANCE.NS, TCS.NS, INFY.NS, HDFCBANK.NS, ICICIBANK.NS, HINDUNILVR.NS, ITC.NS, SBIN.NS, BHARTIARTL.NS, KOTAKBANK.NS

fetchAllStocks(stockSymbols);