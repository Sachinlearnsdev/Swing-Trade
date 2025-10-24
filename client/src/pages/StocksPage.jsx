import React, { useState } from 'react';
import useStocks from '../hooks/useStocks';
import StockTable from '../components/stocks/StockTable';
import StockFilters from '../components/stocks/StockFilters';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import { exportStocksToCSV } from '../utils/csvExport';
import './StocksPage.css';

/**
 * Stocks page component
 */
const StocksPage = () => {
  const {
    stocks,
    loading,
    error,
    refetchStock,
    deleteStock,
    applyFilters,
    resetFilters,
    clearError,
  } = useStocks();

  const [showFilters, setShowFilters] = useState(true);

  const handleDownloadCSV = () => {
    if (stocks.length === 0) {
      alert('No stocks to export');
      return;
    }
    exportStocksToCSV(stocks, `stocks_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="stocks-page">
      <div className="page-header">
        <div>
          <h1>All Stocks</h1>
          <p>{stocks.length} stocks found</p>
        </div>
        <div className="page-actions">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
          <Button
            variant="success"
            onClick={handleDownloadCSV}
            disabled={stocks.length === 0}
          >
            📥 Download CSV
          </Button>
        </div>
      </div>

      {error && <ErrorMessage error={error} onClose={clearError} />}

      {showFilters && (
        <StockFilters
          onFilterChange={applyFilters}
          onReset={resetFilters}
        />
      )}

      {loading ? (
        <Loading message="Loading stocks..." />
      ) : (
        <StockTable
          stocks={stocks}
          onRefetch={refetchStock}
          onDelete={deleteStock}
        />
      )}
    </div>
  );
};

export default StocksPage;