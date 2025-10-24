import React from 'react';
import './ErrorMessage.css';

/**
 * Error message display component
 * @param {Object} props - Component props
 * @param {string} props.error - Error message to display
 * @param {Function} props.onRetry - Optional retry callback
 * @param {Function} props.onClose - Optional close callback
 */
const ErrorMessage = ({ error, onRetry, onClose }) => {
  if (!error) return null;

  return (
    <div className="error-message-container">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h4 className="error-title">Error</h4>
        <p className="error-text">{error}</p>
        <div className="error-actions">
          {onRetry && (
            <button className="btn btn-retry" onClick={onRetry}>
              Retry
            </button>
          )}
          {onClose && (
            <button className="btn btn-close" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;