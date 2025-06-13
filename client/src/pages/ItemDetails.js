import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ItemDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [maxProxyBid, setMaxProxyBid] = useState('');
  const [useProxyBid, setUseProxyBid] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [isWatching, setIsWatching] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    fetchItemDetails();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock item data
      const mockItem = {
        id: parseInt(id),
        title: 'MacBook Pro M3 Max 16-inch',
        description: `This is a top-of-the-line MacBook Pro with the latest M3 Max chip, perfect for development, creative work, and everything in between. 

**What's Included:**
- MacBook Pro 16-inch with M3 Max chip
- Original charger and cable
- Original box and documentation
- AppleCare+ coverage until March 2025

**Condition Details:**
- Barely used, purchased 3 months ago
- No scratches or dents
- Battery health at 100%
- All ports and features working perfectly
- Screen is pristine with no dead pixels

**Reason for Selling:**
Upgrading to a desktop setup for my final year project. This laptop has been amazing but I need something more stationary.

**Technical Specifications:**
- Apple M3 Max chip with 12-core CPU and 38-core GPU
- 32GB unified memory
- 1TB SSD storage
- 16.2-inch Liquid Retina XDR display
- Three Thunderbolt 4 ports, HDMI port, SDXC card slot, headphone jack, MagSafe 3 port

Perfect for CS students, designers, or anyone who needs serious computing power!`,
        category: 'Electronics',
        condition: 'Like New',
        currentPrice: 185000,
        startingPrice: 150000,
        minimumIncrement: 1000,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=800&hei=600&fmt=jpeg&qlt=90&.v=1697311054290',
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-gallery1-202310?wid=800&hei=600&fmt=jpeg&qlt=90&.v=1697311054290',
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-gallery2-202310?wid=800&hei=600&fmt=jpeg&qlt=90&.v=1697311054290'
        ],
        seller: {
          id: 'seller123',
          firstName: 'Arjun',
          lastName: 'Sharma',
          campus: 'Goa',
          rating: 4.8,
          totalSales: 12,
          joinedDate: '2023-08-15',
          responseTime: '< 2 hours',
          avatar: null
        },
        campus: 'Goa',
        location: 'Hostel C, Room 234',
        totalBids: 23,
        watchers: 45,
        views: 234,
        status: 'active',
        auctionStartTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        auctionEndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        specifications: {
          'Processor': 'Apple M3 Max chip',
          'Memory': '32GB unified memory',
          'Storage': '1TB SSD',
          'Display': '16.2" Liquid Retina XDR',
          'Graphics': '38-core GPU',
          'Battery': '100Wh lithium-polymer',
          'Weight': '2.1 kg',
          'Color': 'Space Gray',
          'Warranty': 'AppleCare+ until March 2025',
          'Purchase Date': 'January 2024'
        },
        tags: ['laptop', 'apple', 'macbook', 'programming', 'design'],
        featured: true
      };

      // Mock bid history
      const mockBidHistory = [
        {
          id: 1,
          bidder: { firstName: 'Priya', lastName: 'P.' },
          amount: 185000,
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isWinning: true
        },
        {
          id: 2,
          bidder: { firstName: 'Rohit', lastName: 'K.' },
          amount: 182000,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isWinning: false
        },
        {
          id: 3,
          bidder: { firstName: 'Sneha', lastName: 'R.' },
          amount: 180000,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          isWinning: false
        },
        {
          id: 4,
          bidder: { firstName: 'Vikram', lastName: 'S.' },
          amount: 175000,
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          isWinning: false
        },
        {
          id: 5,
          bidder: { firstName: 'Ananya', lastName: 'G.' },
          amount: 170000,
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          isWinning: false
        }
      ];

      setItem(mockItem);
      setBidHistory(mockBidHistory);
      setBidAmount((mockItem.currentPrice + mockItem.minimumIncrement).toString());
      setIsWatching(Math.random() > 0.5); // Random for demo
    } catch (error) {
      toast.error('Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const updateTimeRemaining = () => {
    if (!item) return;
    
    const now = new Date();
    const end = new Date(item.auctionEndTime);
    const diff = end - now;
    
    if (diff <= 0) {
      setTimeRemaining('Auction Ended');
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (days > 0) {
      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    } else if (hours > 0) {
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    } else {
      setTimeRemaining(`${minutes}m ${seconds}s`);
    }
  };

  const handleBid = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to place a bid');
      return;
    }

    const bidValue = parseFloat(bidAmount);
    if (isNaN(bidValue) || bidValue <= item.currentPrice) {
      toast.error(`Bid must be higher than current price of ₹${item.currentPrice.toLocaleString()}`);
      return;
    }

    if (bidValue < item.currentPrice + item.minimumIncrement) {
      toast.error(`Minimum bid increment is ₹${item.minimumIncrement.toLocaleString()}`);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update item with new bid
      setItem(prev => ({
        ...prev,
        currentPrice: bidValue,
        totalBids: prev.totalBids + 1
      }));

      // Add to bid history
      setBidHistory(prev => [{
        id: Date.now(),
        bidder: { firstName: user.firstName, lastName: user.lastName.charAt(0) + '.' },
        amount: bidValue,
        timestamp: new Date(),
        isWinning: true
      }, ...prev.map(bid => ({ ...bid, isWinning: false }))]);

      setBidAmount((bidValue + item.minimumIncrement).toString());
      toast.success('Bid placed successfully!');
    } catch (error) {
      toast.error('Failed to place bid');
    }
  };

  const handleWatchlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to watchlist');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsWatching(!isWatching);
      setItem(prev => ({
        ...prev,
        watchers: prev.watchers + (isWatching ? -1 : 1)
      }));
      toast.success(isWatching ? 'Removed from watchlist' : 'Added to watchlist');
    } catch (error) {
      toast.error('Failed to update watchlist');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: `Check out this ${item.title} on BITSBids`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share');
    }
  };

  if (loading) {
    return (
      <div className="item-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="item-not-found">
        <h2>Item not found</h2>
        <p>The item you're looking for doesn't exist or has been removed.</p>
        <Link to="/browse" className="back-to-browse">Browse Items</Link>
      </div>
    );
  }

  return (
    <div className="item-details-page">
      <div className="item-details-container">
        {/* Main Content */}
        <div className="item-main-content">
          {/* Image Gallery */}
          <div className="item-gallery">
            <div className="main-image-container">
              <img 
                src={item.images[activeImageIndex]} 
                alt={item.title}
                className="main-image"
              />
              <div className="image-overlay">
                {item.featured && (
                  <span className="featured-badge">⭐ Featured</span>
                )}
                <span className="condition-badge">{item.condition}</span>
                <div className="image-actions">
                  <button onClick={handleShare} className="share-btn">
                    📤 Share
                  </button>
                </div>
              </div>
            </div>
            
            {item.images.length > 1 && (
              <div className="gallery-thumbnails">
                {item.images.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={image} alt={`${item.title} ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Item Information */}
          <div className="item-info">
            <div className="item-header">
              <div className="item-title-section">
                <h1 className="item-title">{item.title}</h1>
                <div className="item-meta">
                  <span className="category">{item.category}</span>
                  <span className="campus">{item.campus} Campus</span>
                  <span className="views">{item.views} views</span>
                </div>
              </div>
              
              <div className="item-actions">
                <button 
                  onClick={handleWatchlist}
                  className={`watchlist-btn ${isWatching ? 'watching' : ''}`}
                >
                  {isWatching ? '❤️ Watching' : '🤍 Watch'}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="item-description">
              <h3>Description</h3>
              <div className="description-content">
                {item.description.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="item-specifications">
              <h3>Specifications</h3>
              <div className="spec-grid">
                {Object.entries(item.specifications).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{key}:</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="item-tags">
                <h3>Tags</h3>
                <div className="tags-list">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Seller Information */}
            <div className="seller-info-card">
              <h3>Seller Information</h3>
              <div className="seller-header">
                <div className="seller-avatar">
                  {item.seller.avatar ? (
                    <img src={item.seller.avatar} alt="Seller" />
                  ) : (
                    <div className="avatar-placeholder">
                      {item.seller.firstName.charAt(0)}{item.seller.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="seller-details">
                  <h4>{item.seller.firstName} {item.seller.lastName}</h4>
                  <p>{item.seller.campus} Campus</p>
                  <div className="seller-rating">
                    <span className="rating">⭐ {item.seller.rating}</span>
                    <span className="sales">({item.seller.totalSales} sales)</span>
                  </div>
                </div>
              </div>
              
              <div className="seller-stats">
                <div className="seller-stat">
                  <div className="stat-number">{item.seller.totalSales}</div>
                  <div className="stat-label">Sales</div>
                </div>
                <div className="seller-stat">
                  <div className="stat-number">{item.seller.rating}</div>
                  <div className="stat-label">Rating</div>
                </div>
                <div className="seller-stat">
                  <div className="stat-number">{item.seller.responseTime}</div>
                  <div className="stat-label">Response</div>
                </div>
              </div>
              
              <div className="seller-actions">
                <button className="contact-seller-btn">
                  💬 Contact Seller
                </button>
                <Link to={`/seller/${item.seller.id}`} className="view-profile-btn">
                  👤 View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bidding Sidebar */}
        <div className="bidding-sidebar">
          {/* Auction Status */}
          <div className="auction-status-card">
            <div className="current-price-section">
              <div className="price-label">Current Price</div>
              <div className="current-price">₹{item.currentPrice.toLocaleString()}</div>
              <div className="starting-price">Started at ₹{item.startingPrice.toLocaleString()}</div>
            </div>
            
            <div className="auction-timer">
              <div className="timer-label">Time Remaining</div>
              <div className={`timer-value ${timeRemaining.includes('m') && !timeRemaining.includes('h') && !timeRemaining.includes('d') ? 'urgent' : ''}`}>
                {timeRemaining}
              </div>
            </div>
            
            <div className="bid-stats">
              <div className="bid-stat">
                <div className="bid-stat-number">{item.totalBids}</div>
                <div className="bid-stat-label">Total Bids</div>
              </div>
              <div className="bid-stat">
                <div className="bid-stat-number">{item.watchers}</div>
                <div className="bid-stat-label">Watchers</div>
              </div>
            </div>
          </div>

          {/* Bidding Section */}
          {item.status === 'active' && (
            <div className="bidding-section">
              <h3>Place Your Bid</h3>
              
              {isAuthenticated ? (
                <>
                  <div className="quick-bid-buttons">
                    <span>Quick Bid:</span>
                    {[1000, 2000, 5000, 10000].map(increment => (
                      <button
                        key={increment}
                        className="quick-bid-btn"
                        onClick={() => setBidAmount((item.currentPrice + increment).toString())}
                      >
                        +₹{increment.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  
                  <div className="bid-form">
                    <div className="bid-input-group">
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Enter bid amount"
                        min={item.currentPrice + item.minimumIncrement}
                        step={item.minimumIncrement}
                      />
                      <button onClick={handleBid} className="bid-btn">
                        Place Bid
                      </button>
                    </div>
                    <div className="bid-info">
                      <p>Minimum bid: ₹{(item.currentPrice + item.minimumIncrement).toLocaleString()}</p>
                      <p>Increment: ₹{item.minimumIncrement.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="proxy-bidding-section">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={useProxyBid}
                        onChange={(e) => setUseProxyBid(e.target.checked)}
                      />
                      <span>Enable Proxy Bidding</span>
                    </label>
                    
                    {useProxyBid && (
                      <div className="proxy-bid-input">
                        <input
                          type="number"
                          value={maxProxyBid}
                          onChange={(e) => setMaxProxyBid(e.target.value)}
                          placeholder="Maximum bid amount"
                          min={bidAmount}
                        />
                        <div className="proxy-info">
                          <p>We'll automatically bid for you up to this amount</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="auth-prompt">
                  <p>Please <Link to="/login">login</Link> to place a bid</p>
                </div>
              )}
            </div>
          )}

          {/* Bid History */}
          <div className="bid-history">
            <h3>Bid History</h3>
            <div className="bids-list">
              {bidHistory.length > 0 ? (
                bidHistory.map((bid) => (
                  <div key={bid.id} className="bid-item">
                    <div className="bid-info">
                      <div className="bidder-name">
                        {bid.bidder.firstName} {bid.bidder.lastName}
                        {bid.isWinning && <span className="winning-badge">Winning</span>}
                      </div>
                      <div className="bid-time">
                        {bid.timestamp.toLocaleDateString()} {bid.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="bid-amount">
                      ₹{bid.amount.toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-bids">
                  <p>No bids yet. Be the first to bid!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
