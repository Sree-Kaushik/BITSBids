import React, { useState } from 'react';
import { useRazorpay } from 'react-razorpay';
import api from '../utils/api';
import { toast } from 'react-toastify';

const PaymentModal = ({ item, isOpen, onClose, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { Razorpay } = useRazorpay();

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Create order
      const orderResponse = await api.post('/payments/create-order', {
        itemId: item._id,
        amount: item.currentPrice
      });

      const { order, key } = orderResponse.data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'BITSBids',
        description: `Payment for ${item.title}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            await api.post('/payments/verify', {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });

            toast.success('Payment successful!');
            onPaymentSuccess();
            onClose();
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: `${item.winner?.firstName} ${item.winner?.lastName}`,
          email: item.winner?.email,
          contact: item.winner?.phoneNumber
        },
        theme: {
          color: '#1a73e8'
        }
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      toast.error('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Complete Payment</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="payment-details">
          <div className="item-summary">
            <h4>{item.title}</h4>
            <p>Final Amount: ₹{item.currentPrice}</p>
          </div>
          
          <div className="payment-info">
            <p>You won this auction! Complete the payment to finalize your purchase.</p>
          </div>
          
          <div className="payment-actions">
            <button 
              className="btn btn-primary"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay ₹${item.currentPrice}`}
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
