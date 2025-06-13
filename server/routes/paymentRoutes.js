const express = require('express');
const paymentService = require('../services/paymentService');
const { authMiddleware } = require('../middleware/authMiddleware');
const Item = require('../models/Item');
const Payment = require('../models/Payment');

const router = express.Router();

// Create payment order
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { itemId, amount } = req.body;

    // Verify item exists and user is winner
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (!item.winner || !item.winner.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to pay for this item'
      });
    }

    const receipt = `item_${itemId}_${Date.now()}`;
    const result = await paymentService.createOrder(amount, 'INR', receipt);

    if (result.success) {
      // Save payment record
      await Payment.create({
        orderId: result.order.id,
        itemId,
        userId: req.user.id,
        amount,
        status: 'pending'
      });

      res.status(200).json({
        success: true,
        order: result.order,
        key: process.env.RAZORPAY_KEY_ID
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create payment order'
      });
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Verify payment
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;

    const isValid = paymentService.verifyPayment(paymentId, orderId, signature);

    if (isValid) {
      // Update payment status
      await Payment.findOneAndUpdate(
        { orderId },
        { 
          paymentId,
          signature,
          status: 'completed',
          completedAt: new Date()
        }
      );

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
