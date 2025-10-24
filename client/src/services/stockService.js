import api from './api';

/**
 * Stock Service
 * Handles all stock-related API calls
 */
const stockService = {
  /**
   * Get all stocks with optional filters
   * @param {Object} filters - Filter parameters
   * @param {string} filters.trend - Filter by trend (Uptrend, Downtrend, Neutral)
   * @param {number} filters.minRiskReward - Minimum risk-to-reward ratio
   * @param {number} filters.maxRiskReward - Maximum risk-to-reward ratio
   * @param {number} filters.minPrice - Minimum price
   * @param {number} filters.maxPrice - Maximum price
   * @returns {Promise} Response with stocks array
   */
  getStocks: async (filters = {}) => {
    try {
      // Remove empty filter values
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const params = new URLSearchParams(cleanFilters).toString();
      const url = params ? `/stocks?${params}` : '/stocks';
      
      return await api.get(url);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      throw error;
    }
  },

  /**
   * Refetch data for a single stock
   * @param {string} symbol - Stock symbol (e.g., 'AAPL')
   * @returns {Promise} Response with updated stock data
   */
  refetchStock: async (symbol) => {
    try {
      return await api.get(`/stocks/refetch/${symbol.toUpperCase()}`);
    } catch (error) {
      console.error(`Error refetching stock ${symbol}:`, error);
      throw error;
    }
  },

  /**
   * Fetch multiple stocks at once
   * @param {string[]} symbols - Array of stock symbols
   * @returns {Promise} Response with fetch results
   */
  fetchMultipleStocks: async (symbols) => {
    try {
      return await api.post('/stocks/fetch-multiple', { symbols });
    } catch (error) {
      console.error('Error fetching multiple stocks:', error);
      throw error;
    }
  },

  /**
   * Delete a stock from database
   * @param {string} symbol - Stock symbol to delete
   * @returns {Promise} Response confirming deletion
   */
  deleteStock: async (symbol) => {
    try {
      return await api.delete(`/stocks/${symbol.toUpperCase()}`);
    } catch (error) {
      console.error(`Error deleting stock ${symbol}:`, error);
      throw error;
    }
  },
};

export default stockService;