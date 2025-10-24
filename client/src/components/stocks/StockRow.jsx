import React, { useState } from 'react';
import { formatCurrency, formatRelativeTime, formatRiskReward, getTrendIcon } from '../../utils/formatters';
import { TREND_COLORS } from '../../utils/constants';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';
import './StockRow.css';

/**
 * Stock row component for table
 * @param {Object} props - Component props
 * @param {Object} props.stock - Stock data object
 * @param {Function} props.onRefetch - Refetch callback
 * @param {Function} props.onDelete - Delete callback
 */
const StockRow = ({ stock, onRefetch, onDelete }) => {
  const [isRefetching, setIsRefetching] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleRefetch = async () => {
    setIsRefetching(true);
    try {
      await onRefetch(stock.symbol);
    } finally {
      setIsRefetching(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    await onDelete(stock.symbol);
    setShowDeleteDialog(false);
  };

  const getTrendStyle = (trend) => ({
    color: TREND_COLORS[trend] || '#6c757d',
    fontWeight: 600,
  });

  const getRSIStyle = (rsi) => {
    if (!rsi) return {};
    if (rsi < 30) return { color: '#28a745', fontWeight: 600 };
    if (rsi > 70) return { color: '#dc3545', fontWeight: 600 };
    return {};
  };

  return (
    <>
      <tr className="stock-row">
        <td className="stock-symbol">{stock.symbol}</td>
        <td className="stock-company">{stock.companyName || '-'}</td>
        <td className="stock-price">{formatCurrency(stock.currentPrice)}</td>
        <td className="stock-trend" style={getTrendStyle(stock.trend)}>
          {getTrendIcon(stock.trend)} {stock.trend}
        </td>
        <td className="stock-rr">{formatRiskReward(stock.riskToReward)}</td>
        <td className="stock-success">{stock.successProbability}%</td>
        <td className="stock-rsi" style={getRSIStyle(stock.rsi)}>
          {stock.rsi ? stock.rsi.toFixed(2) : '-'}
        </td>
        <td className="stock-updated">{formatRelativeTime(stock.lastFetched)}</td>
        <td className="stock-actions">
          <Button
            variant="primary"
            size="small"
            loading={isRefetching}
            onClick={handleRefetch}
          >
            Refetch
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </td>
      </tr>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Stock"
        message={`Are you sure you want to delete ${stock.symbol}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
};

export default StockRow;