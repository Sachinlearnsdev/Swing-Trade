import React from 'react';
import { Link } from 'react-router-dom';
import useStocks from '../hooks/useStocks';
import useWatchlists from '../hooks/useWatchlists';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import './Dashboard.css';

/**
 * Dashboard page component
 */
const Dashboard = () => {
  const { stocks, loading: stocksLoading, error: stocksError } = useStocks();
  const { watchlists, loading: watchlistsLoading } = useWatchlists();

  if (stocksLoading || watchlistsLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  // Calculate statistics
  const totalStocks = stocks.length;
  const uptrendStocks = stocks.filter(s => s.trend === 'Uptrend').length;
  const downtrendStocks = stocks.filter(s => s.trend === 'Downtrend').length;
  const neutralStocks = stocks.filter(s => s.trend === 'Neutral').length;
  const totalWatchlists = watchlists.length;

  const highRRStocks = stocks.filter(s => s.riskToReward >= 2).length;
  const highSuccessStocks = stocks.filter(s => s.successProbability >= 70).length;

  const avgRiskReward = stocks.length > 0
    ? (stocks.reduce((sum, s) => sum + (s.riskToReward || 0), 0) / stocks.length).toFixed(2)
    : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your stock trading data</p>
      </div>

      {stocksError && <ErrorMessage error={stocksError} />}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3 className="stat-value">{totalStocks}</h3>
            <p className="stat-label">Total Stocks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3 className="stat-value">{totalWatchlists}</h3>
            <p className="stat-label">Watchlists</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3 className="stat-value">{avgRiskReward}</h3>
            <p className="stat-label">Avg R:R Ratio</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3 className="stat-value">{highSuccessStocks}</h3>
            <p className="stat-label">High Success (70%+)</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2>Trend Distribution</h2>
          <div className="trend-stats">
            <Link to="/stocks?trend=Uptrend" className="trend-stat trend-up">
              <span className="trend-icon">📈</span>
              <div>
                <h4>{uptrendStocks}</h4>
                <p>Uptrend</p>
              </div>
            </Link>

            <Link to="/stocks?trend=Downtrend" className="trend-stat trend-down">
              <span className="trend-icon">📉</span>
              <div>
                <h4>{downtrendStocks}</h4>
                <p>Downtrend</p>
              </div>
            </Link>

            <Link to="/stocks?trend=Neutral" className="trend-stat trend-neutral">
              <span className="trend-icon">➡️</span>
              <div>
                <h4>{neutralStocks}</h4>
                <p>Neutral</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Quick Stats</h2>
          <div className="quick-stats">
            <Link to="/stocks?minRiskReward=2" className="quick-stat">
              <span className="stat-number">{highRRStocks}</span>
              <span className="stat-text">High R:R (2+)</span>
            </Link>
            <Link to="/stocks?minSuccessProbability=70" className="quick-stat">
              <span className="stat-number">{highSuccessStocks}</span>
              <span className="stat-text">High Success (70%+)</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/stocks" className="action-card">
              <span className="action-icon">📈</span>
              <h3>View All Stocks</h3>
              <p>Browse and filter all stocks</p>
            </Link>

            <Link to="/watchlists" className="action-card">
              <span className="action-icon">📋</span>
              <h3>Manage Watchlists</h3>
              <p>Create and organize watchlists</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;