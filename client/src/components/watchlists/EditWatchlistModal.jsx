import React, { useState, useEffect } from 'react';
import { validateWatchlistName } from '../../utils/validators';
import Button from '../common/Button';
import './CreateWatchlistModal.css';

/**
 * Edit watchlist modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Object} props.watchlist - Watchlist to edit
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onUpdate - Update callback
 */
const EditWatchlistModal = ({ isOpen, watchlist, onClose, onUpdate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stockSymbols, setStockSymbols] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when watchlist changes
  useEffect(() => {
    if (watchlist) {
      setName(watchlist.name || '');
      setDescription(watchlist.description || '');
      setStockSymbols(watchlist.stockSymbols?.join(', ') || '');
    }
  }, [watchlist]);

  if (!isOpen || !watchlist) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate name
    const nameValidation = validateWatchlistName(name);
    if (!nameValidation.isValid) {
      setError(nameValidation.error);
      return;
    }

    // Parse stock symbols
    const symbols = stockSymbols
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(s => s.length > 0);

    if (symbols.length === 0) {
      setError('Please enter at least one stock symbol');
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(watchlist._id, {
        name: name.trim(),
        description: description.trim(),
        stockSymbols: symbols,
      });

      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update watchlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Watchlist</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div className="modal-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="edit-watchlist-name">
              Watchlist Name <span className="required">*</span>
            </label>
            <input
              id="edit-watchlist-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Tech Stocks"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-watchlist-description">Description</label>
            <textarea
              id="edit-watchlist-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of this watchlist"
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-stock-symbols">
              Stock Symbols <span className="required">*</span>
            </label>
            <textarea
              id="edit-stock-symbols"
              value={stockSymbols}
              onChange={(e) => setStockSymbols(e.target.value)}
              placeholder="Enter stock symbols separated by commas (e.g., AAPL, MSFT, GOOGL)"
              className="form-textarea"
              rows="4"
              required
            />
            <small className="form-help">
              Enter stock symbols separated by commas. Example: AAPL, MSFT, GOOGL
            </small>
          </div>

          <div className="modal-footer">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
            >
              Update Watchlist
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWatchlistModal;