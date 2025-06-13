import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const MyBids = () => {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchMyBids();
  }, [filter]);

  const fetchMyBids = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock bids data
      const mockBids = [
        {
          id: 1,
          itemId: 'ps5-123',
          itemTitle: 'PlayStation 5 Console',
          itemImage: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21',
          seller: { firstName: 'Ananya', lastName: 'Gupta' },
          myBid: 35000,
          currentPrice: 36500,
          startingPrice: 30000,
          status: 'outbid',
          bidTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
          auctionEndTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
          totalBids: 42,
          isProxyBid: false,
          maxProxyAmount: null
        },
        {
          id: 2,
          itemId: 'mbp-456',
          itemTitle: 'MacBook Pro M3 Max 16-inch',
          itemImage: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=400&hei=300&fmt=jpeg&qlt=90&.v=1697311054290',
          seller: { firstName: 'Arjun', lastName: 'Sharma' },
          myBid: 185000,
          currentPrice: 185000,
          startingPrice: 150000,
          status: 'winning',
          bidTime: new Date(Date.now() - 30 * 60 * 1000),
          auctionEndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          totalBids: 23,
          isProxyBid: true,
          maxProxyAmount: 200000
        },
        {
          id: 3,
          itemId: 'books-789',
          itemTitle: 'Engineering Textbooks Bundle',
          itemImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
          seller: { firstName: 'Sneha', lastName: 'Reddy' },
          myBid: 4500,
          currentPrice: 4500,
          startingPrice: 3000,
          status: 'won',
          bidTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          auctionEndTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
          totalBids: 12,
          isProxyBid: false,
          maxProxyAmount: null,
          wonAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
        },
        {
          id: 4,
          itemId: 'desk-101',
          itemTitle: 'Study Desk & Chair Set',
          itemImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          seller: { firstName: 'Karan', lastName: 'Joshi' },
          myBid: 8500,
          currentPrice: 9200,
          startingPrice: 6000,
          status: 'lost',
          bidTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          auctionEndTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          totalBids: 15,
          isProxyBid: false,
          maxProxyAmount: null,
          winner: 'Vikram S.'
        },
        {
          id: 5,
          itemId: 'phone-202',
          itemTitle: 'iPhone 14 Pro 128GB',
          itemImage: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-deeppurple?wid=400&hei=300&fmt=jpeg&qlt=90&.v=1663703841896',
          seller: { firstName: 'Rahul', lastName: 'Verma' },
          myBid: 65000,
          currentPrice: 67500,
          startingPrice: 55000,
          status: 'active',
          bidTime: new Date(Date.now() - 45 * 60 * 1000),
          auctionEndTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          totalBids: 28,
          isProxyBid: true,
          maxProxyAmount: 75000
        }
      ];

      // Apply filters
      let filteredBids = mockBids;
      if (filter !== 'all') {
        filteredBids = mockBids.filter(bid => bid.status === filter);
      }

      setBids(filteredBids);
      
      // Calculate stats
      setStats({
        total: mockBids.length,
        winning: mockBids.filter(b => b.status === 'winning').length,
        won: mockBids.filter(b => b.status === 'won').length,
        lost: mockBids.filter(b => b.status === 'lost').length,
        totalSpent: mockBids.filter(b => b.status === 'won').reduce((sum, b) => sum + b.myBid, 0),
        activeProxyBids: mockBids.filter(b => b.isProxyBid && ['winning', 'outbid', 'active'].includes(b.status)).length
      });

    } catch (error) {
      toast.error('Failed to load bids');
    } finally {
      setLoading(false);
    }
  };

  const handleIncreaseBid = async (bidId, newAmount) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBids(prev => prev.map(bid => 
        bid.id === bidId 
          ? { ...bid, myBid: newAmount, currentPrice: newAmount, status: 'winning' }
          : bid
      ));
      toast.success('Bid increased successfully!');
    } catch (error) {
      toast.error('Failed to increase bid');
    }
  };

  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const BidCard = ({ bid }) => (
    <div className={`my-bid-card ${bid.status}`}>
      <div className="bid-image-container">
        <img src={bid.itemImage} alt={bid.itemTitle} className="bid-item-image" />
        <div className="bid-overlay">
          <span className={`bid-status-badge ${bid.status}`}>
            {bid.status === 'winning' && '🏆 Winning'}
            {bid.status === 'outbid' && '⚠️ Outbid'}
            {bid.status === 'won' && '🎉 Won'}
            {bid.status === 'lost' && '😞 Lost'}
            {bid.status === 'active' && '🔴 Active'}
          </span>
          
          {bid.isProxyBid && (
            <span className="proxy-badge">🤖 Proxy</span>
          )}
        </div>
      </div>
      
      <div className="bid-content">
        <div className="bid-header">
          <h3 className="bid-item-title">{bid.itemTitle}</h3>
          <span className="bid-seller">by {bid.seller.firstName} {bid.seller.lastName.charAt(0)}.</span>
        </div>
        
        <div className="bid-pricing">
          <div className="price-row">
            <span className="price-label">Your Bid:</span>
            <span className="my-bid-amount">₹{bid.myBid.toLocaleString()}</span>
          </div>
          
          <div className="price-row">
            <span className="price-label">Current Price:</span>
            <span className={`current-bid-amount ${bid.status}`}>
              ₹{bid.currentPrice.toLocaleString()}
            </span>
          </div>
          
          {bid.isProxyBid && (
            <div className="price-row">
              <span className="price-label">Max Proxy:</span>
              <span className="proxy-amount">₹{bid.maxProxyAmount.toLocaleString()}</span>
            </div>
          )}
        </div>
        
        <div className="bid-details">
          <div className="detail-row">
            <span className="detail-label">Total Bids:</span>
            <span className="detail-value">{bid.totalBids}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Bid Time:</span>
            <span className="detail-value">
              {bid.bidTime.toLocaleDateString()} {bid.bidTime.toLocaleTimeString()}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">
              {bid.status === 'won' || bid.status === 'lost' ? 'Ended:' : 'Ends in:'}
            </span>
            <span className={`detail-value ${bid.status === 'won' || bid.status === 'lost' ? '' : 'time-remaining'}`}>
              {formatTimeRemaining(bid.auctionEndTime)}
            </span>
          </div>
        </div>
        
        {bid.status === 'won' && (
          <div className="won-section">
            <div className="won-message">
              🎉 Congratulations! You won this auction!
            </div>
            <div className="won-details">
              <span>Won at: ₹{bid.myBid.toLocaleString()}</span>
              <span>Won on: {bid.wonAt.toLocaleDateString()}</span>
            </div>
          </div>
        )}
        
        {bid.status === 'lost' && (
          <div className="lost-section">
            <div className="lost-message">
              😞 Auction ended. Won by {bid.winner}
            </div>
            <div className="lost-details">
              <span>Final Price: ₹{bid.currentPrice.toLocaleString()}</span>
            </div>
          </div>
        )}
        
        <div className="bid-actions">
          <Link to={`/item/${bid.itemId}`} className="action-btn view-btn">
            <span>👁️</span>
            <span>View Item</span>
          </Link>
          
          {(bid.status === 'outbid' || bid.status === 'active') && (
            <button 
              className="action-btn bid-again-btn"
              onClick={() => {
                const newAmount = prompt(`Enter new bid amount (current: ₹${bid.currentPrice.toLocaleString()})`);
                if (newAmount && parseFloat(newAmount) > bid.currentPrice) {
                  handleIncreaseBid(bid.id, parseFloat(newAmount));
                }
              }}
            >
              <span>💰</span>
              <span>Bid Again</span>
            </button>
          )}
          
          {bid.status === 'won' && (
            <button className="action-btn contact-btn">
              <span>💬</span>
              <span>Contact Seller</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="my-bids-page">
      <div className="my-bids-header">
        <div className="header-content">
          <h1>My Bids</h1>
          <p>Track all your bidding activities and auction results</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bids-stats-overview">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total || 0}</div>
            <div className="stat-label">Total Bids</div>
          </div>
        </div>
        
        <div className="stat-card winning">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">{stats.winning || 0}</div>
            <div className="stat-label">Currently Winning</div>
          </div>
        </div>
        
        <div className="stat-card won">
          <div className="stat-icon">🎉</div>
          <div className="stat-content">
            <div className="stat-value">{stats.won || 0}</div>
            <div className="stat-label">Won</div>
          </div>
        </div>
        
        <div className="stat-card spent">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">₹{(stats.totalSpent || 0).toLocaleString()}</div>
            <div className="stat-label">Total Spent</div>
          </div>
        </div>
        
        <div className="stat-card proxy">
          <div className="stat-icon">🤖</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeProxyBids || 0}</div>
            <div className="stat-label">Active Proxy Bids</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bids-controls">
        <div className="filter-buttons">
          {[
            { value: 'all', label: 'All Bids', icon: '📊' },
            { value: 'winning', label: 'Winning', icon: '🏆' },
            { value: 'outbid', label: 'Outbid', icon: '⚠️' },
            { value: 'won', label: 'Won', icon: '🎉' },
            { value: 'lost', label: 'Lost', icon: '😞' },
            { value: 'active', label: 'Active', icon: '🔴' }
          ].map(filterOption => (
            <button
              key={filterOption.value}
              className={`filter-btn ${filter === filterOption.value ? 'active' : ''}`}
              onClick={() => setFilter(filterOption.value)}
            >
              <span>{filterOption.icon}</span>
              <span>{filterOption.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bids List */}
      {loading ? (
        <div className="loading-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bid-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-price"></div>
                <div className="skeleton-meta"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bids-list">
          {bids.length > 0 ? (
            bids.map(bid => (
              <BidCard key={bid.id} bid={bid} />
            ))
          ) : (
            <div className="no-bids">
              <div className="no-bids-icon">💰</div>
              <h3>No bids found</h3>
              <p>
                {filter === 'all' 
                  ? "You haven't placed any bids yet."
                  : `No ${filter} bids found.`
                }
              </p>
              <Link to="/browse" className="browse-items-btn">
                <span>🔍</span>
                <span>Browse Items to Bid</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBids;
