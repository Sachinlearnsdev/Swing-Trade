const express = require('express');
const router = express.Router();
const {
  createWatchlist,
  getWatchlists,
  getWatchlist,
  updateWatchlist,
  refetchWatchlist,
  deleteWatchlist,
} = require('../controllers/watchlistController');

router.post('/', createWatchlist);
router.get('/', getWatchlists);
router.get('/:id', getWatchlist);
router.put('/:id', updateWatchlist);
router.get('/:id/refetch', refetchWatchlist);
router.delete('/:id', deleteWatchlist);

module.exports = router;