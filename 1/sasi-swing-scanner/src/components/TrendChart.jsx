import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function TrendChart({ data }) {
  if (!data || data.length === 0) return null;

  const maData = data.map((d, i) => ({
    ...d,
    ma44:
      i >= 44
        ? data.slice(i - 44, i).reduce((a, b) => a + b.close, 0) / 44
        : null,
  }));

  return (
    <div className="bg-white p-4 rounded shadow">
      <LineChart width={700} height={300} data={maData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" hide />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="close" stroke="#2563eb" dot={false} />
        <Line type="monotone" dataKey="ma44" stroke="#16a34a" dot={false} />
      </LineChart>
    </div>
  );
}
