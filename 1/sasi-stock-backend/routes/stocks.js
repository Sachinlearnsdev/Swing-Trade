import express from "express";
import { processStocks, getStockHistory } from "../controllers/stockController.js"; // Import the controller function

const router = express.Router();

// Route to fetch and process all stocks (GET /stocks)
router.get("/", async (req, res) => {
  try {
    const result = await processStocks(); // Process stocks based on the controller logic
    res.json(result); // Send back the processed data
  } catch (error) {
    console.error("Error processing stocks:", error);
    res.status(500).json({ error: "Failed to process stocks" });
  }
});

// Route to fetch stock data for a specific stock symbol (GET /stocks/:symbol)
router.get("/:symbol", async (req, res) => {
  const { symbol } = req.params; // Extract the symbol from the request parameters
  try {
    const stockData = await getStockHistory(symbol); // Fetch stock history for the symbol
    if (!stockData) {
      return res.status(404).json({ error: `Stock data for ${symbol} not found` });
    }
    res.json(stockData); // Send the stock data
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    res.status(404).json({ error: `Stock data for ${symbol} not found` });
  }
});

export default router;
