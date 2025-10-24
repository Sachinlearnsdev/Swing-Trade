import React, { useState } from 'react';
import StockRow from './StockRow';
import './StockTable.css';

/**
 * Stock table component with sorting
 * @param {Object} props - Component props
 * @param {Array} props.stocks - Array of stock objects
 * @param {Function} props.onRefetch - Refetch stock callback
 * @param {Function} props.onDelete - Delete stock callback
 */
const StockTable = ({ stocks, onRefetch, onDelete }) => {
  const [sortField, setSortField] = useState('symbol');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    // Handle null/undefined values
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    // Handle string comparison
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (!stocks || stocks.length === 0) {
    return (
      <div className="stock-table-empty">
        <p>No stocks found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="stock-table-container">
      <table className="stock-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('symbol')} className="sortable">
              Symbol {getSortIcon('symbol')}
            </th>
            <th onClick={() => handleSort('companyName')} className="sortable">
              Company {getSortIcon('companyName')}
            </th>
            <th onClick={() => handleSort('currentPrice')} className="sortable">
              Price {getSortIcon('currentPrice')}
            </th>
            <th onClick={() => handleSort('trend')} className="sortable">
              Trend {getSortIcon('trend')}
            </th>
            <th onClick={() => handleSort('riskToReward')} className="sortable">
              R:R Ratio {getSortIcon('riskToReward')}
            </th>
            <th onClick={() => handleSort('successProbability')} className="sortable">
              Success % {getSortIcon('successProbability')}
            </th>
            <th>RSI</th>
            <th onClick={() => handleSort('lastFetched')} className="sortable">
              Last Updated {getSortIcon('lastFetched')}
            </th>
            <th className="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedStocks.map((stock) => (
            <StockRow
              key={stock._id}
              stock={stock}
              onRefetch={onRefetch}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;