import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

/**
 * Sidebar component (optional - can be used for filters or quick navigation)
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether sidebar is open (for mobile)
 * @param {Function} props.onClose - Close sidebar callback
 */
const Sidebar = ({ isOpen = true, onClose }) => {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h3>Quick Access</h3>
          <button className="sidebar-close" onClick={onClose}>×</button>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-title">Trends</h4>
          <Link to="/stocks?trend=Uptrend" className="sidebar-link">
            📈 Uptrend Stocks
          </Link>
          <Link to="/stocks?trend=Downtrend" className="sidebar-link">
            📉 Downtrend Stocks
          </Link>
          <Link to="/stocks?trend=Neutral" className="sidebar-link">
            ➡️ Neutral Stocks
          </Link>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-title">Filters</h4>
          <Link to="/stocks?minRiskReward=2" className="sidebar-link">
            🎯 High R:R (2+)
          </Link>
          <Link to="/stocks?minSuccessProbability=70" className="sidebar-link">
            ⭐ High Success (70%+)
          </Link>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-title">Actions</h4>
          <Link to="/watchlists" className="sidebar-link">
            📋 My Watchlists
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;