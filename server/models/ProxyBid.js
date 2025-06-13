const mongoose = require('mongoose');

const proxyBidSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxAmount: {
    type: Number,
    required: true,
    min: 1
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastBidTime: {
    type: Date,
    default: Date.now
  },
  totalBidsPlaced: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
proxyBidSchema.index({ item: 1, bidder: 1 });
proxyBidSchema.index({ item: 1, isActive: 1, maxAmount: -1 });

module.exports = mongoose.model('ProxyBid', proxyBidSchema);
