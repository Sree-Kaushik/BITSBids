const express = require('express');
const { body } = require('express-validator');
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  watchItem,
  getUserWatchedItems,
  getActiveAuctions,
  searchItems,
  getItemsByCategory,
  getItemsByCampus,
  getUserItems
} = require('../controllers/itemController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Enhanced validation rules for item creation
const itemValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('category')
    .isIn(['Electronics', 'Books', 'Clothing', 'Sports', 'Furniture', 'Accessories', 'Vehicles', 'Services', 'Others'])
    .withMessage('Valid category is required'),
  
  body('condition')
    .isIn(['New', 'Like New', 'Good', 'Fair', 'Poor'])
    .withMessage('Valid condition is required'),
  
  body('startingPrice')
    .isFloat({ min: 1 })
    .withMessage('Starting price must be at least ₹1'),
  
  body('auctionStartTime')
    .isISO8601()
    .withMessage('Valid auction start time is required')
    .custom((value, { req }) => {
      const startTime = new Date(value);
      const now = new Date();
      const minStartTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
      
      if (startTime < minStartTime) {
        throw new Error('Auction start time must be at least 5 minutes from now');
      }
      return true;
    }),
  
  body('auctionEndTime')
    .isISO8601()
    .withMessage('Valid auction end time is required')
    .custom((value, { req }) => {
      const endTime = new Date(value);
      const startTime = new Date(req.body.auctionStartTime);
      const minDuration = 30 * 60 * 1000; // 30 minutes minimum
      const maxDuration = 30 * 24 * 60 * 60 * 1000; // 30 days maximum
      
      if (endTime <= startTime) {
        throw new Error('Auction end time must be after start time');
      }
      
      const duration = endTime.getTime() - startTime.getTime();
      if (duration < minDuration) {
        throw new Error('Auction duration must be at least 30 minutes');
      }
      
      if (duration > maxDuration) {
        throw new Error('Auction duration cannot exceed 30 days');
      }
      
      return true;
    }),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Location must be between 3 and 200 characters')
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Public routes
router.get('/', getItems);
router.get('/search', searchItems);
router.get('/category/:category', getItemsByCategory);
router.get('/campus/:campus', getItemsByCampus);
router.get('/active', getActiveAuctions);
router.get('/:id', getItemById);

// Protected routes
router.get('/user/watched', authMiddleware, getUserWatchedItems);
router.get('/user/my-items', authMiddleware, getUserItems);
router.post('/', authMiddleware, itemValidation, handleValidationErrors, createItem);
router.put('/:id', authMiddleware, updateItem);
router.delete('/:id', authMiddleware, deleteItem);
router.post('/:id/watch', authMiddleware, watchItem);

module.exports = router;
