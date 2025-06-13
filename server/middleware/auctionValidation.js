const { body, param, query } = require('express-validator');
const Item = require('../models/Item');

// Validate auction creation
const validateAuctionCreation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,!()]+$/)
    .withMessage('Title contains invalid characters'),

  body('description')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),

  body('category')
    .isIn([
      'Electronics',
      'Books & Study Materials',
      'Fashion & Accessories',
      'Sports & Fitness',
      'Furniture',
      'Vehicles',
      'Services',
      'Others'
    ])
    .withMessage('Please select a valid category'),

  body('condition')
    .isIn(['New', 'Like New', 'Very Good', 'Good', 'Fair', 'Poor'])
    .withMessage('Please select a valid condition'),

  body('startingPrice')
    .isFloat({ min: 1, max: 10000000 })
    .withMessage('Starting price must be between ₹1 and ₹1,00,00,000'),

  body('auctionStartTime')
    .isISO8601()
    .withMessage('Please provide a valid start time')
    .custom((value) => {
      const startTime = new Date(value);
      const now = new Date();
      if (startTime < now) {
        throw new Error('Auction start time must be in the future');
      }
      return true;
    }),

  body('auctionEndTime')
    .isISO8601()
    .withMessage('Please provide a valid end time')
    .custom((value, { req }) => {
      const endTime = new Date(value);
      const startTime = new Date(req.body.auctionStartTime);
      const minDuration = 30 * 60 * 1000; // 30 minutes
      const maxDuration = 30 * 24 * 60 * 60 * 1000; // 30 days

      if (endTime <= startTime) {
        throw new Error('Auction end time must be after start time');
      }

      const duration = endTime - startTime;
      if (duration < minDuration) {
        throw new Error('Auction duration must be at least 30 minutes');
      }

      if (duration > maxDuration) {
        throw new Error('Auction duration cannot exceed 30 days');
      }

      return true;
    }),

  body('images')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Maximum 5 images allowed'),

  body('images.*')
    .optional()
    .isURL()
    .withMessage('Each image must be a valid URL')
];

// Validate auction update
const validateAuctionUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid auction ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),

  // Only allow updates if auction hasn't started
  async (req, res, next) => {
    try {
      const auction = await Item.findById(req.params.id);
      if (!auction) {
        return res.status(404).json({
          success: false,
          message: 'Auction not found'
        });
      }

      if (auction.status !== 'draft') {
        return res.status(400).json({
          success: false,
          message: 'Cannot update auction after it has started'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
];

// Validate bid placement
const validateBidPlacement = [
  param('id')
    .isMongoId()
    .withMessage('Invalid auction ID'),

  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Bid amount must be a positive number')
    .custom(async (value, { req }) => {
      try {
        const auction = await Item.findById(req.params.id);
        if (!auction) {
          throw new Error('Auction not found');
        }

        if (auction.status !== 'active') {
          throw new Error('Auction is not active');
        }

        if (new Date() > auction.auctionEndTime) {
          throw new Error('Auction has ended');
        }

        if (value <= auction.currentPrice) {
          throw new Error(`Bid must be higher than current price of ₹${auction.currentPrice}`);
        }

        // Check minimum increment (₹10 or 1% of current price, whichever is higher)
        const minIncrement = Math.max(10, auction.currentPrice * 0.01);
        if (value < auction.currentPrice + minIncrement) {
          throw new Error(`Minimum bid increment is ₹${Math.ceil(minIncrement)}`);
        }

        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    })
];

// Validate auction query parameters
const validateAuctionQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),

  query('category')
    .optional()
    .isIn([
      'all',
      'Electronics',
      'Books & Study Materials',
      'Fashion & Accessories',
      'Sports & Fitness',
      'Furniture',
      'Vehicles',
      'Services',
      'Others'
    ])
    .withMessage('Invalid category'),

  query('campus')
    .optional()
    .isIn(['all', 'pilani', 'goa', 'hyderabad', 'dubai'])
    .withMessage('Invalid campus'),

  query('status')
    .optional()
    .isIn(['active', 'ended', 'sold', 'draft'])
    .withMessage('Invalid status'),

  query('sortBy')
    .optional()
    .isIn(['createdAt', 'auctionEndTime', 'currentPrice', 'totalBids'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),

  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Search query must be between 2 and 50 characters')
];

// Check auction ownership
const checkAuctionOwnership = async (req, res, next) => {
  try {
    const auction = await Item.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    if (!auction.seller.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action'
      });
    }

    req.auction = auction;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Check if user can bid
const checkBidPermission = async (req, res, next) => {
  try {
    const auction = await Item.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    // Users cannot bid on their own auctions
    if (auction.seller.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Cannot bid on your own auction'
      });
    }

    // Check if auction is active
    if (auction.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Auction is not active'
      });
    }

    // Check if auction has ended
    if (new Date() > auction.auctionEndTime) {
      return res.status(400).json({
        success: false,
        message: 'Auction has ended'
      });
    }

    req.auction = auction;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  validateAuctionCreation,
  validateAuctionUpdate,
  validateBidPlacement,
  validateAuctionQuery,
  checkAuctionOwnership,
  checkBidPermission
};
