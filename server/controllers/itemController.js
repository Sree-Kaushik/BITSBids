const Item = require('../models/Item');
const User = require('../models/User');
const Bid = require('../models/Bid');
const { validationResult } = require('express-validator');

// Get all items with filtering, sorting, and pagination
const getItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      campus,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      seller,
      minPrice,
      maxPrice,
      condition
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (campus && campus !== 'all') {
      filter.campus = campus;
    }
    
    if (status) {
      filter.status = status;
    } else {
      // Default to active items for public viewing
      filter.status = { $in: ['active', 'ended'] };
    }
    
    if (seller) {
      filter.seller = seller;
    }
    
    if (condition && condition !== 'all') {
      filter.condition = condition;
    }
    
    if (minPrice || maxPrice) {
      filter.currentPrice = {};
      if (minPrice) filter.currentPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.currentPrice.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with population
    const items = await Item.find(filter)
      .populate('seller', 'firstName lastName bitsId campus')
      .populate('winner', 'firstName lastName bitsId')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await Item.countDocuments(filter);

    // Add time remaining for active auctions
    const now = new Date();
    const enrichedItems = items.map(item => {
      const timeRemaining = new Date(item.auctionEndTime).getTime() - now.getTime();
      return {
        ...item,
        timeRemaining: Math.max(0, timeRemaining),
        isEndingSoon: timeRemaining < 60 * 60 * 1000 && timeRemaining > 0,
        isEndingVerySoon: timeRemaining < 5 * 60 * 1000 && timeRemaining > 0
      };
    });

    res.status(200).json({
      success: true,
      data: enrichedItems,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      filters: {
        category,
        campus,
        status,
        search,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching items'
    });
  }
};

// Get single item by ID with detailed information
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('seller', 'firstName lastName bitsId campus year branch phoneNumber')
      .populate('winner', 'firstName lastName bitsId')
      .populate('watchers', 'firstName lastName bitsId');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Increment view count if user is not the seller
    if (!req.user || !req.user._id.equals(item.seller._id)) {
      await Item.findByIdAndUpdate(req.params.id, {
        $inc: { totalViews: 1 }
      });
    }

    // Get recent bids for this item
    const recentBids = await Bid.find({ item: req.params.id, isActive: true })
      .populate('bidder', 'firstName lastName bitsId')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate time remaining
    const now = new Date();
    const timeRemaining = new Date(item.auctionEndTime).getTime() - now.getTime();

    const enrichedItem = {
      ...item.toObject(),
      timeRemaining: Math.max(0, timeRemaining),
      isEndingSoon: timeRemaining < 60 * 60 * 1000 && timeRemaining > 0,
      isEndingVerySoon: timeRemaining < 5 * 60 * 1000 && timeRemaining > 0,
      recentBids
    };

    res.status(200).json({
      success: true,
      data: enrichedItem
    });
  } catch (error) {
    console.error('Get item by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching item'
    });
  }
};

// Create new item
const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      condition,
      startingPrice,
      auctionStartTime,
      auctionEndTime,
      location,
      images = []
    } = req.body;

    // Additional server-side validation
    const startTime = new Date(auctionStartTime);
    const endTime = new Date(auctionEndTime);
    const now = new Date();

    // Determine initial status
    let status = 'draft';
    if (startTime <= now) {
      status = 'active';
    }

    const item = await Item.create({
      title: title.trim(),
      description: description.trim(),
      category,
      condition,
      startingPrice: parseFloat(startingPrice),
      currentPrice: parseFloat(startingPrice),
      auctionStartTime: startTime,
      auctionEndTime: endTime,
      location: location.trim(),
      images,
      seller: req.user._id,
      campus: req.user.campus,
      status
    });

    await item.populate('seller', 'firstName lastName bitsId campus');

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: item
    });
  } catch (error) {
    console.error('Create item error:', error);
    
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
      message: 'Server error while creating item'
    });
  }
};

// Update item
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user is the seller
    if (!item.seller.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    // Check if auction has started or has bids
    if (item.status !== 'draft' && item.totalBids > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update item after auction has started or received bids'
      });
    }

    // Validate auction times if being updated
    if (req.body.auctionStartTime || req.body.auctionEndTime) {
      const startTime = new Date(req.body.auctionStartTime || item.auctionStartTime);
      const endTime = new Date(req.body.auctionEndTime || item.auctionEndTime);
      const now = new Date();

      if (startTime < new Date(now.getTime() + 5 * 60 * 1000)) {
        return res.status(400).json({
          success: false,
          message: 'Auction start time must be at least 5 minutes from now'
        });
      }

      if (endTime <= startTime) {
        return res.status(400).json({
          success: false,
          message: 'Auction end time must be after start time'
        });
      }
    }

    const allowedUpdates = [
      'title', 'description', 'category', 'condition', 
      'startingPrice', 'auctionStartTime', 'auctionEndTime', 
      'location', 'images'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Update currentPrice if startingPrice is changed
    if (updates.startingPrice && item.totalBids === 0) {
      updates.currentPrice = updates.startingPrice;
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('seller', 'firstName lastName bitsId campus');

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating item'
    });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user is the seller
    if (!item.seller.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    // Don't allow deletion if auction has started or has bids
    if (item.status !== 'draft' || item.totalBids > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete item after auction has started or received bids'
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting item'
    });
  }
};

