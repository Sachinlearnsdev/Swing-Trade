import React, { useState } from 'react';
import { formatRelativeTime } from '../../utils/formatters';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';
import './WatchlistCard.css';

/**
 * Watchlist card component
 * @param {Object} props - Component props
 * @param {Object} props.watchlist - Watchlist data
 * @param {Function} props.onRefetch - Refetch callback
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @param {Function} props.onView - View callback
 */
const WatchlistCard = ({ watchlist, onRefetch, onEdit, onDelete, onView }) => {
  const [isRefetching, setIsRefetching] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const stockCount = watchlist.stocks?.length || watchlist.stockSymbols?.length || 0;

  const handleRefetch = async () => {
    setIsRefetching(true);
    try {
      await onRefetch(watchlist._id);
    } finally {
      setIsRefetching(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    await onDelete(watchlist._id);
    setShowDeleteDialog(false);
  };

  // Calculate trend distribution
  const trendCounts = watchlist.stocks?.reduce((acc, stock) => {
    acc[stock.trend] = (acc[stock.trend] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <>
      <div className="watchlist-card">
        <div className="watchlist-card-header">
          <h3 className="watchlist-name">{watchlist.name}</h3>
          <span className="watchlist-count">{stockCount} stocks</span>
        </div>

        {watchlist.description && (
          <p className="watchlist-description">{watchlist.description}</p>
        )}

        {stockCount > 0 && (
          <div className="watchlist-trends">
            {trendCounts.Uptrend > 0 && (
              <div className="trend-badge trend-up">
                📈 {trendCounts.Uptrend}
              </div>
            )}
            {trendCounts.Downtrend > 0 && (
              <div className="trend-badge trend-down">
                📉 {trendCounts.Downtrend}
              </div>
            )}
            {trendCounts.Neutral > 0 && (
              <div className="trend-badge trend-neutral">
                ➡️ {trendCounts.Neutral}
              </div>
            )}
          </div>
        )}

        <div className="watchlist-meta">
          <span className="watchlist-updated">
            Last updated: {watchlist.lastRefetched ? formatRelativeTime(watchlist.lastRefetched) : 'Never'}
          </span>
        </div>

        <div className="watchlist-actions">
          <Button
            variant="primary"
            size="small"
            loading={isRefetching}
            onClick={handleRefetch}
            disabled={stockCount === 0}
          >
            Refetch All
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => onEdit(watchlist)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>

        {stockCount > 0 && (
          <button className="watchlist-view" onClick={() => onView(watchlist)}>
            View Stocks →
          </button>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Watchlist"
        message={`Are you sure you want to delete "${watchlist.name}"? This will not delete the stocks, only the watchlist.`}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
};

export default WatchlistCard;