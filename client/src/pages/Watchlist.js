import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Watchlist = () => {
  const { user } = useAuth();
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchWatchlist();
  }, [filter, sortBy]);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock watchlist data
      const mockWatchlist = [
        {
          id: 1,
          itemId: 'laptop-001',
          title: 'Dell XPS 15 9530',
          description: 'High-performance laptop with Intel i7 and RTX 4070.',
          category: 'Electronics',
          condition: 'Excellent',
          currentPrice: 125000,
          startingPrice: 100000,
          myMaxBid: 140000,
          images: ['https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/gray/notebook-xps-15-9530-gray-gallery-1.psd'],
          seller: { firstName: 'Vikram', lastName: 'Singh' },
          campus: 'Pilani',
          totalBids: 15,
          watchers: 34,
          status: 'active',
          auctionEndTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          addedToWatchlist: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          priceAlert: 130000,
          notifications: {
            priceChange: true,
            newBid: false,
            endingSoon: true
          },
          notes: 'Perfect for my CS projects',
          tags: ['laptop', 'gaming', 'work'],
          priority: 'high'
        },
        {
          id: 2,
          itemId: 'phone-002',
          title: 'Samsung Galaxy S24 Ultra',
          description: 'Latest Samsung flagship with S Pen and 200MP camera.',
          category: 'Electronics',
          condition: 'Like New',
          currentPrice: 75000,
          startingPrice: 65000,
          myMaxBid: 85000,
          images: ['https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-ultra-s928-sm-s928bztqins-thumb-539573043'],
          seller: { firstName: 'Priya', lastName: 'Patel' },
          campus: 'Goa',
          totalBids: 18,
          watchers: 56,
          status: 'active',
          auctionEndTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          addedToWatchlist: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          priceAlert: 80000,
          notifications: {
            priceChange: true,
            newBid: true,
            endingSoon: true
          },
          notes: 'Upgrade from my current phone',
          tags: ['smartphone', 'camera', 'urgent'],
          priority: 'high'
        },
        {
          id: 3,
          itemId: 'books-003',
          title: 'Data Structures and Algorithms',
          description: 'Complete set of DSA books by Cormen, Sedgewick.',
          category: 'Books & Study Materials',
          condition: 'Good',
          currentPrice: 3500,
          startingPrice: 2500,
          myMaxBid: 4000,
          images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'],
          seller: { firstName: 'Rohit', lastName: 'Kumar' },
          campus: 'Hyderabad',
          totalBids: 8,
          watchers: 23,
          status: 'active',
          auctionEndTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          addedToWatchlist: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          priceAlert: 3800,
          notifications: {
            priceChange: false,
            newBid: false,
            endingSoon: true
          },
          notes: 'Need for exam preparation',
          tags: ['books', 'study', 'algorithms'],
          priority: 'medium'
        },
        {
          id: 4,
          itemId: 'furniture-004',
          title: 'Ergonomic Office Chair',
          description: 'Herman Miller Aeron chair, excellent for long study sessions.',
          category: 'Furniture',
          condition: 'Very Good',
          currentPrice: 15000,
          startingPrice: 12000,
          myMaxBid: 18000,
          images: ['https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=300&fit=crop'],
          seller: { firstName: 'Ananya', lastName: 'Gupta' },
          campus: 'Goa',
          totalBids: 12,
          watchers: 28,
          status: 'ending_soon',
          auctionEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
          addedToWatchlist: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          priceAlert: 16000,
          notifications: {
            priceChange: true,
            newBid: true,
            endingSoon: true
          },
          notes: 'Perfect for my room setup',
          tags: ['furniture', 'chair', 'ergonomic'],
          priority: 'low'
        },
        {
          id: 5,
          itemId: 'gaming-005',
          title: 'Nintendo Switch OLED',
          description: 'Nintendo Switch OLED model with games and accessories.',
          category: 'Electronics',
          condition: 'Like New',
          currentPrice: 28000,
          startingPrice: 25000,
          myMaxBid: 32000,
          images: ['https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58'],
          seller: { firstName: 'Karan', lastName: 'Joshi' },
          campus: 'Pilani',
          totalBids: 22,
          watchers: 67,
          status: 'ended',
          auctionEndTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          addedToWatchlist: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          priceAlert: 30000,
          notifications: {
            priceChange: false,
            newBid: false,
            endingSoon: false
          },
          notes: 'For gaming during breaks',
          tags: ['gaming', 'nintendo', 'entertainment'],
          priority: 'low',
          finalPrice: 31500,
          winner: 'Someone else'
        }
      ];

      // Apply filters
      let filteredItems = mockWatchlist;
      if (filter !== 'all') {
        filteredItems = mockWatchlist.filter(item => {
          switch (filter) {
            case 'active':
              return item.status === 'active';
            case 'ending_soon':
              return item.status === 'ending_soon' || 
                     (item.status === 'active' && new Date(item.auctionEndTime) - new Date() < 24 * 60 * 60 * 1000);
            case 'ended':
              return item.status === 'ended';
            case 'high_priority':
              return item.priority === 'high';
            default:
              return true;
          }
        });
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          filteredItems.sort((a, b) => a.currentPrice - b.currentPrice);
          break;
        case 'price-high':
          filteredItems.sort((a, b) => b.currentPrice - a.currentPrice);
          break;
        case 'ending-soon':
          filteredItems.sort((a, b) => new Date(a.auctionEndTime) - new Date(b.auctionEndTime));
          break;
        case 'most-watched':
          filteredItems.sort((a, b) => b.watchers - a.watchers);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          filteredItems.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
          break;
        default:
          filteredItems.sort((a, b) => new Date(b.addedToWatchlist) - new Date(a.addedToWatchlist));
      }

      setWatchlistItems(filteredItems);
    } catch (error) {
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (itemId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setWatchlistItems(prev => prev.filter(item => item.id !== itemId));
      setSelectedItems(prev => prev.filter(id => id !== itemId));
      toast.success('Item removed from watchlist');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const updatePriceAlert = async (itemId, newAlert) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setWatchlistItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, priceAlert: newAlert } : item
      ));
      toast.success('Price alert updated');
    } catch (error) {
      toast.error('Failed to update price alert');
    }
  };

  const updateNotes = async (itemId, newNotes) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setWatchlistItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, notes: newNotes } : item
      ));
      toast.success('Notes updated');
    } catch (error) {
      toast.error('Failed to update notes');
    }
  };

  const bulkRemove = async () => {
    if (selectedItems.length === 0) {
      toast.warning('No items selected');
      return;
    }

    if (!window.confirm(`Remove ${selectedItems.length} items from watchlist?`)) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWatchlistItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      toast.success(`${selectedItems.length} items removed from watchlist`);
    } catch (error) {
      toast.error('Failed to remove items');
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAll = () => {
    setSelectedItems(watchlistItems.map(item => item.id));
  };

  const deselectAll = () => {
    setSelectedItems([]);
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

  const WatchlistCard = ({ item }) => (
    <div className={`watchlist-card ${item.status} ${selectedItems.includes(item.id) ? 'selected' : ''}`}>
      <div className="card-header">
        <div className="selection-controls">
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => toggleItemSelection(item.id)}
          />
        </div>
        
        <div className="priority-indicator">
          <span className={`priority-badge ${item.priority}`}>
            {item.priority === 'high' && '🔴'}
            {item.priority === 'medium' && '🟡'}
            {item.priority === 'low' && '🟢'}
            {item.priority}
          </span>
        </div>
        
        <div className="card-actions">
          <button 
            className="action-btn settings-btn"
            title="Settings"
            onClick={() => {
              const newAlert = prompt('Set price alert (₹):', item.priceAlert);
              if (newAlert && !isNaN(newAlert)) {
                updatePriceAlert(item.id, parseFloat(newAlert));
              }
            }}
          >
            ⚙️
          </button>
          <button 
            className="action-btn remove-btn"
            title="Remove from watchlist"
            onClick={() => removeFromWatchlist(item.id)}
          >
            ❌
          </button>
        </div>
      </div>
      
      <div className="card-content">
        <div className="item-image">
          <img src={item.images[0]} alt={item.title} />
          <div className="item-status">
            <span className={`status-badge ${item.status}`}>
              {item.status === 'active' && '🔴 Active'}
              {item.status === 'ending_soon' && '⏰ Ending Soon'}
              {item.status === 'ended' && '⏹️ Ended'}
            </span>
          </div>
        </div>
        
        <div className="item-details">
          <h3>{item.title}</h3>
          <p className="item-description">{item.description}</p>
          
          <div className="item-meta">
            <span className="seller">by {item.seller.firstName} {item.seller.lastName.charAt(0)}.</span>
            <span className="campus">{item.campus} Campus</span>
            <span className="condition">{item.condition}</span>
          </div>
          
          <div className="pricing-info">
            <div className="current-price">₹{item.currentPrice.toLocaleString()}</div>
            <div className="starting-price">Started at ₹{item.startingPrice.toLocaleString()}</div>
            {item.status === 'ended' && item.finalPrice && (
              <div className="final-price">Final: ₹{item.finalPrice.toLocaleString()}</div>
            )}
          </div>
          
          <div className="auction-info">
            <div className="bid-count">
              <span className="bid-icon">🎯</span>
              <span>{item.totalBids} bids</span>
            </div>
            <div className="time-remaining">
              <span className="time-icon">⏰</span>
              <span>{formatTimeRemaining(item.auctionEndTime)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="watchlist-meta">
        <div className="added-date">
          Added: {item.addedToWatchlist.toLocaleDateString()}
        </div>
        
        {item.priceAlert && (
          <div className="price-alert">
            🔔 Alert at ₹{item.priceAlert.toLocaleString()}
            {item.currentPrice >= item.priceAlert && (
              <span className="alert-triggered">⚠️ Triggered!</span>
            )}
          </div>
        )}
        
        {item.notes && (
          <div className="notes">
            📝 {item.notes}
          </div>
        )}
        
        {item.tags && item.tags.length > 0 && (
          <div className="tags">
            {item.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
        
        <div className="item-actions">
          <Link to={`/item/${item.itemId}`} className="action-btn view-btn">
            View Details
          </Link>
          
          {item.status === 'active' && (
            <Link to={`/item/${item.itemId}#bid`} className="action-btn bid-btn">
              Place Bid
            </Link>
          )}
          
          <button 
            className="action-btn notes-btn"
            onClick={() => {
              const newNotes = prompt('Update notes:', item.notes);
              if (newNotes !== null) {
                updateNotes(item.id, newNotes);
              }
            }}
          >
            Edit Notes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <h1>My Watchlist</h1>
        <p>Keep track of items you're interested in and get notified about price changes</p>
      </div>

      {/* Stats Overview */}
      <div className="watchlist-stats">
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <div className="stat-value">{watchlistItems.length}</div>
            <div className="stat-label">Items Watched</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <div className="stat-value">
              {watchlistItems.filter(item => item.status === 'active').length}
            </div>
            <div className="stat-label">Active Auctions</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <div className="stat-value">
              {watchlistItems.filter(item => 
                item.status === 'active' && 
                new Date(item.auctionEndTime) - new Date() < 24 * 60 * 60 * 1000
              ).length}
            </div>
            <div className="stat-label">Ending Soon</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <div className="stat-value">
              {watchlistItems.filter(item => 
                item.priceAlert && item.currentPrice >= item.priceAlert
              ).length}
            </div>
            <div className="stat-label">Price Alerts</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="watchlist-controls">
        <div className="filters">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Items</option>
            <option value="active">Active Auctions</option>
            <option value="ending_soon">Ending Soon</option>
            <option value="ended">Ended</option>
            <option value="high_priority">High Priority</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Recently Added</option>
            <option value="ending-soon">Ending Soon</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="priority">Priority</option>
            <option value="most-watched">Most Watched</option>
          </select>
        </div>
        
        <div className="bulk-actions">
          <span>
            {selectedItems.length > 0 ? `${selectedItems.length} selected` : 'Select items'}
          </span>
          
          {selectedItems.length > 0 ? (
            <>
              <button onClick={deselectAll} className="bulk-btn">
                Deselect All
              </button>
              <button onClick={bulkRemove} className="bulk-btn danger">
                Remove Selected
              </button>
            </>
          ) : (
            <button onClick={selectAll} className="bulk-btn">
              Select All
            </button>
          )}
        </div>
      </div>

      {/* Watchlist Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your watchlist...</p>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlistItems.length > 0 ? (
            watchlistItems.map(item => (
              <WatchlistCard key={item.id} item={item} />
            ))
          ) : (
            <div className="empty-watchlist">
              <div className="empty-icon">👁️</div>
              <h3>Your watchlist is empty</h3>
              <p>Start adding items you're interested in to keep track of them!</p>
              <Link to="/browse" className="browse-btn">
                <span>🔍</span>
                <span>Browse Items</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
