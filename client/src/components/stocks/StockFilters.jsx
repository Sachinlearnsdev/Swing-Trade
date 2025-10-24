import React, { useState } from 'react';
import { TREND_OPTIONS } from '../../utils/constants';
import Button from '../common/Button';
import './StockFilters.css';

/**
 * Stock filters component
 * @param {Object} props - Component props
 * @param {Function} props.onFilterChange - Filter change callback
 * @param {Function} props.onReset - Reset filters callback
 * @param {Object} props.initialFilters - Initial filter values
 */
const StockFilters = ({ onFilterChange, onReset, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    trend: initialFilters.trend || '',
    minRiskReward: initialFilters.minRiskReward || '',
    maxRiskReward: initialFilters.maxRiskReward || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
  });

  const handleChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    const emptyFilters = {
      trend: '',
      minRiskReward: '',
      maxRiskReward: '',
      minPrice: '',
      maxPrice: '',
    };
    setFilters(emptyFilters);
    onReset();
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="stock-filters">
      <div className="filters-header">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button className="clear-all" onClick={handleReset}>
            Clear All
          </button>
        )}
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="trend">Trend</label>
          <select
            id="trend"
            value={filters.trend}
            onChange={(e) => handleChange('trend', e.target.value)}
            className="filter-input"
          >
            {TREND_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="minRiskReward">Min R:R Ratio</label>
          <input
            id="minRiskReward"
            type="number"
            step="0.1"
            min="0"
            placeholder="e.g., 2"
            value={filters.minRiskReward}
            onChange={(e) => handleChange('minRiskReward', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="maxRiskReward">Max R:R Ratio</label>
          <input
            id="maxRiskReward"
            type="number"
            step="0.1"
            min="0"
            placeholder="e.g., 10"
            value={filters.maxRiskReward}
            onChange={(e) => handleChange('maxRiskReward', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="minPrice">Min Price</label>
          <input
            id="minPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="$0"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            id="maxPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="$1000"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <div className="filters-actions">
        <Button variant="primary" onClick={handleApply}>
          Apply Filters
        </Button>
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default StockFilters;