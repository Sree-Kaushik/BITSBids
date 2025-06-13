const express = require('express');
const { body } = require('express-validator');
const {
  placeBid,
  getItemBids,
  getUserBids
} = require('../controllers/bidController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const bidValidation = [
  body('itemId').isMongoId().withMessage('Valid item ID is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Bid amount must be at least ₹1')
];

// Routes
router.post('/', authMiddleware, bidValidation, placeBid);
router.get('/item/:itemId', getItemBids);
router.get('/user/my-bids', authMiddleware, getUserBids);

module.exports = router;
