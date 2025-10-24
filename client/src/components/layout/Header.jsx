import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

/**
 * Header navigation component
 */
const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span className="logo-icon">📈</span>
          <span className="logo-text">Stock Trading App</span>
        </Link>

        <nav className="header-nav">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            Dashboard
          </Link>
          <Link to="/stocks" className={`nav-link ${isActive('/stocks')}`}>
            Stocks
          </Link>
          <Link to="/watchlists" className={`nav-link ${isActive('/watchlists')}`}>
            Watchlists
          </Link>
        </nav>

        <div className="header-actions">
          <button className="theme-toggle" title="Toggle theme">
            🌙
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;