import { useState } from 'react';

/**
 * Custom hook for managing filter state
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} Filter state and operations
 */
const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  /**
   * Update a single filter value
   * @param {string} key - Filter key
   * @param {any} value - New filter value
   */
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Update multiple filters at once
   * @param {Object} newFilters - Object with multiple filter key-value pairs
   */
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  };

  /**
   * Reset all filters to initial state
   */
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  /**
   * Clear a specific filter
   * @param {string} key - Filter key to clear
   */
  const clearFilter = (key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  /**
   * Clear all filters
   */
  const clearAllFilters = () => {
    setFilters({});
  };

  /**
   * Check if filters are active (any filter has a value)
   * @returns {boolean} True if any filter is active
   */
  const hasActiveFilters = () => {
    return Object.values(filters).some(value => 
      value !== '' && value !== null && value !== undefined
    );
  };

  /**
   * Get count of active filters
   * @returns {number} Number of active filters
   */
  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== null && value !== undefined
    ).length;
  };

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
    getActiveFilterCount,
  };
};

export default useFilters;