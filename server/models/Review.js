const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  aspects: {
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    itemCondition: {
      type: Number,
      min: 1,
      max: 5
    },
    delivery: {
      type: Number,
      min: 1,
      max: 5
    },
    overall: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  images: [{
    type: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulVotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    helpful: {
      type: Boolean,
      default: true
    }
  }],
  response: {
    comment: String,
    createdAt: Date,
    updatedAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries
reviewSchema.index({ reviewee: 1, createdAt: -1 });
reviewSchema.index({ item: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

// Calculate helpful score
reviewSchema.virtual('helpfulScore').get(function() {
  if (this.helpfulVotes.length === 0) return 0;
  const helpful = this.helpfulVotes.filter(vote => vote.helpful).length;
  return (helpful / this.helpfulVotes.length) * 100;
});

// Prevent self-reviews
reviewSchema.pre('save', function(next) {
  if (this.reviewer.toString() === this.reviewee.toString()) {
    next(new Error('Cannot review yourself'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Review', reviewSchema);
