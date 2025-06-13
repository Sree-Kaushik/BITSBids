const Razorpay = require('razorpay');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PayPal = require('@paypal/checkout-server-sdk');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

class PaymentService {
  constructor() {
    // Razorpay setup
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    // PayPal setup
    const environment = process.env.NODE_ENV === 'production' 
      ? new PayPal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
      : new PayPal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
    
    this.paypalClient = new PayPal.core.PayPalHttpClient(environment);
  }

  // Create payment order
  async createPaymentOrder(orderId, gateway = 'razorpay') {
    try {
      const order = await Order.findById(orderId).populate('item buyer seller');
      if (!order) {
        throw new Error('Order not found');
      }

      let paymentOrder;
      
      switch (gateway) {
        case 'razorpay':
          paymentOrder = await this.createRazorpayOrder(order);
          break;
        case 'stripe':
          paymentOrder = await this.createStripePaymentIntent(order);
          break;
        case 'paypal':
          paymentOrder = await this.createPayPalOrder(order);
          break;
        default:
          throw new Error('Unsupported payment gateway');
      }

      // Save payment record
      const payment = await Payment.create({
        order: orderId,
        amount: order.totalAmount,
        currency: 'INR',
        gateway,
        gatewayOrderId: paymentOrder.id,
        status: 'pending',
        createdAt: new Date()
      });

      return {
        payment,
        gatewayData: paymentOrder
      };

    } catch (error) {
      console.error('Error creating payment order:', error);
      throw error;
    }
  }

  // Razorpay order creation
  async createRazorpayOrder(order) {
    try {
      const options = {
        amount: order.totalAmount * 100, // Amount in paise
        currency: 'INR',
        receipt: `order_${order._id}`,
        notes: {
          orderId: order._id.toString(),
          itemId: order.item._id.toString(),
          buyerId: order.buyer._id.toString(),
          sellerId: order.seller._id.toString()
        }
      };

      const razorpayOrder = await this.razorpay.orders.create(options);
      return razorpayOrder;
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      throw error;
    }
  }

  // Stripe payment intent creation
  async createStripePaymentIntent(order) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: order.totalAmount * 100, // Amount in paise
        currency: 'inr',
        metadata: {
          orderId: order._id.toString(),
          itemId: order.item._id.toString(),
          buyerId: order.buyer._id.toString(),
          sellerId: order.seller._id.toString()
        },
        description: `Payment for ${order.item.title}`,
        receipt_email: order.buyer.email
      });

      return paymentIntent;
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      throw error;
    }
  }

  // PayPal order creation
  async createPayPalOrder(order) {
    try {
      const request = new PayPal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: (order.totalAmount / 75).toFixed(2) // Convert INR to USD (approximate)
          },
          description: `Payment for ${order.item.title}`,
          custom_id: order._id.toString()
        }],
        application_context: {
          return_url: `${process.env.CLIENT_URL}/payment/success`,
          cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
          brand_name: 'BITSBids',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW'
        }
      });

      const response = await this.paypalClient.execute(request);
      return response.result;
    } catch (error) {
      console.error('PayPal order creation failed:', error);
      throw error;
    }
  }

  // Verify payment
  async verifyPayment(paymentId, gatewayData) {
    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      let isValid = false;

      switch (payment.gateway) {
        case 'razorpay':
          isValid = await this.verifyRazorpayPayment(payment, gatewayData);
          break;
        case 'stripe':
          isValid = await this.verifyStripePayment(payment, gatewayData);
          break;
        case 'paypal':
          isValid = await this.verifyPayPalPayment(payment, gatewayData);
          break;
      }

      if (isValid) {
        payment.status = 'completed';
        payment.gatewayPaymentId = gatewayData.paymentId;
        payment.completedAt = new Date();
        await payment.save();

        // Update order status
        await Order.findByIdAndUpdate(payment.order, {
          status: 'paid',
          paidAt: new Date()
        });

        return { success: true, payment };
      } else {
        payment.status = 'failed';
        await payment.save();
        return { success: false, error: 'Payment verification failed' };
      }

    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }

  // Verify Razorpay payment
  async verifyRazorpayPayment(payment, gatewayData) {
    try {
      const crypto = require('crypto');
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = gatewayData;

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      return expectedSignature === razorpay_signature;
    } catch (error) {
      console.error('Razorpay verification error:', error);
      return false;
    }
  }

  // Verify Stripe payment
  async verifyStripePayment(payment, gatewayData) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(gatewayData.paymentIntentId);
      return paymentIntent.status === 'succeeded';
    } catch (error) {
      console.error('Stripe verification error:', error);
      return false;
    }
  }

  // Verify PayPal payment
  async verifyPayPalPayment(payment, gatewayData) {
    try {
      const request = new PayPal.orders.OrdersGetRequest(gatewayData.orderID);
      const response = await this.paypalClient.execute(request);
      return response.result.status === 'COMPLETED';
    } catch (error) {
      console.error('PayPal verification error:', error);
      return false;
    }
  }

  // Process refund
  async processRefund(paymentId, amount, reason) {
    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      let refundResult;

      switch (payment.gateway) {
        case 'razorpay':
          refundResult = await this.processRazorpayRefund(payment, amount, reason);
          break;
        case 'stripe':
          refundResult = await this.processStripeRefund(payment, amount, reason);
          break;
        case 'paypal':
          refundResult = await this.processPayPalRefund(payment, amount, reason);
          break;
      }

      // Create refund record
      const refund = await Payment.create({
        order: payment.order,
        amount: -amount,
        currency: payment.currency,
        gateway: payment.gateway,
        gatewayOrderId: refundResult.id,
        status: 'completed',
        type: 'refund',
        reason,
        parentPayment: paymentId,
        createdAt: new Date()
      });

      return refund;

    } catch (error) {
      console.error('Refund processing error:', error);
      throw error;
    }
  }

  // Process Razorpay refund
  async processRazorpayRefund(payment, amount, reason) {
    try {
      const refund = await this.razorpay.payments.refund(payment.gatewayPaymentId, {
        amount: amount * 100,
        notes: {
          reason,
          refund_type: 'partial'
        }
      });

      return refund;
    } catch (error) {
      console.error('Razorpay refund error:', error);
      throw error;
    }
  }

  // Process Stripe refund
  async processStripeRefund(payment, amount, reason) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: payment.gatewayPaymentId,
        amount: amount * 100,
        reason: 'requested_by_customer',
        metadata: {
          reason
        }
      });

      return refund;
    } catch (error) {
      console.error('Stripe refund error:', error);
      throw error;
    }
  }

  // Get payment analytics
  async getPaymentAnalytics(timeRange = '30d') {
    try {
      const startDate = new Date();
      const days = parseInt(timeRange.replace('d', ''));
      startDate.setDate(startDate.getDate() - days);

      const analytics = await Payment.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            type: { $ne: 'refund' }
          }
        },
        {
          $group: {
            _id: {
              gateway: '$gateway',
              status: '$status'
            },
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]);

      return analytics;
    } catch (error) {
      console.error('Payment analytics error:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
