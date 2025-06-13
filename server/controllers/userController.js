const User = require('../models/User');
const Item = require('../models/Item');
const Bid = require('../models/Bid');
const { validationResult } = require('express-validator');

// Get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email -phoneNumber');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's items count
    const itemsCount = await Item.countDocuments({ seller: user._id });
    
    // Get user's active bids count
    const activeBidsCount = await Bid.countDocuments({ 
      bidder: user._id, 
      isActive: true 
    });

    // Get user's won auctions count
    const wonAuctionsCount = await Item.countDocuments({ 
      winner: user._id,
      status: 'sold'
    });

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        itemsCount,
        activeBidsCount,
        wonAuctionsCount
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const allowedUpdates = ['firstName', 'lastName', 'phoneNumber', 'avatar'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key) && req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user's items
const getUserItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.params.id || req.user._id;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = { seller: userId };
    if (status) {
      filter.status = status;
    }

    const items = await Item.find(filter)
      .populate('seller', 'firstName lastName bitsId')
      .populate('winner', 'firstName lastName bitsId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Item.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user's bids
const getUserBids = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.params.id || req.user._id;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const bids = await Bid.find({ bidder: userId, isActive: true })
      .populate('item', 'title images currentPrice status auctionEndTime seller')
      .populate('item.seller', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Bid.countDocuments({ bidder: userId, isActive: true });

    res.status(200).json({
      success: true,
      data: bids,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get user bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user's won auctions
const getUserWonAuctions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.params.id || req.user._id;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const wonItems = await Item.find({ 
      winner: userId,
      status: { $in: ['sold', 'ended'] }
    })
      .populate('seller', 'firstName lastName bitsId')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Item.countDocuments({ 
      winner: userId,
      status: { $in: ['sold', 'ended'] }
    });

    res.status(200).json({
      success: true,
      data: wonItems,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get user won auctions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;

    const [
      totalItems,
      activeItems,
      soldItems,
      totalBids,
      wonAuctions,
      totalViews
    ] = await Promise.all([
      Item.countDocuments({ seller: userId }),
      Item.countDocuments({ seller: userId, status: 'active' }),
      Item.countDocuments({ seller: userId, status: 'sold' }),
      Bid.countDocuments({ bidder: userId, isActive: true }),
      Item.countDocuments({ winner: userId, status: 'sold' }),
      Item.aggregate([
        { $match: { seller: userId } },
        { $group: { _id: null, totalViews: { $sum: '$totalViews' } } }
      ])
    ]);

    const stats = {
      totalItems,
      activeItems,
      soldItems,
      totalBids,
      wonAuctions,
      totalViews: totalViews[0]?.totalViews || 0
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete user account (soft delete)
const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if user has active auctions
    const activeItems = await Item.countDocuments({ 
      seller: userId, 
      status: 'active' 
    });

    if (activeItems > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete account with active auctions. Please end or cancel them first.'
      });
    }

    // Soft delete by updating status
    await User.findByIdAndUpdate(userId, {
      isActive: false,
      deletedAt: new Date()
    });

    // Cancel all draft items
    await Item.updateMany(
      { seller: userId, status: 'draft' },
      { status: 'cancelled' }
    );

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete user account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserItems,
  getUserBids,
  getUserWonAuctions,
  getUserStats,
  deleteUserAccount
};
