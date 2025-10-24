/**
 * Application-wide constants
 */

// Trend types
export const TRENDS = {
  UPTREND: 'Uptrend',
  DOWNTREND: 'Downtrend',
  NEUTRAL: 'Neutral',
};

export const TREND_OPTIONS = [
  { value: '', label: 'All Trends' },
  { value: TRENDS.UPTREND, label: 'Uptrend' },
  { value: TRENDS.DOWNTREND, label: 'Downtrend' },
  { value: TRENDS.NEUTRAL, label: 'Neutral' },
];

// Filter default values
export const FILTER_DEFAULTS = {
  trend: '',
  minRiskReward: '',
  maxRiskReward: '',
  minPrice: '',
  maxPrice: '',
  minSuccessProbability: '',
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'symbol', label: 'Symbol' },
  { value: 'companyName', label: 'Company' },
  { value: 'currentPrice', label: 'Price' },
  { value: 'trend', label: 'Trend' },
  { value: 'riskToReward', label: 'R:R Ratio' },
  { value: 'successProbability', label: 'Success %' },
  { value: 'lastFetched', label: 'Last Updated' },
];

// Color scheme for trends
export const TREND_COLORS = {
  [TRENDS.UPTREND]: '#28a745',
  [TRENDS.DOWNTREND]: '#dc3545',
  [TRENDS.NEUTRAL]: '#6c757d',
};

// Pagination
export const ITEMS_PER_PAGE = 50;
export const PAGE_SIZE_OPTIONS = [25, 50, 100, 200];

// API timeouts (milliseconds)
export const API_TIMEOUT = 30000;
export const REFETCH_TIMEOUT = 60000;

// Date formats
export const DATE_FORMAT = 'MMM DD, YYYY';
export const DATETIME_FORMAT = 'MMM DD, YYYY HH:mm';

// Success probability thresholds
export const SUCCESS_PROBABILITY = {
  LOW: 40,
  MEDIUM: 60,
  HIGH: 80,
};

// Risk-to-reward ratio thresholds
export const RISK_REWARD = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

// Messages
export const MESSAGES = {
  FETCH_SUCCESS: 'Stocks fetched successfully',
  FETCH_ERROR: 'Failed to fetch stocks',
  REFETCH_SUCCESS: 'Stock refetched successfully',
  REFETCH_ERROR: 'Failed to refetch stock',
  DELETE_SUCCESS: 'Stock deleted successfully',
  DELETE_ERROR: 'Failed to delete stock',
  WATCHLIST_CREATED: 'Watchlist created successfully',
  WATCHLIST_UPDATED: 'Watchlist updated successfully',
  WATCHLIST_DELETED: 'Watchlist deleted successfully',
  WATCHLIST_ERROR: 'Watchlist operation failed',
  NETWORK_ERROR: 'Network error - please check your connection',
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'stock-app-theme',
  FILTERS: 'stock-app-filters',
  SORT_PREFERENCE: 'stock-app-sort',
};

export default {
  TRENDS,
  TREND_OPTIONS,
  FILTER_DEFAULTS,
  SORT_OPTIONS,
  TREND_COLORS,
  ITEMS_PER_PAGE,
  PAGE_SIZE_OPTIONS,
  SUCCESS_PROBABILITY,
  RISK_REWARD,
  MESSAGES,
  STORAGE_KEYS,
};