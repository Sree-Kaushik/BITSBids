import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AdvancedSearch = ({ onSearch, initialFilters = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    campus: 'all',
    priceMin: '',
    priceMax: '',
    condition: 'all',
    status: 'active',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    endingIn: 'all',
    bidCount: 'all',
    ...initialFilters
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Electronics',
    'Books & Study Materials',
    'Fashion & Accessories',
    'Sports & Fitness',
    'Furniture',
    'Vehicles',
    'Services',
    'Others'
  ];

  const campuses = [
    { value: 'pilani', label: 'Pilani' },
    { value: 'goa', label: 'Goa' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'dubai', label: 'Dubai' }
  ];

  const conditions = [
    'New',
    'Like New',
    'Very Good',
    'Good',
    'Fair',
    'Poor'
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Date Listed' },
    { value: 'auctionEndTime', label: 'Ending Soon' },
    { value: 'currentPrice', label: 'Price' },
    { value: 'totalBids', label: 'Most Bids' },
    { value: 'title', label: 'Title' }
  ];

  useEffect(() => {
    // Load filters from URL params
    const params = new URLSearchParams(location.search);
    const urlFilters = {};
    
    params.forEach((value, key) => {
      urlFilters[key] = value;
    });
    
    if (Object.keys(urlFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...urlFilters }));
    }
  }, [location.search]);

  useEffect(() => {
    // Debounced search suggestions
    const timer = setTimeout(() => {
      if (filters.search.length > 2) {
        fetchSuggestions(filters.search);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(`/api/items/suggestions?q=${query}`);
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Update URL with search params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value);
      }
    });
    
    navigate(`/?${params.toString()}`);
    
    // Call parent search function
    if (onSearch) {
      onSearch(filters);
    }
    
    setIsLoading(false);
    setShowSuggestions(false);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      search: '',
      category: 'all',
      campus: 'all',
      priceMin: '',
      priceMax: '',
      condition: 'all',
      status: 'active',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      endingIn: 'all',
      bidCount: 'all'
    };
    
    setFilters(defaultFilters);
    navigate('/');
    
    if (onSearch) {
      onSearch(defaultFilters);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFilters(prev => ({ ...prev, search: suggestion }));
    setShowSuggestions(false);
  };

  return (
    <div className="advanced-search">
      <form onSubmit={handleSearch} className="search-form">
        {/* Main Search Bar */}
        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search items, descriptions, or sellers..."
              className="search-input"
            />
            <button type="submit" className="search-btn" disabled={isLoading}>
              {isLoading ? (
                <div className="spinner-small"></div>
              ) : (
                <span>🔍</span>
              )}
              Search
            </button>
          </div>
          
          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-icon">🔍</span>
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div className="filters-container">
          <div className="filter-row">
            {/* Category Filter */}
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Campus Filter */}
            <div className="filter-group">
              <label>Campus</label>
              <select
                value={filters.campus}
                onChange={(e) => handleFilterChange('campus', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Campuses</option>
                {campuses.map(campus => (
                  <option key={campus.value} value={campus.value}>
                    {campus.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div className="filter-group">
              <label>Condition</label>
              <select
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="filter-select"
              >
                <option value="all">Any Condition</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="active">Active Auctions</option>
                <option value="ended">Ended Auctions</option>
                <option value="all">All Statuses</option>
              </select>
            </div>
          </div>

          <div className="filter-row">
            {/* Price Range */}
            <div className="filter-group price-range">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  placeholder="Min ₹"
                  className="price-input"
                />
                <span className="price-separator">to</span>
                <input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  placeholder="Max ₹"
                  className="price-input"
                />
              </div>
            </div>

            {/* Ending Time Filter */}
            <div className="filter-group">
              <label>Ending In</label>
              <select
                value={filters.endingIn}
                onChange={(e) => handleFilterChange('endingIn', e.target.value)}
                className="filter-select"
              >
                <option value="all">Any Time</option>
                <option value="1h">Next Hour</option>
                <option value="6h">Next 6 Hours</option>
                <option value="24h">Next 24 Hours</option>
                <option value="3d">Next 3 Days</option>
                <option value="7d">Next Week</option>
              </select>
            </div>

            {/* Bid Count Filter */}
            <div className="filter-group">
              <label>Bid Activity</label>
              <select
                value={filters.bidCount}
                onChange={(e) => handleFilterChange('bidCount', e.target.value)}
                className="filter-select"
              >
                <option value="all">Any Activity</option>
                <option value="0">No Bids Yet</option>
                <option value="1-5">1-5 Bids</option>
                <option value="6-20">6-20 Bids</option>
                <option value="20+">20+ Bids</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="filter-group">
              <label>Sort By</label>
              <div className="sort-controls">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="filter-select"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className={`sort-order-btn ${filters.sortOrder === 'desc' ? 'desc' : 'asc'}`}
                  onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
                  title={filters.sortOrder === 'desc' ? 'Descending' : 'Ascending'}
                >
                  {filters.sortOrder === 'desc' ? '↓' : '↑'}
                </button>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="filter-actions">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Apply Filters'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClearFilters}
            >
              Clear All
            </button>
          </div>
        </div>
      </form>

      {/* Active Filters Display */}
      <div className="active-filters">
        {Object.entries(filters).map(([key, value]) => {
          if (value && value !== 'all' && value !== '' && key !== 'sortBy' && key !== 'sortOrder') {
            return (
              <span key={key} className="filter-tag">
                {key === 'search' ? `"${value}"` : `${key}: ${value}`}
                <button
                  onClick={() => handleFilterChange(key, key === 'status' ? 'active' : 'all')}
                  className="remove-filter"
                >
                  ×
                </button>
              </span>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default AdvancedSearch;
