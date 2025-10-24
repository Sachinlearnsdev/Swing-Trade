const axios = require('axios');

class YahooFinanceAPI {
  constructor() {
    this.baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart';
  }

  /**
   * Get stock quote
   */
  async getQuote(symbol) {
    try {
      const url = `${this.baseUrl}/${symbol}?interval=1d&range=1d`;
      const response = await axios.get(url);
      
      const result = response.data.chart.result[0];
      const quote = result.meta;
      const indicators = result.indicators.quote[0];
      
      return {
        c: quote.regularMarketPrice,
        h: quote.regularMarketDayHigh || indicators.high[0],
        l: quote.regularMarketDayLow || indicators.low[0],
        o: indicators.open[0],
        pc: quote.previousClose,
        v: quote.regularMarketVolume || indicators.volume[0],
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error.message);
      throw error;
    }
  }

  /**
   * Get company profile
   */
  async getCompanyProfile(symbol) {
    try {
      const url = `${this.baseUrl}/${symbol}?interval=1d&range=1d`;
      const response = await axios.get(url);
      
      const result = response.data.chart.result[0];
      const meta = result.meta;
      
      return {
        name: meta.longName || meta.shortName || symbol,
        marketCapitalization: 0, // Not available in this endpoint
      };
    } catch (error) {
      console.error(`Error fetching profile for ${symbol}:`, error.message);
      return { name: symbol, marketCapitalization: 0 };
    }
  }

  /**
   * Get historical candles
   */
  async getCandles(symbol, resolution, from, to) {
    try {
      const url = `${this.baseUrl}/${symbol}?period1=${from}&period2=${to}&interval=1d`;
      const response = await axios.get(url);
      
      const result = response.data.chart.result[0];
      
      if (!result || !result.timestamp) {
        return { s: 'no_data' };
      }

      const quotes = result.indicators.quote[0];
      
      return {
        c: quotes.close,
        h: quotes.high,
        l: quotes.low,
        o: quotes.open,
        v: quotes.volume,
        t: result.timestamp,
        s: 'ok',
      };
    } catch (error) {
      console.error(`Error fetching candles for ${symbol}:`, error.message);
      return { s: 'no_data' };
    }
  }
}

module.exports = new YahooFinanceAPI();