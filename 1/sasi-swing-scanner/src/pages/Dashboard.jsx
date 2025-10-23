import { useState, useEffect } from "react";
import StockCard from "../components/StockCard"; // Display stock details
import { useStockData } from "../hooks/useStockData"; // Custom hook for managing stock data

export default function Dashboard() {
  const [trendFilter, setTrendFilter] = useState("UP"); // Default to 'UP'
  const { data, fetchStocks, loading } = useStockData(); // Use custom hook to fetch stocks

  // Fetch all stocks when the button is clicked
  const fetchAllStocks = async () => {
    await fetchStocks(); // Fetch stocks via the custom hook
  };

  // Filter stocks based on the selected trend
  const filteredStocks = data.filter((stock) => stock.trend === trendFilter);

  // Sort stocks by amount required (for ranking)
  const sortedStocks = filteredStocks.sort((a, b) => a.amountRequired - b.amountRequired);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📈 Sasi Swing Scanner</h1>

      <button
        onClick={fetchAllStocks}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Fetch All Stocks
      </button>

      <select
        value={trendFilter}
        onChange={(e) => setTrendFilter(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="UP">Uptrend</option>
        <option value="NEUTRAL">Neutral</option>
        <option value="DOWN">Downtrend</option>
      </select>

      {loading && <p>Loading...</p>}

      {sortedStocks.length === 0 ? (
        <p>No stocks found with {trendFilter} trend.</p>
      ) : (
        sortedStocks.map((stock) => (
          <StockCard key={stock.symbol} trendInfo={stock} />
        ))
      )}
    </div>
  );
}
