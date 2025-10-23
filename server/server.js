require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cron = require('node-cron');

const stockRoutes = require('./routes/stockRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/stocks', stockRoutes);
app.use('/api/watchlists', watchlistRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Stock Trading App API',
    version: '1.0.0',
    endpoints: {
      stocks: '/api/stocks',
      watchlists: '/api/watchlists',
    },
  });
});

cron.schedule('0 2 * * 0', async () => {
  console.log('Running weekly stock data fetch...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});