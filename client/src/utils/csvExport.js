/**
 * Utility functions for CSV export
 */

/**
 * Convert array of objects to CSV string
 * @param {Array} data - Array of objects
 * @param {Array} columns - Array of column definitions
 * @returns {string} CSV string
 */
const convertToCSV = (data, columns) => {
  if (!data || data.length === 0) {
    return '';
  }

  // Create header row
  const headers = columns.map(col => col.label || col.key).join(',');

  // Create data rows
  const rows = data.map(item => {
    return columns.map(col => {
      let value = item[col.key];

      // Handle nested objects (e.g., macd.macd)
      if (col.key.includes('.')) {
        const keys = col.key.split('.');
        value = keys.reduce((obj, key) => obj?.[key], item);
      }

      // Apply formatter if provided
      if (col.formatter && value !== null && value !== undefined) {
        value = col.formatter(value);
      }

      // Handle null/undefined
      if (value === null || value === undefined) {
        value = '';
      }

      // Convert to string and escape quotes
      value = String(value).replace(/"/g, '""');

      // Wrap in quotes if contains comma, newline, or quote
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        value = `"${value}"`;
      }

      return value;
    }).join(',');
  }).join('\n');

  return `${headers}\n${rows}`;
};

/**
 * Download CSV file
 * @param {string} csvContent - CSV content string
 * @param {string} filename - Filename for download
 */
const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    // Create download link
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up URL
    URL.revokeObjectURL(url);
  }
};

/**
 * Export stocks to CSV
 * @param {Array} stocks - Array of stock objects
 * @param {string} filename - Optional filename
 */
export const exportStocksToCSV = (stocks, filename = 'stocks.csv') => {
  if (!stocks || stocks.length === 0) {
    alert('No data to export');
    return;
  }

  const columns = [
    { key: 'symbol', label: 'Symbol' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'currentPrice', label: 'Current Price', formatter: (v) => `$${v.toFixed(2)}` },
    { key: 'entryPrice', label: 'Entry Price', formatter: (v) => `$${v.toFixed(2)}` },
    { key: 'stopLoss', label: 'Stop Loss', formatter: (v) => `$${v.toFixed(2)}` },
    { key: 'targetPrice', label: 'Target Price', formatter: (v) => `$${v.toFixed(2)}` },
    { key: 'trend', label: 'Trend' },
    { key: 'riskToReward', label: 'R:R Ratio', formatter: (v) => v?.toFixed(2) },
    { key: 'successProbability', label: 'Success %', formatter: (v) => `${v}%` },
    { key: 'ema20', label: 'EMA 20', formatter: (v) => v?.toFixed(2) },
    { key: 'ema50', label: 'EMA 50', formatter: (v) => v?.toFixed(2) },
    { key: 'rsi', label: 'RSI', formatter: (v) => v?.toFixed(2) },
    { key: 'volume', label: 'Volume' },
    { key: 'marketCap', label: 'Market Cap' },
    { key: 'lastFetched', label: 'Last Updated', formatter: (v) => new Date(v).toLocaleString() },
  ];

  const csvContent = convertToCSV(stocks, columns);
  downloadCSV(csvContent, filename);
};

/**
 * Export watchlists to CSV
 * @param {Array} watchlists - Array of watchlist objects
 * @param {string} filename - Optional filename
 */
export const exportWatchlistsToCSV = (watchlists, filename = 'watchlists.csv') => {
  if (!watchlists || watchlists.length === 0) {
    alert('No data to export');
    return;
  }

  const columns = [
    { key: 'name', label: 'Watchlist Name' },
    { key: 'description', label: 'Description' },
    { key: 'stockCount', label: 'Stock Count', formatter: (v) => v || 0 },
    { key: 'stockSymbols', label: 'Symbols', formatter: (v) => v?.join('; ') || '' },
    { key: 'lastRefetched', label: 'Last Refetched', formatter: (v) => v ? new Date(v).toLocaleString() : 'Never' },
  ];

  // Transform data to include stock count
  const data = watchlists.map(w => ({
    ...w,
    stockCount: w.stocks?.length || w.stockSymbols?.length || 0,
  }));

  const csvContent = convertToCSV(data, columns);
  downloadCSV(csvContent, filename);
};

/**
 * Export watchlist stocks to CSV
 * @param {Object} watchlist - Watchlist object with stocks
 * @param {string} filename - Optional filename
 */
export const exportWatchlistStocksToCSV = (watchlist, filename) => {
  if (!watchlist || !watchlist.stocks || watchlist.stocks.length === 0) {
    alert('No stocks in this watchlist');
    return;
  }

  const defaultFilename = `${watchlist.name.replace(/\s+/g, '_')}_stocks.csv`;
  exportStocksToCSV(watchlist.stocks, filename || defaultFilename);
};

export default {
  exportStocksToCSV,
  exportWatchlistsToCSV,
  exportWatchlistStocksToCSV,
};