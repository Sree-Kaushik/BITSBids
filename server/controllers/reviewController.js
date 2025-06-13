const Review = require('../models/Review');
const User = require('../models/User');
const Item = require('../models/Item');
const Order = require('../models/Order');
const { validationResult } = require('express-validator');

// Create a new review
const createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      revieweeId,
      itemId,
      orderId,
      rating,
      title,
      comment,
      aspects,
      images = []
    } = req.body;

    // Verify order exists and user is authorized
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is part of this transaction
    const isAuthorized = order.buyer.toString() === req.user._id.toString() || 
                        order.seller.toString() === req.user._id.toString();
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this transaction'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      reviewer: req.user._id,
      reviewee: revieweeId,
      item: itemId,
      order: orderId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already exists for this transaction'
      });
    }

    // Create review
    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: revieweeId,
      item: itemId,
      order: orderId,
      rating,
      title,
      comment,
      aspects,
      images,
      isVerified: order.status === 'completed'
    });

    await review.populate([
      { path: 'reviewer', select: 'firstName lastName avatar campus' },
      { path: 'reviewee', select: 'firstName lastName avatar campus' },
      { path: 'item', select: 'title images category' }
    ]);

    // Update user's average rating
    await updateUserRating(revieweeId);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating review'
    });
  }
};

// Get reviews for a user
const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      rating, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = { reviewee: userId, status: 'approved' };
    if (rating) {
      filter.rating = parseInt(rating, 10);
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find(filter)
      .populate('reviewer', 'firstName lastName avatar campus')
      .populate('item', 'title images category')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Review.countDocuments(filter);

    // Calculate rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { reviewee: mongoose.Types.ObjectId(userId), status: 'approved' } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Calculate average rating and aspects
    const avgStats = await Review.aggregate([
      { $match: { reviewee: mongoose.Types.ObjectId(userId), status: 'approved' } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          avgCommunication: { $avg: '$aspects.communication' },
          avgItemCondition: { $avg: '$aspects.itemCondition' },
          avgDelivery: { $avg: '$aspects.delivery' },
          avgOverall: { $avg: '$aspects.overall' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        stats: {
          ratingDistribution,
          averages: avgStats[0] || {},
          totalReviews: total
        }
      }
    });

  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

// Update review helpful votes
const updateHelpfulVote = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { helpful } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already voted
    const existingVoteIndex = review.helpfulVotes.findIndex(
      vote => vote.user.toString() === req.user._id.toString()
    );

    if (existingVoteIndex !== -1) {
      // Update existing vote
      review.helpfulVotes[existingVoteIndex].helpful = helpful;
    } else {
      // Add new vote
      review.helpfulVotes.push({
        user: req.user._id,
        helpful
      });
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Vote updated successfully',
      data: {
        helpfulScore: review.helpfulScore,
        totalVotes: review.helpfulVotes.length
      }
    });

  } catch (error) {
    console.error('Update helpful vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating vote'
    });
  }
};

// Respond to review (for reviewee)
const respondToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is the reviewee
    if (review.reviewee.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this review'
      });
    }

    review.response = {
      comment,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      data: review
    });

  } catch (error) {
    console.error('Respond to review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while responding to review'
    });
  }
};

// Helper function to update user's average rating
const updateUserRating = async (userId) => {
  try {
    const stats = await Review.aggregate([
      { $match: { reviewee: mongoose.Types.ObjectId(userId), status: 'approved' } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await User.findByIdAndUpdate(userId, {
        'rating.average': stats[0].avgRating,
        'rating.count': stats[0].totalReviews
      });
    }
  } catch (error) {
    console.error('Update user rating error:', error);
  }
};

module.exports = {
  createReview,
  getUserReviews,
  updateHelpfulVote,
  respondToReview
};
