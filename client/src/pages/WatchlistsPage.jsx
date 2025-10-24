import React, { useState } from 'react';
import useWatchlists from '../hooks/useWatchlists';
import WatchlistList from '../components/watchlists/WatchlistList';
import CreateWatchlistModal from '../components/watchlists/CreateWatchlistModal';
import EditWatchlistModal from '../components/watchlists/EditWatchlistModal';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import StockTable from '../components/stocks/StockTable';
import './WatchlistsPage.css';

/**
 * Watchlists page component
 */
const WatchlistsPage = () => {
  const {
    watchlists,
    loading,
    error,
    createWatchlist,
    updateWatchlist,
    refetchWatchlist,
    deleteWatchlist,
    clearError,
  } = useWatchlists();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWatchlist, setSelectedWatchlist] = useState(null);
  const [viewingWatchlist, setViewingWatchlist] = useState(null);

  const handleEdit = (watchlist) => {
    setSelectedWatchlist(watchlist);
    setShowEditModal(true);
  };

  const handleView = (watchlist) => {
    setViewingWatchlist(watchlist);
  };

  const handleBackToList = () => {
    setViewingWatchlist(null);
  };

  if (loading) {
    return <Loading message="Loading watchlists..." />;
  }

  // If viewing a specific watchlist
  if (viewingWatchlist) {
    return (
      <div className="watchlists-page">
        <div className="page-header">
          <div>
            <button className="back-button" onClick={handleBackToList}>
              ← Back to Watchlists
            </button>
            <h1>{viewingWatchlist.name}</h1>
            <p>{viewingWatchlist.description}</p>
          </div>
        </div>

        {viewingWatchlist.stocks && viewingWatchlist.stocks.length > 0 ? (
          <StockTable
            stocks={viewingWatchlist.stocks}
            onRefetch={() => {}}
            onDelete={() => {}}
          />
        ) : (
          <div className="empty-watchlist">
            <p>No stocks in this watchlist</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="watchlists-page">
      <div className="page-header">
        <div>
          <h1>My Watchlists</h1>
          <p>{watchlists.length} watchlists</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          + Create Watchlist
        </Button>
      </div>

      {error && <ErrorMessage error={error} onClose={clearError} />}

      <WatchlistList
        watchlists={watchlists}
        onRefetch={refetchWatchlist}
        onEdit={handleEdit}
        onDelete={deleteWatchlist}
        onView={handleView}
      />

      <CreateWatchlistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={createWatchlist}
      />

      <EditWatchlistModal
        isOpen={showEditModal}
        watchlist={selectedWatchlist}
        onClose={() => {
          setShowEditModal(false);
          setSelectedWatchlist(null);
        }}
        onUpdate={updateWatchlist}
      />
    </div>
  );
};

export default WatchlistsPage;