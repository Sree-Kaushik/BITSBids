import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const EnhancedHome = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');

  useEffect(() => {
    fetchHomeData();
    
    // Handle search from URL params
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setActiveTab('search');
      handleSearch(searchQuery);
    }
  }, [searchParams]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [itemsRes, statsRes] = await Promise.all([
        api.get('/items?limit=8&status=active&sortBy=createdAt&sortOrder=desc'),
        api.get('/items/stats')
      ]);

      setFeaturedItems(itemsRes.data.data);
      setStats(statsRes.data.data);
      
      // Set categories with icons
      setCategories([
        { name: 'Electronics', icon: '📱', count: 45 },
        { name: 'Books', icon: '📚', count: 32 },
        { name: 'Clothing', icon: '👕', count: 28 },
        { name: 'Sports', icon: '⚽', count: 19 },
        { name: 'Furniture', icon: '🪑', count: 15 },
        { name: 'Accessories', icon: '👜', count: 23 },
        { name: 'Vehicles', icon: '🚗', count: 8 },
        { name: 'Others', icon: '📦', count: 12 }
      ]);
    } catch (error) {
      toast.error('Failed to load home data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      const response = await api.get(`/items/search?q=${encodeURIComponent(query)}`);
      setFeaturedItems(response.data.data);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const HeroSection = () => (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Welcome to BITSBids</h1>
          <p>The premier auction platform for BITS Pilani students</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{stats.totalItems || 0}</span>
              <span className="stat-label">Active Auctions</span>
            </div>
            <div className="stat">
              <span className="stat-number">{stats.totalUsers || 0}</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat">
              <span className="stat-number">{stats.totalBids || 0}</span>
              <span className="stat-label">Bids Placed</span>
            </div>
          </div>
          <div className="hero-actions">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  📊 Go to Dashboard
                </Link>
                <Link to="/create-item" className="btn btn-secondary btn-lg">
                  ➕ Create Auction
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  🚀 Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  🔑 Login
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-cards">
            <div className="floating-card">
              <span className="card-icon">🎯</span>
              <span className="card-text">Live Auctions</span>
            </div>
            <div className="floating-card">
              <span className="card-icon">💰</span>
              <span className="card-text">Best Prices</span>
            </div>
            <div className="floating-card">
              <span className="card-icon">🔒</span>
              <span className="card-text">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const CategorySection = () => (
    <section className="categories-section">
      <div className="container">
        <h2>Browse by Category</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={`/?category=${category.name}`} 
              className="category-card"
            >
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name}</h3>
              <p>{category.count} items</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

  const FeaturedSection = () => (
    <section className="featured-section">
      <div className="container">
        <div className="section-header">
          <h2>
            {activeTab === 'search' ? 'Search Results' : 'Featured Auctions'}
          </h2>
          <div className="section-tabs">
            <button 
              className={`tab ${activeTab === 'featured' ? 'active' : ''}`}
              onClick={() => setActiveTab('featured')}
            >
              🌟 Featured
            </button>
            <button 
              className={`tab ${activeTab === 'ending-soon' ? 'active' : ''}`}
              onClick={() => setActiveTab('ending-soon')}
            >
              ⏰ Ending Soon
            </button>
            <button 
              className={`tab ${activeTab === 'new' ? 'active' : ''}`}
              onClick={() => setActiveTab('new')}
            >
              🆕 New
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </div>
        ) : (
          <div className="items-grid">
            {featuredItems.length > 0 ? (
              featuredItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))
            ) : (
              <div className="no-items">
                <p>No items found</p>
                <Link to="/create-item" className="btn btn-primary">
                  Create First Auction
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );

  const ItemCard = ({ item }) => (
    <Link to={`/item/${item._id}`} className="item-card">
      <div className="item-image">
        {item.images && item.images.length > 0 ? (
          <img src={item.images[0]} alt={item.title} />
        ) : (
          <div className="no-image">📷 No Image</div>
        )}
        <div className="item-status">
          {item.status === 'active' ? '🟢 Live' : '🔴 Ended'}
        </div>
      </div>
      <div className="item-details">
        <h3 className="item-title">{item.title}</h3>
        <p className="item-campus">📍 {item.campus}</p>
        <div className="item-pricing">
          <span className="current-price">₹{item.currentPrice}</span>
          <span className="bid-count">{item.totalBids} bids</span>
        </div>
        <div className="item-time">
          {item.status === 'active' ? (
            <span className="time-remaining">
              ⏰ {calculateTimeRemaining(item.auctionEndTime)}
            </span>
          ) : (
            <span className="time-ended">Auction ended</span>
          )}
        </div>
      </div>
    </Link>
  );

  const calculateTimeRemaining = (endTime) => {
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

  return (
    <div className="enhanced-home">
      <HeroSection />
      <CategorySection />
      <FeaturedSection />
    </div>
  );
};

export default EnhancedHome;
