import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const RealTimeBidding = ({ itemId, currentPrice, minimumIncrement = 50, auctionEndTime }) => {
  const { user, isAuthenticated } = useAuth();
  const { socket } = useSocket();
  const [bidAmount, setBidAmount] = useState(currentPrice + minimumIncrement);
  const [bidHistory, setBidHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [highestBidder, setHighestBidder] = useState(null);
  const [proxyBidAmount, setProxyBidAmount] = useState('');
  const [isProxyBidding, setIsProxyBidding] = useState(false);
  const bidInputRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (socket) {
      // Join auction room
      socket.emit('join-auction', itemId);

      // Listen for bid updates
      socket.on('bid-update', handleBidUpdate);
      socket.on('auction-ending-soon', handleAuctionEndingSoon);
      socket.on('auction-finished', handleAuctionFinished);

      return () => {
        socket.off('bid-update');
        socket.off('auction-ending-soon');
        socket.off('auction-finished');
      };
    }
  }, [socket, itemId]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(auctionEndTime).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        setTimeRemaining(difference);
      } else {
        setTimeRemaining(0);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionEndTime]);

  const handleBidUpdate = (bidData) => {
    setBidHistory(prev => [bidData, ...prev]);
    setBidAmount(bidData.amount + minimumIncrement);
    setHighestBidder(bidData.bidder);
    
    // Play notification sound
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }

    // Show notification if user was outbid
    if (user && bidData.previousBidder === user._id) {
      toast.warning(`You've been outbid! New highest bid: ₹${bidData.amount.toLocaleString()}`);
    }
  };

  const handleAuctionEndingSoon = (data) => {
    toast.warning(`Auction ending in ${Math.floor(data.timeRemaining / 60000)} minutes!`, {
      autoClose: 10000
    });
  };

  const handleAuctionFinished = (data) => {
    toast.info('Auction has ended!');
    if (data.winner === user?._id) {
      toast.success('Congratulations! You won the auction!');
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to place a bid');
      return;
    }

    if (bidAmount <= currentPrice) {
      toast.error(`Bid must be higher than current price of ₹${currentPrice.toLocaleString()}`);
      return;
    }

    if (bidAmount < currentPrice + minimumIncrement) {
      toast.error(`Minimum bid increment is ₹${minimumIncrement}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`/api/bids/${itemId}`, {
        amount: bidAmount,
        isProxyBid: isProxyBidding,
        maxAmount: proxyBidAmount || bidAmount
      });

      // Emit real-time bid update
      socket.emit('new-bid', {
        itemId,
        amount: bidAmount,
        bidder: user._id,
        bidderName: `${user.firstName} ${user.lastName}`,
        timestamp: new Date(),
        previousBidder: highestBidder
      });

      toast.success('Bid placed successfully!');
      setBidAmount(bidAmount + minimumIncrement);
      
      if (bidInputRef.current) {
        bidInputRef.current.focus();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickBid = (increment) => {
    setBidAmount(currentPrice + increment);
  };

  const formatTime = (milliseconds) => {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const isEndingSoon = timeRemaining < 300000; // 5 minutes
  const isEndingVerySoon = timeRemaining < 60000; // 1 minute

  return (
    <div className="real-time-bidding">
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/bid-notification.mp3" type="audio/mpeg" />
      </audio>

      {/* Auction Timer */}
      <div className={`auction-timer ${
        timeRemaining === 0 ? 'timer-ended' :
        isEndingVerySoon ? 'timer-ending-very-soon' :
        isEndingSoon ? 'timer-ending-soon' : 'timer-active'
      }`}>
        <div className="timer-content">
          <span className="timer-label">
            {timeRemaining === 0 ? 'Auction Ended' : 'Time Remaining:'}
          </span>
          <span className="timer-value">
            {timeRemaining > 0 ? formatTime(timeRemaining) : '00:00:00'}
            {isEndingVerySoon && timeRemaining > 0 && (
              <span className="timer-pulse">⚡</span>
            )}
          </span>
        </div>
      </div>

      {/* Current Price Display */}
      <div className="current-price-display">
        <div className="price-section">
          <span className="label">Current Highest Bid</span>
          <span className="price">₹{currentPrice.toLocaleString()}</span>
          {highestBidder && (
            <span className="highest-bidder">
              Leading: {highestBidder.firstName} {highestBidder.lastName.charAt(0)}.
            </span>
          )}
        </div>
      </div>

      {/* Bidding Form */}
      {timeRemaining > 0 && isAuthenticated ? (
        <div className="bid-section">
          <h3>Place Your Bid</h3>
          
          {/* Quick Bid Buttons */}
          <div className="quick-bid-buttons">
            <span>Quick Bid:</span>
            {[minimumIncrement, minimumIncrement * 2, minimumIncrement * 5, minimumIncrement * 10].map((increment) => (
              <button
                key={increment}
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickBid(increment)}
              >
                +₹{increment}
              </button>
            ))}
          </div>

          <form onSubmit={handleBidSubmit} className="bid-form">
            <div className="bid-input-group">
              <input
                ref={bidInputRef}
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                min={currentPrice + minimumIncrement}
                step={minimumIncrement}
                className="form-control"
                placeholder={`Minimum: ₹${(currentPrice + minimumIncrement).toLocaleString()}`}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || bidAmount <= currentPrice}
              >
                {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
              </button>
            </div>
          </form>

          {/* Proxy Bidding */}
          <div className="proxy-bidding-section">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={isProxyBidding}
                onChange={(e) => setIsProxyBidding(e.target.checked)}
              />
              <span className="checkmark"></span>
              Enable Proxy Bidding (Auto-bid up to maximum)
            </label>
            
            {isProxyBidding && (
              <input
                type="number"
                value={proxyBidAmount}
                onChange={(e) => setProxyBidAmount(e.target.value)}
                placeholder="Maximum bid amount"
                className="form-control"
                min={bidAmount}
              />
            )}
          </div>

          <div className="bid-info">
            <p><strong>Minimum increment:</strong> ₹{minimumIncrement.toLocaleString()}</p>
            <p><strong>Your next bid:</strong> ₹{bidAmount.toLocaleString()}</p>
          </div>
        </div>
      ) : !isAuthenticated ? (
        <div className="auth-prompt">
          <p>Please <a href="/login">login</a> to place bids</p>
        </div>
      ) : (
        <div className="auction-ended">
          <h3>Auction Ended</h3>
          <p>This auction has concluded.</p>
        </div>
      )}

      {/* Live Bid History */}
      <div className="bid-history">
        <h3>Live Bid History</h3>
        <div className="bids-list">
          {bidHistory.length > 0 ? (
            bidHistory.slice(0, 10).map((bid, index) => (
              <div key={index} className="bid-item">
                <div className="bid-info">
                  <span className="bidder-name">
                    {bid.bidderName}
                    {bid.bidder === user?._id && (
                      <span className="winning-badge">You</span>
                    )}
                  </span>
                  <span className="bid-time">
                    {new Date(bid.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <span className="bid-amount">₹{bid.amount.toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p>No bids yet. Be the first to bid!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeBidding;
