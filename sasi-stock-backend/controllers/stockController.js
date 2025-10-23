// src/controllers/stockController.js
import axios from "axios";
import { ema } from "technicalindicators"; // Import ema from technicalindicators
import { detectTrend } from "../utils/trendDetection.js"; // Import detectTrend from trendDetection.js

// Function to fetch stock data for a given symbol (using Yahoo Finance API as an example)
export const getStockHistory = async (symbol) => {
  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=3mo&interval=1d`
    );
    return response.data.chart.result[0]; // Return the stock data for the symbol
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    return null; // Return null if data is not found or error occurs
  }
};

// Function to fetch and process stocks (example static list of stock symbols)
export const processStocks = async () => {
  const stockSymbols = await getAllStockSymbols(); // Example static stock symbols
  const results = [];

  for (const symbol of stockSymbols) {
    try {
      const data = await fetchStockData(symbol);
      const timestamps = data.timestamp;
      const prices = data.indicators.quote[0];

      // Map data to usable format
      const history = timestamps.map((t, i) => ({
        date: new Date(t * 1000).toISOString().split("T")[0], // Format the date
        open: prices.open[i],
        high: prices.high[i],
        low: prices.low[i],
        close: prices.close[i],
      }));

      // Calculate the 44-day EMA for the closing prices
      const closePrices = history.map((item) => item.close);
      const emaValues = ema({ period: 44, values: closePrices });

      // Add EMA values to the historical data
      const historyWithEMA = history.map((item, index) => ({
        ...item,
        ema: emaValues[index] || null, // EMA might not be available for the first few days
      }));

      // Analyze the trend based on the processed data
      const trendInfo = detectTrend(historyWithEMA);

      if (trendInfo.trend === "UP") {
        results.push({
          symbol,
          trend: trendInfo.trend,
          entry: trendInfo.entry,
          stopLoss: trendInfo.stopLoss,
          targetPrice: trendInfo.targetPrice,
          ma44: trendInfo.ma44,
        });
      }
    } catch (error) {
      console.error(`Error processing stock ${symbol}:`, error);
    }
  }

  return results;
};

// Helper function to fetch stock data for a given symbol
const fetchStockData = async (symbol) => {
  const response = await axios.get(
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=3mo&interval=1d`
  );
  return response.data.chart.result[0];
};

// Example of static stock symbols (replace this with dynamic data source)
const getAllStockSymbols = async () => {
  return ["RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFC.NS", "BAJAJ-AUTO.NS"];
};


