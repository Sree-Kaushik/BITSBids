const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  notifications: {
    priceAlert: {
      enabled: {
        type: Boolean,
        default: false
      },
      threshold: {
        type: Number,
        min: 0
      }
    },
    endingAlert: {
      enabled: {
        type: Boolean,
        default: true
      },
      hoursBeforeEnd: {
        type: Number,
        default: 24,
        min: 1,
        max: 168 // 7 days
      }
    },
    outbidAlert: {
      enabled: {
        type: Boolean,
        default: true
      }
    }
  },
  notes: {
    type: String,
    maxlength: 500
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
});

// Compound index to prevent duplicates and optimize queries
watchlistSchema.index({ user: 1, item: 1 }, { unique: true });
watchlistSchema.index({ user: 1, addedAt: -1 });
watchlistSchema.index({ user: 1, priority: 1 });

module.exports = mongoose.model('Watchlist', watchlistSchema);
