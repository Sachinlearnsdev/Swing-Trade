export default function StockCard({ trendInfo }) {
  if (!trendInfo) return null;

  const { trend, entry, stopLoss, targetPrice, ma44, quantity, amountRequired, difference } = trendInfo;
  const color =
    trend === "UP" ? "text-green-600" : trend === "DOWN" ? "text-red-600" : "text-yellow-600";

  return (
    <div className="bg-white shadow p-4 rounded mb-4">
      <h2 className={`text-xl font-bold ${color}`}>Trend: {trend}</h2>
      <p>Entry: ₹{entry?.toFixed(2)}</p>
      <p>Stop Loss: ₹{stopLoss?.toFixed(2)}</p>
      <p>Target Price: ₹{targetPrice?.toFixed(2)}</p>
      <p>44-Day EMA: ₹{ma44?.toFixed(2)}</p>
      <p>Quantity: {quantity}</p>
      <p>Amount Required: ₹{amountRequired?.toFixed(2)}</p>
      <p>Risk Difference: ₹{difference?.toFixed(2)}</p>
    </div>
  );
}
