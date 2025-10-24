/**
 * Utility functions for form validation
 */

/**
 * Validate stock symbol
 * @param {string} symbol - Stock symbol to validate
 * @returns {Object} Validation result
 */
export const validateSymbol = (symbol) => {
  if (!symbol || symbol.trim() === '') {
    return { isValid: false, error: 'Symbol is required' };
  }

  const trimmedSymbol = symbol.trim();

  if (trimmedSymbol.length < 1 || trimmedSymbol.length > 10) {
    return { isValid: false, error: 'Symbol must be 1-10 characters' };
  }

  if (!/^[A-Za-z.]+$/.test(trimmedSymbol)) {
    return { isValid: false, error: 'Symbol can only contain letters and dots' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate watchlist name
 * @param {string} name - Watchlist name to validate
 * @returns {Object} Validation result
 */
export const validateWatchlistName = (name) => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Watchlist name is required' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 3) {
    return { isValid: false, error: 'Watchlist name must be at least 3 characters' };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, error: 'Watchlist name must be less than 50 characters' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate price value
 * @param {number|string} price - Price to validate
 * @param {string} fieldName - Field name for error message
 * @returns {Object} Validation result
 */
export const validatePrice = (price, fieldName = 'Price') => {
  if (price === '' || price === null || price === undefined) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const numPrice = Number(price);

  if (isNaN(numPrice)) {
    return { isValid: false, error: `${fieldName} must be a number` };
  }

  if (numPrice <= 0) {
    return { isValid: false, error: `${fieldName} must be greater than 0` };
  }

  if (numPrice > 1000000) {
    return { isValid: false, error: `${fieldName} seems unreasonably high` };
  }

  return { isValid: true, error: null };
};

/**
 * Validate risk-to-reward ratio
 * @param {number|string} ratio - R:R ratio to validate
 * @returns {Object} Validation result
 */
export const validateRiskReward = (ratio) => {
  if (ratio === '' || ratio === null || ratio === undefined) {
    return { isValid: true, error: null }; // Optional field
  }

  const numRatio = Number(ratio);

  if (isNaN(numRatio)) {
    return { isValid: false, error: 'R:R ratio must be a number' };
  }

  if (numRatio < 0) {
    return { isValid: false, error: 'R:R ratio cannot be negative' };
  }

  if (numRatio > 100) {
    return { isValid: false, error: 'R:R ratio seems unreasonably high' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate array of stock symbols
 * @param {Array} symbols - Array of symbols to validate
 * @returns {Object} Validation result
 */
export const validateSymbolArray = (symbols) => {
  if (!Array.isArray(symbols)) {
    return { isValid: false, error: 'Symbols must be an array' };
  }

  if (symbols.length === 0) {
    return { isValid: false, error: 'At least one symbol is required' };
  }

  // Validate each symbol
  const invalidSymbols = [];
  symbols.forEach((symbol, index) => {
    const validation = validateSymbol(symbol);
    if (!validation.isValid) {
      invalidSymbols.push(`Symbol ${index + 1}: ${validation.error}`);
    }
  });

  if (invalidSymbols.length > 0) {
    return { 
      isValid: false, 
      error: invalidSymbols.join(', ') 
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate number range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {Object} Validation result
 */
export const validateRange = (min, max) => {
  if (min !== '' && max !== '' && min !== null && max !== null) {
    const numMin = Number(min);
    const numMax = Number(max);

    if (isNaN(numMin) || isNaN(numMax)) {
      return { isValid: false, error: 'Min and max must be numbers' };
    }

    if (numMin > numMax) {
      return { isValid: false, error: 'Minimum cannot be greater than maximum' };
    }
  }

  return { isValid: true, error: null };
};

/**
 * Sanitize input string (remove special characters)
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  return input.trim().replace(/[<>]/g, '');
};

export default {
  validateSymbol,
  validateWatchlistName,
  validatePrice,
  validateRiskReward,
  validateSymbolArray,
  validateEmail,
  validateRange,
  sanitizeInput,
};