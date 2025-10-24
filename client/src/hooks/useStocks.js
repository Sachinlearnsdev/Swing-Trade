import { useState, useEffect, useCallback } from 'react';
import stockService from '../services/stockService';

/**
 * Custom hook for managing stock data and operations
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} Stock state and operations
 */
const useStocks = (initialFilters = {}) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  /**
   * Fetch stocks from API with current filters
   */
  const fetchStocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockService.getStocks(filters);
      setStocks(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch stocks');
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Refetch a single stock and update it in the array
   * @param {string} symbol - Stock symbol to refetch
   */
  const refetchStock = async (symbol) => {
    try {
      const response = await stockService.refetchStock(symbol);
      
      // Update the stock in the array
      setStocks(prevStocks => 
        prevStocks.map(stock => 
          stock.symbol === symbol ? response.data : stock
        )
      );
      
      return response;
    } catch (err) {
      setError(err.message || `Failed to refetch ${symbol}`);
      throw err;
    }
  };

  /**
   * Fetch multiple stocks at once
   * @param {string[]} symbols - Array of stock symbols
   */
  const fetchMultipleStocks = async (symbols) => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockService.fetchMultipleStocks(symbols);
      
      // Refresh the stock list after fetching
      await fetchStocks();
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch stocks');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a stock
   * @param {string} symbol - Stock symbol to delete
   */
  const deleteStock = async (symbol) => {
    try {
      await stockService.deleteStock(symbol);
      
      // Remove stock from array
      setStocks(prevStocks => 
        prevStocks.filter(stock => stock.symbol !== symbol)
      );
    } catch (err) {
      setError(err.message || `Failed to delete ${symbol}`);
      throw err;
    }
  };

  /**
   * Apply new filters
   * @param {Object} newFilters - New filter values
   */
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  /**
   * Reset filters to initial state
   */
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  // Fetch stocks when filters change
  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  return {
    stocks,
    loading,
    error,
    fetchStocks,
    refetchStock,
    fetchMultipleStocks,
    deleteStock,
    applyFilters,
    resetFilters,
    clearError,
    filters,
  };
};

export default useStocks;