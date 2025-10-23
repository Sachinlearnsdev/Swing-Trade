const axios = require('axios');

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const API_KEY = process.env.FINNHUB_API_KEY;

class FinnhubAPI {
  constructor() {
    this.baseURL = FINNHUB_BASE_URL;
    this.apiKey = API_KEY;
  }

  async getQuote(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/quote`, {
        params: {
          symbol: symbol,
          token: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error.message);
      throw error;
    }
  }

  async getCompanyProfile(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/stock/profile2`, {
        params: {
          symbol: symbol,
          token: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching profile for ${symbol}:`, error.message);
      throw error;
    }
  }

  async getBasicFinancials(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/stock/metric`, {
        params: {
          symbol: symbol,
          metric: 'all',
          token: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching financials for ${symbol}:`, error.message);
      throw error;
    }
  }

  async getCandles(symbol, resolution = 'D', from, to) {
    try {
      const response = await axios.get(`${this.baseURL}/stock/candle`, {
        params: {
          symbol: symbol,
          resolution: resolution,
          from: from,
          to: to,
          token: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching candles for ${symbol}:`, error.message);
      throw error;
    }
  }
}

module.exports = new FinnhubAPI();