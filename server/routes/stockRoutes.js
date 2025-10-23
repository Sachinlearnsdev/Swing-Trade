const express = require('express');
const router = express.Router();
const {
  getStocks,
  refetchStock,
  fetchMultipleStocks,
  deleteStock,
} = require('../controllers/stockController');

router.get('/', getStocks);
router.get('/refetch/:symbol', refetchStock);
router.post('/fetch-multiple', fetchMultipleStocks);
router.delete('/:symbol', deleteStock);

module.exports = router;