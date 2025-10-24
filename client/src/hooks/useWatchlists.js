import { useState, useEffect, useCallback } from 'react';
import watchlistService from '../services/watchlistService';

/**
 * Custom hook for managing watchlist data and operations
 * @returns {Object} Watchlist state and operations
 */
const useWatchlists = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all watchlists from API
   */
  const fetchWatchlists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await watchlistService.getWatchlists();
      setWatchlists(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch watchlists');
      setWatchlists([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a single watchlist by ID
   * @param {string} id - Watchlist ID
   */
  const getWatchlist = async (id) => {
    try {
      const response = await watchlistService.getWatchlist(id);
      return response.data;
    } catch (err) {
      setError(err.message || `Failed to fetch watchlist ${id}`);
      throw err;
    }
  };

  /**
   * Create a new watchlist
   * @param {Object} data - Watchlist data
   */
  const createWatchlist = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await watchlistService.createWatchlist(data);
      
      // Refresh watchlist list
      await fetchWatchlists();
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create watchlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing watchlist
   * @param {string} id - Watchlist ID
   * @param {Object} data - Updated data
   */
  const updateWatchlist = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await watchlistService.updateWatchlist(id, data);
      
      // Update watchlist in array
      setWatchlists(prevWatchlists =>
        prevWatchlists.map(w => w._id === id ? response.data : w)
      );
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update watchlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refetch all stocks in a watchlist
   * @param {string} id - Watchlist ID
   */
  const refetchWatchlist = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await watchlistService.refetchWatchlist(id);
      
      // Refresh watchlist data
      await fetchWatchlists();
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to refetch watchlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a watchlist
   * @param {string} id - Watchlist ID
   */
  const deleteWatchlist = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await watchlistService.deleteWatchlist(id);
      
      // Remove watchlist from array
      setWatchlists(prevWatchlists =>
        prevWatchlists.filter(w => w._id !== id)
      );
    } catch (err) {
      setError(err.message || 'Failed to delete watchlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  // Fetch watchlists on mount
  useEffect(() => {
    fetchWatchlists();
  }, [fetchWatchlists]);

  return {
    watchlists,
    loading,
    error,
    fetchWatchlists,
    getWatchlist,
    createWatchlist,
    updateWatchlist,
    refetchWatchlist,
    deleteWatchlist,
    clearError,
  };
};

export default useWatchlists;