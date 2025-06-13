const express = require('express');
const { body } = require('express-validator');
const {
  getUserProfile,
  updateUserProfile,
  getUserItems,
  getUserBids,
  getUserWonAuctions,
  getUserStats,
  deleteUserAccount
} = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules for profile update
const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phoneNumber')
    .optional()
    .matches(/^[6-9][0-9]{9}$/)
    .withMessage('Please provide a valid 10-digit Indian phone number')
];

// Public routes
router.get('/profile/:id', getUserProfile);

// Protected routes
router.put('/profile', authMiddleware, updateProfileValidation, updateUserProfile);
router.get('/items', authMiddleware, getUserItems);
router.get('/items/:id', getUserItems);
router.get('/bids', authMiddleware, getUserBids);
router.get('/bids/:id', getUserBids);
router.get('/won-auctions', authMiddleware, getUserWonAuctions);
router.get('/won-auctions/:id', getUserWonAuctions);
router.get('/stats', authMiddleware, getUserStats);
router.get('/stats/:id', getUserStats);
router.delete('/account', authMiddleware, deleteUserAccount);

module.exports = router;
