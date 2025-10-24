/**
 * Utility functions for formatting data
 */

/**
 * Format number as currency (USD)
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0.00';
  }
  return `$${Number(value).toFixed(decimals)}`;
};

/**
 * Format number as percentage
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string
 */
export const formatPercent = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Format number with commas for thousands
 * @param {number} value - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  return Number(value).toLocaleString('en-US');
};

/**
 * Format large numbers (e.g., market cap)
 * @param {number} value - Number to format
 * @returns {string} Formatted string with B/M/K suffix
 */
export const formatLargeNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  const num = Number(value);
  
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  
  return num.toFixed(2);
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date with time
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date-time string
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date as relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return 'Just now';
  } else if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDay < 30) {
    return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
  } else {
    return formatDate(date);
  }
};

/**
 * Get trend icon based on trend value
 * @param {string} trend - Trend value (Uptrend, Downtrend, Neutral)
 * @returns {string} Emoji icon
 */
export const getTrendIcon = (trend) => {
  switch (trend) {
    case 'Uptrend':
      return '📈';
    case 'Downtrend':
      return '📉';
    case 'Neutral':
      return '➡️';
    default:
      return '❓';
  }
};

/**
 * Format stock symbol (uppercase, trim)
 * @param {string} symbol - Stock symbol
 * @returns {string} Formatted symbol
 */
export const formatSymbol = (symbol) => {
  if (!symbol) return '';
  return symbol.trim().toUpperCase();
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format risk-to-reward ratio with color indicator
 * @param {number} ratio - R:R ratio
 * @returns {string} Formatted ratio
 */
export const formatRiskReward = (ratio) => {
  if (ratio === null || ratio === undefined || isNaN(ratio)) {
    return 'N/A';
  }
  return `${Number(ratio).toFixed(2)}:1`;
};

export default {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatLargeNumber,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  getTrendIcon,
  formatSymbol,
  truncateText,
  formatRiskReward,
};