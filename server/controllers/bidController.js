const Bid = require('../models/Bid');
const Item = require('../models/Item');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Place a new bid
const placeBid = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { itemId, amount } = req.body;
    const bidderId = req.user._id;

    // Get the item
    const item = await Item.findById(itemId).populate('seller');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if auction is active
    const now = new Date();
    if (item.status !== 'active' || now < item.auctionStartTime || now > item.auctionEndTime) {
      return res.status(400).json({
        success: false,
        message: 'Auction is not currently active'
      });
    }

    // Check if bidder is not the seller
    if (item.seller._id.equals(bidderId)) {
      return res.status(400).json({
        success: false,
        message: 'Sellers cannot bid on their own items'
      });
    }

    // Check if bid amount is higher than current price
    if (amount <= item.currentPrice) {
      return res.status(400).json({
        success: false,
        message: `Bid must be higher than current price of ₹${item.currentPrice}`
      });
    }

    // Create the bid
    const bid = await Bid.create({
      item: itemId,
      bidder: bidderId,
      amount,
      bidTime: new Date()
    });

    // Update item's current price and bid count
    await Item.findByIdAndUpdate(itemId, {
      currentPrice: amount,
      $inc: { totalBids: 1 }
    });

    // Mark previous bids as not winning
    await Bid.updateMany(
      { item: itemId, _id: { $ne: bid._id } },
      { isWinning: false }
    );

    // Mark this bid as winning
    bid.isWinning = true;
    await bid.save();

    // Update user's total bids
    await User.findByIdAndUpdate(bidderId, {
      $inc: { totalBids: 1 }
    });

    await bid.populate('bidder', 'firstName lastName bitsId');

    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      data: bid
    });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while placing bid'
    });
  }
};

// Get bids for an item
const getItemBids = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const bids = await Bid.find({ item: itemId, isActive: true })
      .populate('bidder', 'firstName lastName bitsId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Bid.countDocuments({ item: itemId, isActive: true });

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
    console.error('Get item bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bids'
    });
  }
};

// Get user's bids
const getUserBids = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const bids = await Bid.find({ bidder: userId, isActive: true })
      .populate('item', 'title images currentPrice status auctionEndTime')
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
      message: 'Server error while fetching user bids'
    });
  }
};

module.exports = {
  placeBid,
  getItemBids,
  getUserBids
};
