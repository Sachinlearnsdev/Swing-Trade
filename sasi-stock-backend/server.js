// src/server.js
import express from "express";
import cors from "cors";
import stockRoutes from "./routes/stocks.js"; // Import routes

const app = express();
const PORT = 5000;

// Enable CORS for cross-origin requests
app.use(cors());

// Use the stock-related routes for /api/stocks
app.use("/api/stocks", stockRoutes);

// Test route for server
app.get("/", (req, res) => {
  res.send("Server is running!");  // Basic message to check if the server is working
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
