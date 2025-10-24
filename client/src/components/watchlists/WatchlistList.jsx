import React from 'react';
import WatchlistCard from './WatchlistCard';
import './WatchlistList.css';

/**
 * Watchlist list component
 * @param {Object} props - Component props
 * @param {Array} props.watchlists - Array of watchlist objects
 * @param {Function} props.onRefetch - Refetch watchlist callback
 * @param {Function} props.onEdit - Edit watchlist callback
 * @param {Function} props.onDelete - Delete watchlist callback
 * @param {Function} props.onView - View watchlist callback
 */
const WatchlistList = ({ watchlists, onRefetch, onEdit, onDelete, onView }) => {
  if (!watchlists || watchlists.length === 0) {
    return (
      <div className="watchlist-list-empty">
        <div className="empty-icon">📋</div>
        <h3>No Watchlists Yet</h3>
        <p>Create your first watchlist to organize your stocks</p>
      </div>
    );
  }

  return (
    <div className="watchlist-list">
      {watchlists.map((watchlist) => (
        <WatchlistCard
          key={watchlist._id}
          watchlist={watchlist}
          onRefetch={onRefetch}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default WatchlistList;