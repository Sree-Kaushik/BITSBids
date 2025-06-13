const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Item title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Item description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Electronics',
      'Books',
      'Clothing',
      'Sports',
      'Furniture',
      'Accessories',
      'Vehicles',
      'Services',
      'Others'
    ]
  },
  condition: {
    type: String,
    required: [true, 'Item condition is required'],
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }],
  startingPrice: {
    type: Number,
    required: [true, 'Starting price is required'],
    min: [1, 'Starting price must be at least ₹1']
  },
  currentPrice: {
    type: Number,
    default: function() {
      return this.startingPrice;
    }
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller is required']
  },
  campus: {
    type: String,
    required: [true, 'Campus is required'],
    enum: ['Pilani', 'Goa', 'Hyderabad', 'Dubai']
  },
  auctionStartTime: {
    type: Date,
    required: [true, 'Auction start time is required']
  },
  auctionEndTime: {
    type: Date,
    required: [true, 'Auction end time is required']
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'ended', 'sold', 'cancelled'],
    default: 'draft'
  },
  totalBids: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },
  watchers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
ItemSchema.index({ status: 1, campus: 1, category: 1 });
ItemSchema.index({ seller: 1, status: 1 });
ItemSchema.index({ auctionEndTime: 1, status: 1 });

module.exports = mongoose.model('Item', ItemSchema);
