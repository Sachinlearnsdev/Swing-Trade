// src/hooks/useStockData.js
import { useState } from "react";
import { getStockHistory } from "../api/stockService"; // Assuming your getStockHistory function is here

export function useStockData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch all stocks
  const fetchStocks = async () => {
    setLoading(true);
    try {
      const stockSymbols = ["RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFC.NS", "BAJAJ-AUTO.NS"]; // Example stock list
      let allStocks = [];
      
      // Loop over stock symbols to fetch data for each
      for (let symbol of stockSymbols) {
        const stockData = await getStockHistory(symbol); // Fetch data for each stock
        allStocks = [...allStocks, ...stockData]; // Aggregate results
      }
      
      setData(allStocks); // Set the fetched data
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching is done
    }
  };

  return { data, fetchStocks, loading };
}
