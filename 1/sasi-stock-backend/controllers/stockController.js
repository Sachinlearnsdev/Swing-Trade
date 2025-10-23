import axios from 'axios';
import { detectTrend } from '../utils/trendDetection.js';

// Function to fetch stock data for a given symbol
export const getStockHistory = async (symbol) => {
    try {
        const res = await axios.get(`${API_URL}/api/stocks/${symbol}`);
        
        console.log("API Response:", res.data); // Log the entire response for debugging

        // Extracting the necessary data from the response
        const { chart } = res.data;
        
        // Check if chart and result exist and handle errors gracefully
        if (!chart || !chart.result || chart.result.length === 0) {
            console.error("No valid data found for symbol:", symbol);
            return [];
        }

        // Assuming result is now an array, process the first item
        const { timestamp, indicators } = chart.result[0];
        const prices = indicators?.quote[0]; // Access stock prices

        // Ensure timestamp and prices exist
        if (!timestamp || !prices) {
            console.error("Missing timestamp or price data:", res.data);
            return [];
        }

        // Map the data into a usable format
        const history = timestamp.map((t, i) => ({
            date: new Date(t * 1000).toISOString().split("T")[0], // Format the date
            open: prices.open[i],
            high: prices.high[i],
            low: prices.low[i],
            close: prices.close[i],
        }));

        return history; // Return the mapped data
    } catch (error) {
        console.error("Error fetching stock data:", error);
        return []; // Return empty array if an error occurs
    }
};

// Helper function to fetch and process stocks (example static list of stock symbols)
export const processStocks = async () => {
  const stockSymbols = await getAllStockSymbols(); // Example static stock symbols
  const results = [];

  // Loop through each stock symbol and process
  for (const symbol of stockSymbols) {
    try {
      const data = await getStockHistory(symbol); // Get stock history
      if (data.length === 0) {
        console.error(`No data found for symbol: ${symbol}`);
        continue; // Skip to the next symbol if no data
      }

      // Analyze the trend and get the calculated fields
      const trendInfo = detectTrend(data);

      if (trendInfo) {
        results.push({
          symbol,
          trend: trendInfo.trend,
          entry: trendInfo.entry,
          stopLoss: trendInfo.stopLoss,
          targetPrice: trendInfo.targetPrice,
          ma44: trendInfo.ma44,
          quantity: trendInfo.quantity,
          amountRequired: trendInfo.entry * trendInfo.quantity,
          difference: trendInfo.difference,
        });
      }
    } catch (error) {
      console.error(`Error processing stock ${symbol}:`, error);
    }
  }

  return results; // Return the processed data
};

// Example of static stock symbols (replace this with dynamic data source)
const getAllStockSymbols = async () => {
  return ["RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFC.NS", "BAJAJ-AUTO.NS"];
};