// Watch/Unwatch item
const watchItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.user._id;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Don't allow watching own items
    if (item.seller.equals(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot watch your own item'
      });
    }

    const isWatching = item.watchers.includes(userId);
    
    if (isWatching) {
      // Remove from watchers
      await Item.findByIdAndUpdate(itemId, {
        $pull: { watchers: userId }
      });
    } else {
      // Add to watchers
      await Item.findByIdAndUpdate(itemId, {
        $addToSet: { watchers: userId }
      });
    }

    res.status(200).json({
      success: true,
      message: isWatching ? 'Removed from watchlist' : 'Added to watchlist',
      isWatching: !isWatching
    });
  } catch (error) {
    console.error('Watch item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user's watched items
const getUserWatchedItems = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const items = await Item.find({ watchers: userId })
      .populate('seller', 'firstName lastName bitsId campus')
      .populate('winner', 'firstName lastName bitsId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Item.countDocuments({ watchers: userId });

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
    console.error('Get watched items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get active auctions with real-time data
const getActiveAuctions = async (req, res) => {
  try {
    const { campus, category, limit = 20 } = req.query;
    const filter = { status: 'active' };
    
    if (campus && campus !== 'all') {
      filter.campus = campus;
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }

    const auctions = await Item.find(filter)
      .populate('seller', 'firstName lastName bitsId campus')
      .populate('winner', 'firstName lastName bitsId')
      .sort({ auctionEndTime: 1 })
      .limit(parseInt(limit));

    // Add time remaining and urgency indicators
    const now = new Date();
    const enrichedAuctions = auctions.map(auction => {
      const timeRemaining = new Date(auction.auctionEndTime).getTime() - now.getTime();
      return {
        ...auction.toObject(),
        timeRemaining: Math.max(0, timeRemaining),
        isEndingSoon: timeRemaining < 60 * 60 * 1000 && timeRemaining > 0,
        isEndingVerySoon: timeRemaining < 5 * 60 * 1000 && timeRemaining > 0
      };
    });
    
    res.status(200).json({
      success: true,
      data: enrichedAuctions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get active auctions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching active auctions'
    });
  }
};

// Search items
const searchItems = async (req, res) => {
  try {
    const { q, category, campus, minPrice, maxPrice, condition } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const filter = {
      status: { $in: ['active', 'ended'] },
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ]
    };

    if (category && category !== 'all') filter.category = category;
    if (campus && campus !== 'all') filter.campus = campus;
    if (condition && condition !== 'all') filter.condition = condition;
    
    if (minPrice || maxPrice) {
      filter.currentPrice = {};
      if (minPrice) filter.currentPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.currentPrice.$lte = parseFloat(maxPrice);
    }

    const items = await Item.find(filter)
      .populate('seller', 'firstName lastName bitsId campus')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: items,
      query: q,
      count: items.length
    });
  } catch (error) {
    console.error('Search items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching items'
    });
  }
};

// Get items by category
const getItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12, campus, status = 'active' } = req.query;

    const filter = { category, status };
    if (campus && campus !== 'all') {
      filter.campus = campus;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const items = await Item.find(filter)
      .populate('seller', 'firstName lastName bitsId campus')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Item.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: items,
      category,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get items by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching items by category'
    });
  }
};

// Get items by campus
const getItemsByCampus = async (req, res) => {
  try {
    const { campus } = req.params;
    const { page = 1, limit = 12, category, status = 'active' } = req.query;

    const filter = { campus, status };
    if (category && category !== 'all') {
      filter.category = category;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const items = await Item.find(filter)
      .populate('seller', 'firstName lastName bitsId campus')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Item.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: items,
      campus,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get items by campus error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching items by campus'
    });
  }
};

// Get user's items
const getUserItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user._id;

    const filter = { seller: userId };
    if (status) {
      filter.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const items = await Item.find(filter)
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
      message: 'Server error while fetching user items'
    });
  }
};

module.exports = {
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
};
