import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: { min: '', max: '' },
    condition: '',
    campus: '',
    sortBy: 'newest'
  });

  const categories = [
    'Electronics', 'Books & Study Materials', 'Fashion & Accessories',
    'Sports & Fitness', 'Furniture', 'Vehicles', 'Services', 'Others'
  ];

  const conditions = ['New', 'Like New', 'Very Good', 'Good', 'Fair'];
  const campuses = ['Pilani', 'Goa', 'Hyderabad', 'Dubai'];

  useEffect(() => {
    fetchItems();
  }, [filters, searchParams]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock items data based on mobile market share trends
      const mockItems = [
        {
          id: 1,
          title: 'iPhone 15 Pro Max 256GB',
          description: 'Latest iPhone 15 Pro Max in Natural Titanium. Excellent condition with original box.',
          category: 'Electronics',
          condition: 'Like New',
          currentPrice: 89000,
          startingPrice: 75000,
          campus: 'Goa',
          seller: { firstName: 'Arjun', lastName: 'Sharma' },
          images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=400&hei=300&fmt=p-jpg&qlt=80&.v=1692895395658'],
          totalBids: 31,
          timeRemaining: '2d 14h',
          featured: true
        },
        {
          id: 2,
          title: 'Samsung Galaxy S24 Ultra 512GB',
          description: 'Samsung Galaxy S24 Ultra with S Pen. Perfect for productivity and creativity.',
          category: 'Electronics',
          condition: 'Excellent',
          currentPrice: 75000,
          startingPrice: 65000,
          campus: 'Pilani',
          seller: { firstName: 'Priya', lastName: 'Patel' },
          images: ['https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-ultra-s928-sm-s928bztqins-thumb-539573043'],
          totalBids: 18,
          timeRemaining: '1d 8h',
          featured: true
        },
        {
          id: 3,
          title: 'Xiaomi 14 Ultra Camera Phone',
          description: 'Professional photography smartphone with Leica cameras. Mint condition.',
          category: 'Electronics',
          condition: 'Very Good',
          currentPrice: 45000,
          startingPrice: 40000,
          campus: 'Hyderabad',
          seller: { firstName: 'Rohit', lastName: 'Kumar' },
          images: ['https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1709888470.77242990.png'],
          totalBids: 24,
          timeRemaining: '3d 2h',
          featured: false
        },
        {
          id: 4,
          title: 'MacBook Pro M3 Max 16-inch',
          description: 'Top-spec MacBook Pro with M3 Max chip, 32GB RAM, 1TB SSD. Perfect for development.',
          category: 'Electronics',
          condition: 'Like New',
          currentPrice: 185000,
          startingPrice: 150000,
          campus: 'Goa',
          seller: { firstName: 'Sneha', lastName: 'Reddy' },
          images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=400&hei=300&fmt=jpeg&qlt=90&.v=1697311054290'],
          totalBids: 23,
          timeRemaining: '2d 14h',
          featured: true
        },
        {
          id: 5,
          title: 'Engineering Textbooks Bundle',
          description: 'Complete set of CS engineering books for all 4 years. Great condition.',
          category: 'Books & Study Materials',
          condition: 'Good',
          currentPrice: 4500,
          startingPrice: 3000,
          campus: 'Pilani',
          seller: { firstName: 'Vikram', lastName: 'Singh' },
          images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'],
          totalBids: 12,
          timeRemaining: '4d 6h',
          featured: false
        },
        {
          id: 6,
          title: 'Gaming Setup RTX 4090',
          description: 'Complete gaming setup with RTX 4090, 32GB RAM, includes monitor and peripherals.',
          category: 'Electronics',
          condition: 'New',
          currentPrice: 245000,
          startingPrice: 200000,
          campus: 'Hyderabad',
          seller: { firstName: 'Ananya', lastName: 'Gupta' },
          images: ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop'],
          totalBids: 18,
          timeRemaining: '1d 12h',
          featured: true
        }
      ];

      // Apply filters
      let filteredItems = mockItems;
      
      if (filters.category) {
        filteredItems = filteredItems.filter(item => item.category === filters.category);
      }
      
      if (filters.condition) {
        filteredItems = filteredItems.filter(item => item.condition === filters.condition);
      }
      
      if (filters.campus) {
        filteredItems = filteredItems.filter(item => item.campus === filters.campus);
      }
      
      if (filters.priceRange.min) {
        filteredItems = filteredItems.filter(item => item.currentPrice >= parseInt(filters.priceRange.min));
      }
      
      if (filters.priceRange.max) {
        filteredItems = filteredItems.filter(item => item.currentPrice <= parseInt(filters.priceRange.max));
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price-low':
          filteredItems.sort((a, b) => a.currentPrice - b.currentPrice);
          break;
        case 'price-high':
          filteredItems.sort((a, b) => b.currentPrice - a.currentPrice);
          break;
        case 'ending-soon':
          filteredItems.sort((a, b) => a.timeRemaining.localeCompare(b.timeRemaining));
          break;
        case 'most-bids':
          filteredItems.sort((a, b) => b.totalBids - a.totalBids);
          break;
        default:
          // newest first
          break;
      }

      setItems(filteredItems);
    } catch (error) {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: { min: '', max: '' },
      condition: '',
      campus: '',
      sortBy: 'newest'
    });
    setSearchParams({});
  };

  const ItemCard = ({ item }) => (
    <div className="browse-item-card">
      <div className="item-image-container">
        <img src={item.images[0]} alt={item.title} className="item-image" />
        <div className="item-overlay">
          {item.featured && <span className="featured-badge">⭐ Featured</span>}
          <span className="condition-badge">{item.condition}</span>
          <div className="item-actions">
            <button className="action-btn watchlist-btn" title="Add to Watchlist">
              👁️
            </button>
            <button className="action-btn share-btn" title="Share">
              📤
            </button>
          </div>
        </div>
      </div>
      
      <div className="item-details">
        <div className="item-header">
          <h3 className="item-title">{item.title}</h3>
          <span className="campus-tag">{item.campus}</span>
        </div>
        
        <p className="item-description">{item.description}</p>
        
        <div className="item-pricing">
          <div className="current-price">₹{item.currentPrice.toLocaleString()}</div>
          <div className="starting-price">Started at ₹{item.startingPrice.toLocaleString()}</div>
        </div>
        
        <div className="item-meta">
          <span className="seller-info">by {item.seller.firstName} {item.seller.lastName.charAt(0)}.</span>
          <span className="bid-count">{item.totalBids} bids</span>
          <span className="time-remaining">{item.timeRemaining} left</span>
        </div>
        
        <Link to={`/item/${item.id}`} className="view-item-btn">
          View Details & Bid
        </Link>
      </div>
    </div>
  );

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1>Browse Items</h1>
        <p>Discover amazing deals from fellow BITSians across all campuses</p>
      </div>

      <div className="browse-container">
        {/* Filters Sidebar */}
        <div className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All
            </button>
          </div>

          <div className="filter-section">
            <h4>Category</h4>
            <select 
              value={filters.category} 
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min ₹"
                value={filters.priceRange.min}
                onChange={(e) => handleFilterChange('priceRange', { 
                  ...filters.priceRange, 
                  min: e.target.value 
                })}
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={filters.priceRange.max}
                onChange={(e) => handleFilterChange('priceRange', { 
                  ...filters.priceRange, 
                  max: e.target.value 
                })}
              />
            </div>
          </div>

          <div className="filter-section">
            <h4>Condition</h4>
            <select 
              value={filters.condition} 
              onChange={(e) => handleFilterChange('condition', e.target.value)}
            >
              <option value="">Any Condition</option>
              {conditions.map(condition => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h4>Campus</h4>
            <select 
              value={filters.campus} 
              onChange={(e) => handleFilterChange('campus', e.target.value)}
            >
              <option value="">All Campuses</option>
              {campuses.map(campus => (
                <option key={campus} value={campus}>{campus}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="browse-main">
          <div className="browse-controls">
            <div className="results-info">
              <span>{items.length} items found</span>
            </div>
            
            <div className="sort-controls">
              <label>Sort by:</label>
              <select 
                value={filters.sortBy} 
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="ending-soon">Ending Soon</option>
                <option value="most-bids">Most Bids</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="item-skeleton">
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
            <div className="items-grid">
              {items.length > 0 ? (
                items.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))
              ) : (
                <div className="no-items">
                  <div className="no-items-icon">🔍</div>
                  <h3>No items found</h3>
                  <p>Try adjusting your filters or search terms</p>
                  <button onClick={clearFilters} className="btn-primary">
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
