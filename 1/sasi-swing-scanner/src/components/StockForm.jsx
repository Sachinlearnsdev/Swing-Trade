import { useState } from "react";

export default function StockForm({ onSearch }) {
  const [symbol, setSymbol] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol.trim()) onSearch(symbol.trim().toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Enter stock symbol (e.g. RELIANCE.NS)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Fetch
      </button>
    </form>
  );
}
