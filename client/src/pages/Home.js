import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DeviceShowcase from '../components/DeviceShowcase';
import AdvancedSearch from '../components/AdvancedSearch';
import { toast } from 'react-toastify';
import axios from 'axios';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingItems, setTrendingItems] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchHomeData();
    
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setActiveTab('search');
      handleSearch(searchQuery);
    }
  }, [searchParams]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Featured Items with Real Device Data
      setFeaturedItems([
        {
          _id: '1',
          title: 'MacBook Pro M3 Max 16-inch',
          description: 'Barely used MacBook Pro with M3 Max chip, 32GB RAM, 1TB SSD. Perfect for development and creative work. Includes original charger, box, and documentation.',
          campus: 'Goa',
          category: 'Electronics',
          currentPrice: 185000,
          startingPrice: 150000,
          totalBids: 23,
          status: 'active',
          auctionEndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290'],
          seller: { firstName: 'Arjun', lastName: 'Sharma' },
          condition: 'Like New',
          featured: true,
          priority: 'high',
          specs: {
            processor: 'Apple M3 Max chip',
            memory: '32GB unified memory',
            storage: '1TB SSD',
            display: '16.2" Liquid Retina XDR'
          }
        },
        {
          _id: '2',
          title: 'Gaming Setup RTX 4090',
          description: 'Complete gaming setup with RTX 4090, 32GB RAM, 1TB NVMe SSD. Includes 27" 4K monitor, mechanical keyboard, and gaming mouse.',
          campus: 'Pilani',
          category: 'Electronics',
          currentPrice: 245000,
          startingPrice: 200000,
          totalBids: 18,
          status: 'active',
          auctionEndTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          images: ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop'],
          seller: { firstName: 'Priya', lastName: 'Patel' },
          condition: 'New',
          featured: true,
          priority: 'high',
          specs: {
            gpu: 'NVIDIA RTX 4090',
            cpu: 'Intel i9-13900K',
            ram: '32GB DDR5',
            storage: '1TB NVMe SSD'
          }
        },
        {
          _id: '3',
          title: 'iPhone 15 Pro Max',
          description: 'Latest iPhone 15 Pro Max 256GB in Natural Titanium. Includes original box, charger, and unused accessories.',
          campus: 'Hyderabad',
          category: 'Electronics',
          currentPrice: 89000,
          startingPrice: 75000,
          totalBids: 31,
          status: 'active',
          auctionEndTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692895395658'],
          seller: { firstName: 'Rohit', lastName: 'Kumar' },
          condition: 'Like New',
          featured: true,
          priority: 'medium',
          specs: {
            display: '6.7" Super Retina XDR',
            processor: 'A17 Pro chip',
            storage: '256GB',
            camera: '48MP Main Camera'
          }
        },
        {
          _id: '4',
          title: 'Engineering Textbooks Bundle',
          description: 'Complete set of Computer Science engineering textbooks for all 4 years. Includes Data Structures, Algorithms, Operating Systems, Database Systems.',
          campus: 'Goa',
          category: 'Books & Study Materials',
          currentPrice: 4500,
          startingPrice: 3000,
          totalBids: 12,
          status: 'active',
          auctionEndTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'],
          seller: { firstName: 'Sneha', lastName: 'Reddy' },
          condition: 'Good',
          featured: false,
          priority: 'medium',
          specs: {
            subjects: 'CS Core Subjects',
            year: 'All 4 Years',
            condition: 'Good with highlights',
            count: '15+ Books'
          }
        },
        {
          _id: '5',
          title: 'PlayStation 5 Console',
          description: 'Sony PlayStation 5 Standard Edition with controller, cables, and 3 games included. Excellent condition.',
          campus: 'Hyderabad',
          category: 'Electronics',
          currentPrice: 35000,
          startingPrice: 30000,
          totalBids: 42,
          status: 'active',
          auctionEndTime: new Date(Date.now() + 1.5 * 24 * 60 * 60 * 1000),
          images: ['https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21'],
          seller: { firstName: 'Ananya', lastName: 'Gupta' },
          condition: 'Very Good',
          featured: true,
          priority: 'high',
          specs: {
            processor: 'AMD Zen 2 8-core',
            graphics: 'AMD RDNA 2 GPU',
            storage: '825GB SSD',
            resolution: '4K Gaming'
          }
        },
        {
          _id: '6',
          title: 'Study Desk & Chair Set',
          description: 'Ergonomic study desk with adjustable chair. Perfect for long study sessions. Includes desk lamp and organizer.',
          campus: 'Pilani',
          category: 'Furniture',
          currentPrice: 8500,
          startingPrice: 6000,
          totalBids: 8,
          status: 'active',
          auctionEndTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'],
          seller: { firstName: 'Karan', lastName: 'Joshi' },
          condition: 'Good',
          featured: false,
          priority: 'low',
          specs: {
            material: 'Engineered Wood',
            dimensions: '120cm x 60cm',
            features: 'Adjustable Height',
            includes: 'Chair + Lamp'
          }
        }
      ]);

      // Platform Statistics
      setStats({
        totalItems: 3247,
        totalUsers: 18632,
        totalBids: 125456,
        totalValue: 18500000,
        activeAuctions: 1847,
        completedToday: 156,
        newUsersToday: 89,
        avgBidValue: 12500
      });
      
      // Categories with Enhanced Data
      setCategories([
        { 
          name: 'Electronics', 
          icon: '💻', 
          count: 1186, 
          trend: '+35%',
          image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
          description: 'Laptops, phones, gadgets & gaming devices',
          avgPrice: 45000,
          topBrands: ['Apple', 'Samsung', 'Sony', 'Dell']
        },
        { 
          name: 'Books & Study Materials', 
          icon: '📚', 
          count: 824, 
          trend: '+28%',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
          description: 'Textbooks, notes, study guides & references',
          avgPrice: 2500,
          topBrands: ['Pearson', 'McGraw Hill', 'Wiley', 'Oxford']
        },
        { 
          name: 'Fashion & Accessories', 
          icon: '👕', 
          count: 589, 
          trend: '+18%',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
          description: 'Clothing, shoes, bags & accessories',
          avgPrice: 1800,
          topBrands: ['Nike', 'Adidas', 'Zara', 'H&M']
        },
        { 
          name: 'Sports & Fitness', 
          icon: '🏃', 
          count: 367, 
          trend: '+22%',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          description: 'Sports equipment, fitness gear & outdoor items',
          avgPrice: 3200,
          topBrands: ['Nike', 'Adidas', 'Decathlon', 'Puma']
        },
        { 
          name: 'Furniture', 
          icon: '🪑', 
          count: 234, 
          trend: '+15%',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          description: 'Study desks, chairs, storage & room decor',
          avgPrice: 5500,
          topBrands: ['IKEA', 'Godrej', 'Nilkamal', 'Urban Ladder']
        },
        { 
          name: 'Vehicles', 
          icon: '🚲', 
          count: 156, 
          trend: '+12%',
          image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
          description: 'Bicycles, scooters & vehicle accessories',
          avgPrice: 8500,
          topBrands: ['Hero', 'Trek', 'Giant', 'Specialized']
        },
        { 
          name: 'Services', 
          icon: '🔧', 
          count: 89, 
          trend: '+25%',
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
          description: 'Tutoring, repairs, design & other services',
          avgPrice: 1500,
          topBrands: ['Custom Services', 'Freelance', 'Tutoring', 'Repairs']
        },
        { 
          name: 'Others', 
          icon: '📦', 
          count: 267, 
          trend: '+8%',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
          description: 'Miscellaneous items & unique finds',
          avgPrice: 2200,
          topBrands: ['Various', 'Handmade', 'Vintage', 'Collectibles']
        }
      ]);

      // Trending Items
      setTrendingItems([
        { id: 1, title: 'MacBook Air M2', bids: 45, price: 85000 },
        { id: 2, title: 'iPhone 14 Pro', bids: 38, price: 65000 },
        { id: 3, title: 'Gaming Chair', bids: 22, price: 12000 },
        { id: 4, title: 'Study Lamp', bids: 18, price: 2500 },
        { id: 5, title: 'Textbook Set', bids: 15, price: 3500 }
      ]);

      // Recent Activity
      setRecentActivity([
        { user: 'Arjun S.', action: 'won', item: 'iPhone 13', time: '2 min ago' },
        { user: 'Priya P.', action: 'bid', item: 'MacBook Pro', time: '5 min ago' },
        { user: 'Rohit K.', action: 'listed', item: 'Gaming Setup', time: '10 min ago' },
        { user: 'Sneha R.', action: 'won', item: 'Study Books', time: '15 min ago' }
      ]);

    } catch (error) {
      toast.error('Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      console.log('Searching for:', query);
      setSearchQuery(query);
      toast.info(`Searching for: ${query}`);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const calculateTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return { text: 'Ended', urgent: true };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return { text: `${days}d ${hours}h`, urgent: false };
    if (hours > 0) return { text: `${hours}h ${minutes}m`, urgent: hours < 2 };
    return { text: `${minutes}m`, urgent: true };
  };

  // Professional Hero Section
  const ProfessionalHeroSection = () => (
    <section className="professional-hero-section">
      <div className="hero-background-professional">
        <div className="hero-gradient-overlay"></div>
        <div className="hero-pattern-grid"></div>
        <div className="floating-elements">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="floating-element"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            >
              {['💎', '⚡', '🔥', '✨', '🚀'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      </div>
      
      <div className="container">
        <div className="hero-content-professional">
          <div className="hero-text-section">
            <div className="hero-badge-professional">
              <span className="badge-icon-professional">🎓</span>
              <span className="badge-text">Trusted by {stats.totalUsers?.toLocaleString() || '18,000'}+ Students Across All BITS Campuses</span>
              <div className="badge-glow"></div>
            </div>
            
            <h1 className="hero-title-professional">
              The Future of <span className="gradient-text-professional">Student Commerce</span>
              <br />at BITS Pilani
            </h1>
            
            <p className="hero-description-professional">
              Discover, bid, and sell with confidence in India's most trusted student marketplace. 
              Connect with fellow BITSians across Pilani, Goa, Hyderabad, and Dubai campuses.
            </p>
            
            <div className="hero-search-section">
              <div className="search-container-professional">
                <input 
                  type="text"
                  placeholder="Search for items, categories, or sellers..."
                  className="hero-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                />
                <button 
                  className="hero-search-btn"
                  onClick={() => handleSearch(searchQuery)}
                >
                  <span>🔍</span>
                  <span>Search</span>
                </button>
              </div>
              <div className="popular-searches">
                <span>Popular:</span>
                {['MacBook', 'iPhone', 'Textbooks', 'Gaming', 'Furniture'].map((term) => (
                  <button 
                    key={term} 
                    className="popular-search-tag"
                    onClick={() => handleSearch(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="hero-stats-professional">
              <div className="stat-item-professional">
                <div className="stat-icon-professional">📊</div>
                <span className="stat-number-professional">{stats.totalItems?.toLocaleString() || '3,247'}</span>
                <span className="stat-label-professional">Active Listings</span>
              </div>
              <div className="stat-item-professional">
                <div className="stat-icon-professional">👥</div>
                <span className="stat-number-professional">{stats.totalUsers?.toLocaleString() || '18,632'}</span>
                <span className="stat-label-professional">Students</span>
              </div>
              <div className="stat-item-professional">
                <div className="stat-icon-professional">💰</div>
                <span className="stat-number-professional">₹{(stats.totalValue / 1000000)?.toFixed(1) || '18.5'}M</span>
                <span className="stat-label-professional">Traded</span>
              </div>
              <div className="stat-item-professional">
                <div className="stat-icon-professional">🎯</div>
                <span className="stat-number-professional">{stats.totalBids?.toLocaleString() || '125,456'}</span>
                <span className="stat-label-professional">Total Bids</span>
              </div>
            </div>
            
            <div className="hero-actions-professional">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="btn-hero-professional btn-primary-professional">
                    <span className="btn-icon-professional">📊</span>
                    <span>Go to Dashboard</span>
                    <span className="btn-arrow-professional">→</span>
                    <div className="btn-glow-professional"></div>
                  </Link>
                  <Link to="/create-item" className="btn-hero-professional btn-secondary-professional">
                    <span className="btn-icon-professional">➕</span>
                    <span>Create Auction</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-hero-professional btn-primary-professional">
                    <span className="btn-icon-professional">🚀</span>
                    <span>Join BITSBids</span>
                    <span className="btn-arrow-professional">→</span>
                    <div className="btn-glow-professional"></div>
                  </Link>
                  <Link to="/login" className="btn-hero-professional btn-secondary-professional">
                    <span className="btn-icon-professional">🔑</span>
                    <span>Login</span>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="hero-visual-section">
            <div className="hero-devices-showcase">
              <div className="device-card device-laptop">
                <img 
                  src="https://images.macrumors.com/t/4ssIz-tzmptgrsGY61DNGGY7PFw=/1600x0/article-new/2024/10/M4-MacBook-Pro-Thumb-2.jpg" 
                  alt="MacBook Pro" 
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=MacBook+Pro';
                  }}
                />
                <div className="device-info">
                  <span className="device-price">₹1,85,000</span>
                  <span className="device-bids">23 bids</span>
                </div>
              </div>
              
              <div className="device-card device-phone">
                <img 
                  src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=400&hei=300&fmt=p-jpg&qlt=80&.v=1692895395658" 
                  alt="iPhone 15 Pro" 
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=iPhone+15+Pro';
                  }}
                />
                <div className="device-info">
                  <span className="device-price">₹89,000</span>
                  <span className="device-bids">31 bids</span>
                </div>
              </div>
              
              <div className="device-card device-gaming">
                <img 
                  src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop" 
                  alt="Gaming Setup" 
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Gaming+Setup';
                  }}
                />
                <div className="device-info">
                  <span className="device-price">₹2,45,000</span>
                  <span className="device-bids">18 bids</span>
                </div>
              </div>
            </div>
            
            <div className="campus-network-visual">
              <div className="campus-node pilani">
                <div className="node-icon">🏛️</div>
                <span>Pilani</span>
                <div className="node-stats">{Math.floor(stats.totalUsers * 0.4) || '7,453'}</div>
              </div>
              <div className="campus-node goa">
                <div className="node-icon">🏖️</div>
                <span>Goa</span>
                <div className="node-stats">{Math.floor(stats.totalUsers * 0.25) || '4,658'}</div>
              </div>
              <div className="campus-node hyderabad">
                <div className="node-icon">🏙️</div>
                <span>Hyderabad</span>
                <div className="node-stats">{Math.floor(stats.totalUsers * 0.3) || '5,590'}</div>
              </div>
              <div className="campus-node dubai">
                <div className="node-icon">🏗️</div>
                <span>Dubai</span>
                <div className="node-stats">{Math.floor(stats.totalUsers * 0.05) || '931'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Professional Categories Section
  const ProfessionalCategoriesSection = () => (
    <section className="professional-categories-section">
      <div className="container">
        <div className="section-header-professional">
          <h2 className="section-title-professional">Browse Categories</h2>
          <p className="section-subtitle-professional">Find exactly what you're looking for across all campuses</p>
        </div>
        
        <div className="categories-grid-professional">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={`/?category=${category.name}`} 
              className="category-card-professional"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="category-image-container">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="category-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(category.name);
                  }}
                />
                <div className="category-overlay">
                  <div className="category-icon-professional">{category.icon}</div>
                  <div className="category-trend">
                    <span className="trend-arrow">↗</span>
                    <span className="trend-value">{category.trend}</span>
                  </div>
                </div>
              </div>
              
              <div className="category-content-professional">
                <h3 className="category-name-professional">{category.name}</h3>
                <p className="category-description">{category.description}</p>
                <div className="category-stats">
                  <span className="category-count">{category.count} items</span>
                  <span className="category-avg-price">Avg: ₹{category.avgPrice.toLocaleString()}</span>
                </div>
                <div className="category-brands">
                  <span>Top: {category.topBrands.slice(0, 2).join(', ')}</span>
                </div>
                <div className="category-arrow-professional">→</div>
              </div>
              
              <div className="category-glow-effect"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

  // Professional Featured Section
  const ProfessionalFeaturedSection = () => (
    <section className="professional-featured-section">
      <div className="container">
        <div className="section-header-professional">
          <h2 className="section-title-professional">
            {activeTab === 'search' ? 'Search Results' : 'Featured Auctions'}
          </h2>
          <p className="section-subtitle-professional">Handpicked deals from trusted sellers across all campuses</p>
        </div>
        
        <div className="section-tabs-professional">
          {[
            { id: 'featured', icon: '⭐', label: 'Featured', count: featuredItems.filter(item => item.featured).length },
            { id: 'ending-soon', icon: '⏰', label: 'Ending Soon', count: featuredItems.filter(item => calculateTimeRemaining(item.auctionEndTime).urgent).length },
            { id: 'new', icon: '🆕', label: 'New Today', count: 8 },
            { id: 'trending', icon: '🔥', label: 'Trending', count: featuredItems.filter(item => item.totalBids > 20).length }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`tab-professional ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon-professional">{tab.icon}</span>
              <span className="tab-label-professional">{tab.label}</span>
              <span className="tab-count-professional">({tab.count})</span>
              <div className="tab-indicator-professional"></div>
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="loading-grid-professional">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card-professional">
                <div className="skeleton-image-professional">
                  <div className="skeleton-shimmer"></div>
                </div>
                <div className="skeleton-content-professional">
                  <div className="skeleton-title-professional"></div>
                  <div className="skeleton-price-professional"></div>
                  <div className="skeleton-meta-professional"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="items-grid-professional">
            {featuredItems.length > 0 ? (
              featuredItems.map((item, index) => (
                <ProfessionalItemCard key={item._id} item={item} index={index} />
              ))
            ) : (
              <div className="no-items-professional">
                <div className="no-items-visual">
                  <div className="no-items-icon-professional">🔍</div>
                  <div className="no-items-rings">
                    <div className="ring ring-1"></div>
                    <div className="ring ring-2"></div>
                    <div className="ring ring-3"></div>
                  </div>
                </div>
                <h3>No Items Found</h3>
                <p>Be the first to create an auction in this category!</p>
                <Link to="/create-item" className="btn-primary-professional">
                  Create First Auction
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );

  // Professional Item Card Component
  const ProfessionalItemCard = ({ item, index }) => {
    const timeRemaining = calculateTimeRemaining(item.auctionEndTime);
    
    return (
      <Link 
        to={`/item/${item._id}`} 
        className={`item-card-professional priority-${item.priority}`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="item-image-professional">
          {item.images && item.images.length > 0 ? (
            <img 
              src={item.images[0]} 
              alt={item.title} 
              className="item-main-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(item.title);
              }}
            />
          ) : (
            <div className="no-image-professional">
              <div className="no-image-icon-professional">📷</div>
              <div className="no-image-text-professional">No Image</div>
            </div>
          )}
          
          <div className="item-overlay-professional">
            <div className={`item-status-professional ${item.status}`}>
              <div className="status-dot-professional"></div>
              <span>{item.status === 'active' ? 'Live' : 'Ended'}</span>
            </div>
            
            <div className="item-category-professional">{item.category}</div>
            
            {item.featured && (
              <div className="featured-badge">
                <span>⭐</span>
                <span>Featured</span>
              </div>
            )}
          </div>
          
          <div className="item-quick-actions">
            <button className="quick-action-btn watchlist-btn" title="Add to Watchlist">
              <span>👁️</span>
            </button>
            <button className="quick-action-btn favorite-btn" title="Add to Favorites">
              <span>❤️</span>
            </button>
          </div>
        </div>
        
        <div className="item-details-professional">
          <div className="item-header-professional">
            <h3 className="item-title-professional">{item.title}</h3>
            <div className="item-condition-professional">{item.condition}</div>
          </div>
          
          <div className="item-specs-preview">
            {item.specs && Object.entries(item.specs).slice(0, 2).map(([key, value]) => (
              <div key={key} className="spec-item-small">
                <span className="spec-label-small">{key}:</span>
                <span className="spec-value-small">{value}</span>
              </div>
            ))}
          </div>
          
          <div className="item-meta-professional">
            <div className="item-campus-professional">
              <span className="campus-icon-professional">📍</span>
              <span>{item.campus} Campus</span>
            </div>
            <div className="item-seller-professional">
              <span className="seller-icon-professional">👤</span>
              <span>{item.seller.firstName} {item.seller.lastName.charAt(0)}.</span>
            </div>
          </div>
          
          <div className="item-pricing-professional">
            <div className="price-info-professional">
              <div className="current-price-professional">₹{item.currentPrice.toLocaleString()}</div>
              <div className="starting-price-professional">from ₹{item.startingPrice.toLocaleString()}</div>
            </div>
            <div className="bid-info-professional">
              <div className="bid-count-professional">{item.totalBids} bids</div>
              <div className="bid-growth">+{Math.floor(Math.random() * 5) + 1} today</div>
            </div>
          </div>
          
          <div className="item-footer-professional">
            <div className={`time-remaining-professional ${timeRemaining.urgent ? 'urgent' : ''}`}>
              <span className="time-icon-professional">⏰</span>
              <span className="time-text-professional">{timeRemaining.text}</span>
            </div>
            <div className="item-action-professional">
              <span className="action-text-professional">Bid Now</span>
              <span className="action-arrow-professional">→</span>
            </div>
          </div>
        </div>
        
        <div className="item-glow-effect"></div>
      </Link>
    );
  };

  // Trending Section
  const TrendingSection = () => (
    <section className="trending-section">
      <div className="container">
        <div className="section-header-professional">
          <h2 className="section-title-professional">Trending Now</h2>
          <p className="section-subtitle-professional">Most popular items this week</p>
        </div>
        
        <div className="trending-grid">
          {trendingItems.map((item, index) => (
            <div key={item.id} className="trending-item">
              <div className="trending-rank">#{index + 1}</div>
              <div className="trending-info">
                <h4>{item.title}</h4>
                <div className="trending-stats">
                  <span>{item.bids} bids</span>
                  <span>₹{item.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Recent Activity Section
  const RecentActivitySection = () => (
    <section className="activity-section">
      <div className="container">
        <div className="section-header-professional">
          <h2 className="section-title-professional">Live Activity</h2>
          <p className="section-subtitle-professional">See what's happening right now</p>
        </div>
        
        <div className="activity-feed">
          {recentActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                {activity.action === 'won' ? '🏆' : 
                 activity.action === 'bid' ? '💰' : '📝'}
              </div>
              <div className="activity-content">
                <span className="activity-user">{activity.user}</span>
                <span className="activity-action">{activity.action}</span>
                <span className="activity-item">{activity.item}</span>
              </div>
              <div className="activity-time">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="professional-home">
      <ProfessionalHeroSection />
      <DeviceShowcase category="Electronics" limit={8} />
      <ProfessionalCategoriesSection />
      <ProfessionalFeaturedSection />
      <TrendingSection />
      <RecentActivitySection />
    </div>
  );
};

export default Home;
