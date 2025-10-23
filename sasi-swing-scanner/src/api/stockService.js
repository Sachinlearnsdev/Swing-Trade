// src/api/stockService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Use the backend base URL from .env file

// Fetch stock history for a given symbol
export const getStockHistory = async (symbol) => {
  try {
    // Make the request to the correct endpoint
    const res = await axios.get(`${API_URL}/api/stocks/${symbol}`);
    
    // Log the response to inspect its structure
    console.log("API Response:", res.data);  // Log the response

    // Ensure the response is in the expected structure before using map
    if (Array.isArray(res.data)) {
      const history = res.data.map((item) => ({
        date: item.date,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        ema: item.ema, // EMA value included from the backend
      }));
      return history;
    } else {
      console.error("Response data is not an array", res.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return [];
  }
};
