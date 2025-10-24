import React from 'react';
import { formatCurrency, formatLargeNumber, formatDateTime, getTrendIcon } from '../../utils/formatters';
import { TREND_COLORS } from '../../utils/constants';
import Button from '../common/Button';
import './StockDetails.css';

/**
 * Stock details modal/drawer component
 * @param {Object} props - Component props
 * @param {Object} props.stock - Stock data
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 */
const StockDetails = ({ stock, isOpen, onClose }) => {
  if (!isOpen || !stock) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="stock-details-overlay" onClick={handleBackdropClick}>
      <div className="stock-details-modal">
        <div className="stock-details-header">
          <div>
            <h2 className="stock-details-symbol">{stock.symbol}</h2>
            <p className="stock-details-company">{stock.companyName}</p>
          </div>
          <button className="stock-details-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="stock-details-body">
          <div className="details-section">
            <h3>Price Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Current Price</span>
                <span className="detail-value">{formatCurrency(stock.currentPrice)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Entry Price</span>
                <span className="detail-value">{formatCurrency(stock.entryPrice)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Stop Loss</span>
                <span className="detail-value">{formatCurrency(stock.stopLoss)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Target Price</span>
                <span className="detail-value">{formatCurrency(stock.targetPrice)}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Trading Metrics</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Trend</span>
                <span className="detail-value" style={{ color: TREND_COLORS[stock.trend] }}>
                  {getTrendIcon(stock.trend)} {stock.trend}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">R:R Ratio</span>
                <span className="detail-value">{stock.riskToReward?.toFixed(2)}:1</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Success Probability</span>
                <span className="detail-value">{stock.successProbability}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Volume</span>
                <span className="detail-value">{formatLargeNumber(stock.volume)}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Technical Indicators</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">EMA 20</span>
                <span className="detail-value">{stock.ema20 ? formatCurrency(stock.ema20) : 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">EMA 50</span>
                <span className="detail-value">{stock.ema50 ? formatCurrency(stock.ema50) : 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">RSI</span>
                <span className="detail-value">{stock.rsi ? stock.rsi.toFixed(2) : 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Market Cap</span>
                <span className="detail-value">{formatLargeNumber(stock.marketCap)}</span>
              </div>
            </div>
          </div>

          {stock.macd && (
            <div className="details-section">
              <h3>MACD</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">MACD</span>
                  <span className="detail-value">{stock.macd.macd?.toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Signal</span>
                  <span className="detail-value">{stock.macd.signal?.toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Histogram</span>
                  <span className="detail-value">{stock.macd.histogram?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="details-section">
            <h3>Additional Info</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Last Updated</span>
                <span className="detail-value">{formatDateTime(stock.lastFetched)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stock-details-footer">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;