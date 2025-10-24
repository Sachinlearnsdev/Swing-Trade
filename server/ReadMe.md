# Stock Trading App - Backend

A comprehensive backend for swing trading app with Finnhub API integration, MongoDB storage, and technical indicators calculation.

## Features

- 🔄 Fetch stock data from Finnhub API
- 📊 Calculate technical indicators (EMA, RSI, MACD)
- 📈 Determine trend and success probability
- 🎯 Risk-to-reward ratio calculation
- 📋 Watchlist management
- 🔍 Advanced filtering
- ⏱️ Rate-limited API calls (60/minute)
- 🗄️ MongoDB storage with indexing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Finnhub API Key (free tier: https://finnhub.io)

## Installation

1. **Install dependencies:**
```bash
cd server
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

3. **Configure environment variables:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stock-trading-app
FINNHUB_API_KEY=your_api_key_here
API_RATE_LIMIT=60
```

4. **Start MongoDB:**
```bash
# If using local MongoDB
mongod
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Fetch All Stocks (Initial Setup)
```bash
npm run fetch-all
```

**Note:** For 2700 stocks, this will take approximately 45 minutes.

## API Endpoints

### Stocks

#### Get All Stocks (with filters)
```
GET /api/stocks
Query params: trend, minRiskReward, maxRiskReward, minPrice, maxPrice
```

#### Refetch Single Stock
```
GET /api/stocks/refetch/:symbol
Example: GET /api/stocks/refetch/AAPL
```

#### Fetch Multiple Stocks
```
POST /api/stocks/fetch-multiple
Body: { "symbols": ["AAPL", "MSFT", "GOOGL"] }
```

#### Delete Stock
```
DELETE /api/stocks/:symbol
```

### Watchlists

#### Create Watchlist
```
POST /api/watchlists
Body: {
  "name": "Tech Stocks",
  "description": "My favorite tech stocks",
  "stockSymbols": ["AAPL", "MSFT", "GOOGL"]
}
```

#### Get All Watchlists
```
GET /api/watchlists
```

#### Get Single Watchlist
```
GET /api/watchlists/:id
```

#### Update Watchlist
```
PUT /api/watchlists/:id
Body: { "name": "Updated Name", "stockSymbols": [...] }
```

#### Refetch Watchlist
```
GET /api/watchlists/:id/refetch
```

#### Delete Watchlist
```
DELETE /api/watchlists/:id
```

## Data Models

### Stock Schema
```javascript
{
  symbol: String,
  companyName: String,
  currentPrice: Number,
  entryPrice: Number,
  stopLoss: Number,
  targetPrice: Number,
  successProbability: Number,
  riskToReward: Number,
  trend: String, // 'Uptrend', 'Downtrend', 'Neutral'
  ema20: Number,
  ema50: Number,
  rsi: Number,
  macd: Object,
  volume: Number,
  marketCap: Number,
  lastFetched: Date
}
```

### Watchlist Schema
```javascript
{
  name: String,
  description: String,
  stocks: [ObjectId],
  stockSymbols: [String],
  lastRefetched: Date
}
```

## Technical Indicators

The app calculates the following indicators:

- **EMA (20 & 50)**: Exponential Moving Average
- **RSI (14)**: Relative Strength Index
- **MACD**: Moving Average Convergence Divergence
- **Trend**: Based on EMA crossovers
- **Risk-to-Reward Ratio**: (Target - Entry) / (Entry - Stop Loss)
- **Success Probability**: Calculated from RSI, trend, and R:R ratio

## Rate Limiting

Finnhub free tier allows 60 API calls per minute. The backend automatically handles rate limiting:

- Delays between requests: ~1 second
- Batch processing for large stock lists
- Progress logging every 50 stocks

## Scheduled Tasks

The app includes a cron job setup for automatic weekly data refresh:

```javascript
// Runs every Sunday at 2 AM
cron.schedule('0 2 * * 0', async () => {
  // Fetch all stocks logic here
});
```

## Error Handling

All endpoints include comprehensive error handling:
- API failures are logged and returned with error messages
- Database errors are caught and handled gracefully
- Rate limit failures retry automatically

## Testing Endpoints

Use tools like Postman or cURL:

```bash
# Get all stocks
curl http://localhost:5000/api/stocks

# Refetch a stock
curl http://localhost:5000/api/stocks/refetch/AAPL

# Create watchlist
curl -X POST http://localhost:5000/api/watchlists \
  -H "Content-Type: application/json" \
  -d '{"name":"My Watchlist","stockSymbols":["AAPL","MSFT"]}'
```

## Project Structure

```
/server/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── stockController.js    # Stock CRUD operations
│   └── watchlistController.js # Watchlist operations
├── models/
│   ├── Stock.js              # Stock schema
│   └── Watchlist.js          # Watchlist schema
├── routes/
│   ├── stockRoutes.js        # Stock API routes
│   └── watchlistRoutes.js    # Watchlist API routes
├── utils/
│   ├── finnhub.js            # Finnhub API wrapper
│   ├── rateLimiter.js        # Rate limiting utility
│   └── technicalIndicators.js # Indicator calculations
├── scripts/
│   └── fetchAllStocks.js     # Batch fetch script
├── server.js                 # Express server
├── package.json
└── .env
```

## Performance Tips

1. **For 2700 stocks:**
   - Run initial fetch during off-hours
   - Use the scheduled cron job for daily updates
   - Monitor API rate limits

2. **Database optimization:**
   - Indexes are created automatically on symbol, trend, lastFetched
   - Use filters to reduce payload size

3. **API optimization:**
   - Cache results in MongoDB
   - Only refetch when necessary

## Troubleshooting

**Issue: API rate limit exceeded**
- Solution: Reduce API_RATE_LIMIT in .env (try 50 instead of 60)

**Issue: MongoDB connection failed**
- Solution: Ensure MongoDB is running and URI is correct

**Issue: Finnhub API returns no data**
- Solution: Check if symbol is valid and API key is correct

## Next Steps

1. Set up the frontend (React app)
2. Implement CSV export functionality
3. Add user authentication (optional)
4. Deploy to production

## License

MIT




# 1. Navigate to server folder
cd server

# 2. Install dependencies
npm install

# 3. Create .env file and add your Finnhub API key
cp .env.example .env

# 4. Start MongoDB
mongod

# 5. Run development server
npm run dev

# 6. Fetch initial stock data (for 2700 stocks - takes ~45 mins)
npm run fetch-all