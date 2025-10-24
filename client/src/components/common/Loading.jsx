import React from 'react';
import './Loading.css';

/**
 * Loading spinner component
 * @param {Object} props - Component props
 * @param {string} props.message - Loading message to display
 * @param {string} props.size - Size of spinner (small, medium, large)
 * @param {boolean} props.fullScreen - Whether to show as full screen overlay
 */
const Loading = ({ 
  message = 'Loading...', 
  size = 'medium',
  fullScreen = false 
}) => {
  const spinnerClass = `spinner spinner-${size}`;
  const containerClass = fullScreen ? 'loading-container loading-fullscreen' : 'loading-container';

  return (
    <div className={containerClass}>
      <div className={spinnerClass}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default Loading;