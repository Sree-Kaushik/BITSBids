import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const MyAuctions = () => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchMyAuctions();
  }, [filter, sortBy]);

  const fetchMyAuctions = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock auction data
      const mockAuctions = [
        {
          id: 1,
          title: 'MacBook Pro M3 Max 16-inch',
          description: 'Top-spec MacBook Pro with M3 Max chip, 32GB RAM, 1TB SSD.',
          category: 'Electronics',
          condition: 'Like New',
          currentPrice: 185000,
          startingPrice: 150000,
          images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=400&hei=300&fmt=jpeg&qlt=90&.v=1697311054290'],
          totalBids: 23,
          watchers: 45,
          status: 'active',
          auctionEndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          views: 234,
          featured: true
        },
        {
          id: 2,
          title: 'iPhone 15 Pro Max 256GB',
          description: 'Latest iPhone 15 Pro Max in Natural Titanium.',
          category: 'Electronics',
          condition: 'Like New',
          currentPrice: 89000,
          startingPrice: 75000,
          images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=400&hei=300&fmt=p-jpg&qlt=80&.v=1692895395658'],
          totalBids: 31,
          watchers: 67,
          status: 'active',
          auctionEndTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          views: 456,
          featured: false
        },
        {
          id: 3,
          title: 'Gaming Setup RTX 4090',
          description: 'Complete gaming setup with RTX 4090, 32GB RAM.',
          category: 'Electronics',
          condition: 'New',
          currentPrice: 245000,
          startingPrice: 200000,
          images: ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop'],
          totalBids: 18,
          watchers: 89,
          status: 'sold',
          auctionEndTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          views: 567,
          soldPrice: 245000,
          winner: 'Ananya G.'
        },
        {
          id: 4,
          title: 'Study Desk & Chair Set',
          description: 'Ergonomic study desk with adjustable chair.',
          category: 'Furniture',
          condition: 'Good',
          currentPrice: 8500,
          startingPrice: 6000,
          images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'],
          totalBids: 8,
          watchers: 23,
          status: 'ended',
          auctionEndTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          views: 123
        },
        {
          id: 5,
          title: 'Engineering Textbooks Bundle',
          description: 'Complete set of CS engineering books.',
          category: 'Books & Study Materials',
          condition: 'Good',
          currentPrice: 0,
          startingPrice: 3000,
          images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'],
          totalBids: 0,
          watchers: 12,
          status: 'draft',
          auctionEndTime: null,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          views: 0
        }
      ];

      // Apply filters
      let filteredAuctions = mockAuctions;
      if (filter !== 'all') {
        filteredAuctions = mockAuctions.filter(auction => auction.status === filter);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-high':
          filteredAuctions.sort((a, b) => b.currentPrice - a.currentPrice);
          break;
        case 'price-low':
          filteredAuctions.sort((a, b) => a.currentPrice - b.currentPrice);
          break;
        case 'ending-soon':
          filteredAuctions.sort((a, b) => {
            if (!a.auctionEndTime) return 1;
            if (!b.auctionEndTime) return -1;
            return new Date(a.auctionEndTime) - new Date(b.auctionEndTime);
          });
          break;
        case 'most-bids':
          filteredAuctions.sort((a, b) => b.totalBids - a.totalBids);
          break;
        default:
          filteredAuctions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      setAuctions(filteredAuctions);
      
      // Calculate stats
      setStats({
        total: mockAuctions.length,
        active: mockAuctions.filter(a => a.status === 'active').length,
        sold: mockAuctions.filter(a => a.status === 'sold').length,
        draft: mockAuctions.filter(a => a.status === 'draft').length,
        totalEarnings: mockAuctions.filter(a => a.status === 'sold').reduce((sum, a) => sum + (a.soldPrice || 0), 0),
        totalViews: mockAuctions.reduce((sum, a) => sum + a.views, 0)
      });

    } catch (error) {
      toast.error('Failed to load auctions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAuction = async (auctionId) => {
    if (!window.confirm('Are you sure you want to delete this auction?')) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAuctions(prev => prev.filter(auction => auction.id !== auctionId));
      toast.success('Auction deleted successfully');
    } catch (error) {
      toast.error('Failed to delete auction');
    }
  };

  const handlePromoteAuction = async (auctionId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAuctions(prev => prev.map(auction => 
        auction.id === auctionId 
          ? { ...auction, featured: true }
          : auction
      ));
      toast.success('Auction promoted successfully');
    } catch (error) {
      toast.error('Failed to promote auction');
    }
  };

  const formatTimeRemaining = (endTime) => {
    if (!endTime) return 'Not scheduled';
    
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

  const AuctionCard = ({ auction }) => (
    <div className={`my-auction-card ${auction.status}`}>
      <div className="auction-image-container">
        <img src={auction.images[0]} alt={auction.title} className="auction-image" />
        <div className="auction-overlay">
          <div className="auction-badges">
            <span className={`status-badge ${auction.status}`}>
              {auction.status === 'active' && '🔴 Live'}
              {auction.status === 'sold' && '✅ Sold'}
              {auction.status === 'ended' && '⏹️ Ended'}
              {auction.status === 'draft' && '📝 Draft'}
            </span>
            {auction.featured && (
              <span className="featured-badge">⭐ Featured</span>
            )}
          </div>
          
          <div className="auction-quick-stats">
            <div className="quick-stat">
              <span className="stat-icon">👁️</span>
              <span>{auction.views}</span>
            </div>
            <div className="quick-stat">
              <span className="stat-icon">❤️</span>
              <span>{auction.watchers}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="auction-content">
        <div className="auction-header">
          <h3 className="auction-title">{auction.title}</h3>
          <span className="auction-category">{auction.category}</span>
        </div>
        
        <p className="auction-description">{auction.description}</p>
        
        <div className="auction-pricing">
          <div className="price-info">
            <div className="current-price">
              ₹{auction.currentPrice.toLocaleString()}
              {auction.status === 'sold' && (
                <span className="sold-indicator"> (SOLD)</span>
              )}
            </div>
            <div className="starting-price">
              Started at ₹{auction.startingPrice.toLocaleString()}
            </div>
          </div>
          
          <div className="auction-stats">
            <div className="stat-item">
              <span className="stat-label">Bids</span>
              <span className="stat-value">{auction.totalBids}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Watchers</span>
              <span className="stat-value">{auction.watchers}</span>
            </div>
          </div>
        </div>
        
        <div className="auction-meta">
          <div className="time-info">
            {auction.status === 'active' && (
              <span className="time-remaining">
                ⏰ {formatTimeRemaining(auction.auctionEndTime)} left
              </span>
            )}
            {auction.status === 'sold' && (
              <span className="sold-info">
                🏆 Won by {auction.winner}
              </span>
            )}
            {auction.status === 'ended' && (
              <span className="ended-info">
                ⏹️ Ended {formatTimeRemaining(auction.auctionEndTime)} ago
              </span>
            )}
            {auction.status === 'draft' && (
              <span className="draft-info">
                📝 Draft - Not published yet
              </span>
            )}
          </div>
          
          <div className="auction-condition">
            <span className="condition-badge">{auction.condition}</span>
          </div>
        </div>
        
        <div className="auction-actions">
          <Link to={`/item/${auction.id}`} className="action-btn view-btn">
            <span>👁️</span>
            <span>View</span>
          </Link>
          
          {auction.status === 'draft' && (
            <Link to={`/edit-auction/${auction.id}`} className="action-btn edit-btn">
              <span>✏️</span>
              <span>Edit</span>
            </Link>
          )}
          
          {auction.status === 'active' && !auction.featured && (
            <button 
              onClick={() => handlePromoteAuction(auction.id)}
              className="action-btn promote-btn"
            >
              <span>⭐</span>
              <span>Promote</span>
            </button>
          )}
          
          <button 
            onClick={() => handleDeleteAuction(auction.id)}
            className="action-btn delete-btn"
          >
            <span>🗑️</span>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="my-auctions-page">
      <div className="my-auctions-header">
        <div className="header-content">
          <h1>My Auctions</h1>
          <p>Manage your listings and track their performance</p>
        </div>
        
        <Link to="/create-item" className="create-auction-btn">
          <span>➕</span>
          <span>Create New Auction</span>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="auctions-stats-overview">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total || 0}</div>
            <div className="stat-label">Total Auctions</div>
          </div>
        </div>
        
        <div className="stat-card active">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <div className="stat-value">{stats.active || 0}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
        
        <div className="stat-card sold">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.sold || 0}</div>
            <div className="stat-label">Sold</div>
          </div>
        </div>
        
        <div className="stat-card earnings">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">₹{(stats.totalEarnings || 0).toLocaleString()}</div>
            <div className="stat-label">Total Earnings</div>
          </div>
        </div>
        
        <div className="stat-card views">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <div className="stat-value">{(stats.totalViews || 0).toLocaleString()}</div>
            <div className="stat-label">Total Views</div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="auctions-controls">
        <div className="filters-section">
          <h3>Filter by Status</h3>
          <div className="filter-buttons">
            {[
              { value: 'all', label: 'All Auctions', icon: '📊' },
              { value: 'active', label: 'Active', icon: '🔴' },
              { value: 'sold', label: 'Sold', icon: '✅' },
              { value: 'ended', label: 'Ended', icon: '⏹️' },
              { value: 'draft', label: 'Drafts', icon: '📝' }
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
        
        <div className="sort-section">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="ending-soon">Ending Soon</option>
            <option value="most-bids">Most Bids</option>
          </select>
        </div>
      </div>

      {/* Auctions Grid */}
      {loading ? (
        <div className="loading-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="auction-skeleton">
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
        <div className="auctions-grid">
          {auctions.length > 0 ? (
            auctions.map(auction => (
              <AuctionCard key={auction.id} auction={auction} />
            ))
          ) : (
            <div className="no-auctions">
              <div className="no-auctions-icon">🏪</div>
              <h3>No auctions found</h3>
              <p>
                {filter === 'all' 
                  ? "You haven't created any auctions yet."
                  : `No ${filter} auctions found.`
                }
              </p>
              <Link to="/create-item" className="create-first-btn">
                <span>➕</span>
                <span>Create Your First Auction</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyAuctions;
