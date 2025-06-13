const Watchlist = require('../models/Watchlist');
const Item = require('../models/Item');
const { validationResult } = require('express-validator');

// Add item to watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { 
      notifications = {}, 
      notes = '', 
      tags = [], 
      priority = 'medium' 
    } = req.body;

    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user is not the seller
    if (item.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add your own item to watchlist'
      });
    }

    // Check if already in watchlist
    const existingWatchlist = await Watchlist.findOne({
      user: req.user._id,
      item: itemId
    });

    if (existingWatchlist) {
      return res.status(400).json({
        success: false,
        message: 'Item already in watchlist'
      });
    }

    // Create watchlist entry
    const watchlistItem = await Watchlist.create({
      user: req.user._id,
      item: itemId,
      notifications: {
        priceAlert: {
          enabled: notifications.priceAlert?.enabled || false,
          threshold: notifications.priceAlert?.threshold || item.currentPrice
        },
        endingAlert: {
          enabled: notifications.endingAlert?.enabled !== false,
          hoursBeforeEnd: notifications.endingAlert?.hoursBeforeEnd || 24
        },
        outbidAlert: {
          enabled: notifications.outbidAlert?.enabled !== false
        }
      },
      notes,
      tags,
      priority
    });

    await watchlistItem.populate('item', 'title currentPrice auctionEndTime status images seller');

    res.status(201).json({
      success: true,
      message: 'Item added to watchlist',
      data: watchlistItem
    });

  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to watchlist'
    });
  }
};

// Remove item from watchlist
const removeFromWatchlist = async (req, res) => {
  try {
    const { itemId } = req.params;

    const watchlistItem = await Watchlist.findOneAndDelete({
      user: req.user._id,
      item: itemId
    });

    if (!watchlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in watchlist'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from watchlist'
    });

  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from watchlist'
    });
  }
};

// Get user's watchlist
const getUserWatchlist = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      status = 'active',
      priority,
      tags,
      sortBy = 'addedAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = { user: req.user._id };
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get watchlist items
    let watchlistQuery = Watchlist.find(filter)
      .populate({
        path: 'item',
        select: 'title currentPrice startingPrice auctionEndTime status images seller category campus totalBids',
        populate: {
          path: 'seller',
          select: 'firstName lastName'
        }
      })
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const watchlistItems = await watchlistQuery;

    // Filter by item status if specified
    let filteredItems = watchlistItems;
    if (status && status !== 'all') {
      filteredItems = watchlistItems.filter(item => 
        item.item && item.item.status === status
      );
    }

    // Get total count
    const total = await Watchlist.countDocuments(filter);

    // Get watchlist statistics
    const stats = await Watchlist.aggregate([
      { $match: { user: req.user._id } },
      {
        $lookup: {
          from: 'items',
          localField: 'item',
          foreignField: '_id',
          as: 'itemData'
        }
      },
      { $unwind: '$itemData' },
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          activeItems: {
            $sum: { $cond: [{ $eq: ['$itemData.status', 'active'] }, 1, 0] }
          },
          endedItems: {
            $sum: { $cond: [{ $eq: ['$itemData.status', 'ended'] }, 1, 0] }
          },
          totalValue: { $sum: '$itemData.currentPrice' },
          avgPrice: { $avg: '$itemData.currentPrice' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        items: filteredItems,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        stats: stats[0] || {
          totalItems: 0,
          activeItems: 0,
          endedItems: 0,
          totalValue: 0,
          avgPrice: 0
        }
      }
    });

  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching watchlist'
    });
  }
};

// Update watchlist item settings
const updateWatchlistItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { notifications, notes, tags, priority } = req.body;

    const watchlistItem = await Watchlist.findOne({
      user: req.user._id,
      item: itemId
    });

    if (!watchlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in watchlist'
      });
    }

    // Update fields
    if (notifications) {
      watchlistItem.notifications = {
        ...watchlistItem.notifications,
        ...notifications
      };
    }
    if (notes !== undefined) watchlistItem.notes = notes;
    if (tags !== undefined) watchlistItem.tags = tags;
    if (priority !== undefined) watchlistItem.priority = priority;

    await watchlistItem.save();
    await watchlistItem.populate('item', 'title currentPrice auctionEndTime status images');

    res.status(200).json({
      success: true,
      message: 'Watchlist item updated',
      data: watchlistItem
    });

  } catch (error) {
    console.error('Update watchlist item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating watchlist item'
    });
  }
};

// Check if item is in user's watchlist
const checkWatchlistStatus = async (req, res) => {
  try {
    const { itemId } = req.params;

    const watchlistItem = await Watchlist.findOne({
      user: req.user._id,
      item: itemId
    });

    res.status(200).json({
      success: true,
      data: {
        isWatched: !!watchlistItem,
        watchlistItem: watchlistItem || null
      }
    });

  } catch (error) {
    console.error('Check watchlist status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking watchlist status'
    });
  }
};

// Get watchlist tags
const getWatchlistTags = async (req, res) => {
  try {
    const tags = await Watchlist.aggregate([
      { $match: { user: req.user._id } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.status(200).json({
      success: true,
      data: tags.map(tag => ({
        name: tag._id,
        count: tag.count
      }))
    });

  } catch (error) {
    console.error('Get watchlist tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tags'
    });
  }
};

module.exports = {
  addToWatchlist,
  removeFromWatchlist,
  getUserWatchlist,
  updateWatchlistItem,
  checkWatchlistStatus,
  getWatchlistTags
};
