import api from './api';

/**
 * Watchlist Service
 * Handles all watchlist-related API calls
 */
const watchlistService = {
  /**
   * Get all watchlists
   * @returns {Promise} Response with watchlists array
   */
  getWatchlists: async () => {
    try {
      return await api.get('/watchlists');
    } catch (error) {
      console.error('Error fetching watchlists:', error);
      throw error;
    }
  },

  /**
   * Get a single watchlist by ID
   * @param {string} id - Watchlist ID
   * @returns {Promise} Response with watchlist data
   */
  getWatchlist: async (id) => {
    try {
      return await api.get(`/watchlists/${id}`);
    } catch (error) {
      console.error(`Error fetching watchlist ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new watchlist
   * @param {Object} data - Watchlist data
   * @param {string} data.name - Watchlist name
   * @param {string} data.description - Watchlist description
   * @param {string[]} data.stockSymbols - Array of stock symbols
   * @returns {Promise} Response with created watchlist
   */
  createWatchlist: async (data) => {
    try {
      return await api.post('/watchlists', data);
    } catch (error) {
      console.error('Error creating watchlist:', error);
      throw error;
    }
  },

  /**
   * Update an existing watchlist
   * @param {string} id - Watchlist ID
   * @param {Object} data - Updated watchlist data
   * @returns {Promise} Response with updated watchlist
   */
  updateWatchlist: async (id, data) => {
    try {
      return await api.put(`/watchlists/${id}`, data);
    } catch (error) {
      console.error(`Error updating watchlist ${id}:`, error);
      throw error;
    }
  },

  /**
   * Refetch all stocks in a watchlist
   * @param {string} id - Watchlist ID
   * @returns {Promise} Response with refetch results
   */
  refetchWatchlist: async (id) => {
    try {
      return await api.get(`/watchlists/${id}/refetch`);
    } catch (error) {
      console.error(`Error refetching watchlist ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a watchlist
   * @param {string} id - Watchlist ID
   * @returns {Promise} Response confirming deletion
   */
  deleteWatchlist: async (id) => {
    try {
      return await api.delete(`/watchlists/${id}`);
    } catch (error) {
      console.error(`Error deleting watchlist ${id}:`, error);
      throw error;
    }
  },
};

export default watchlistService;