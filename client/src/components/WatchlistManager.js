import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const WatchlistManager = () => {
  const { user } = useAuth();
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: 'active',
    priority: 'all',
    sortBy: 'addedAt',
    sortOrder: 'desc'
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    fetchWatchlist();
  }, [filters]);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/watchlist', {
        params: filters
      });
      setWatchlistItems(response.data.data.items);
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (itemId) => {
    try {
      await axios.delete(`/api/watchlist/${itemId}`);
      toast.success('Item removed from watchlist');
      fetchWatchlist();
    } catch (error) {
      toast.error('Failed to remove item from watchlist');
    }
  };

  const updateWatchlistItem = async (itemId, updates) => {
    try {
      await axios.put(`/api/watchlist/${itemId}`, updates);
      toast.success('Watchlist item updated');
      fetchWatchlist();
    } catch (error) {
      toast.error('Failed to update watchlist item');
    }
  };

  const handleBulkRemove = async () => {
    try {
      await Promise.all(
        selectedItems.map(itemId => 
          axios.delete(`/api/watchlist/${itemId}`)
        )
      );
      toast.success(`${selectedItems.length} items removed from watchlist`);
      setSelectedItems([]);
      setShowBulkActions(false);
      fetchWatchlist();
    } catch (error) {
      toast.error('Failed to remove items');
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

  const WatchlistCard = ({ watchlistItem }) => {
    const { item } = watchlistItem;
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
      priority: watchlistItem.priority,
      notes: watchlistItem.notes || '',
      notifications: watchlistItem.notifications
    });

    const timeRemaining = calculateTimeRemaining(item.auctionEndTime);
    const isSelected = selectedItems.includes(item._id);

    const handleSettingsUpdate = () => {
      updateWatchlistItem(item._id, settings);
      setShowSettings(false);
    };

    return (
      <div className={`watchlist-card ${isSelected ? 'selected' : ''}`}>
        <div className="card-header">
          <div className="selection-controls">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedItems(prev => [...prev, item._id]);
                } else {
                  setSelectedItems(prev => prev.filter(id => id !== item._id));
                }
              }}
            />
          </div>
          
          <div className="priority-indicator">
            <span className={`priority-badge ${watchlistItem.priority}`}>
              {watchlistItem.priority.toUpperCase()}
            </span>
          </div>
          
          <div className="card-actions">
            <button
              className="action-btn settings-btn"
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              ⚙️
            </button>
            <button
              className="action-btn remove-btn"
              onClick={() => removeFromWatchlist(item._id)}
              title="Remove from watchlist"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="card-content">
          <div className="item-image">
            {item.images && item.images.length > 0 ? (
              <img src={item.images[0]} alt={item.title} />
            ) : (
              <div className="no-image">📷</div>
            )}
            
            <div className="item-status">
              <span className={`status-badge ${item.status}`}>
                {item.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="item-details">
            <h3 className="item-title">
              <Link to={`/item/${item._id}`}>{item.title}</Link>
            </h3>
            
            <div className="item-meta">
              <span className="category">{item.category}</span>
              <span className="campus">{item.campus} Campus</span>
            </div>

            <div className="pricing-info">
              <div className="current-price">
                ₹{item.currentPrice.toLocaleString()}
              </div>
              <div className="starting-price">
                Started at ₹{item.startingPrice.toLocaleString()}
              </div>
            </div>

            <div className="auction-info">
              <div className="bid-count">
                {item.totalBids} bids
              </div>
              <div className={`time-remaining ${timeRemaining.urgent ? 'urgent' : ''}`}>
                ⏰ {timeRemaining.text}
              </div>
            </div>

            <div className="watchlist-meta">
              <span className="added-date">
                Added {new Date(watchlistItem.addedAt).toLocaleDateString()}
              </span>
              {watchlistItem.notes && (
                <div className="notes">
                  📝 {watchlistItem.notes}
                </div>
              )}
            </div>

            {watchlistItem.tags && watchlistItem.tags.length > 0 && (
              <div className="tags">
                {watchlistItem.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {showSettings && (
          <div className="settings-panel">
            <h4>Watchlist Settings</h4>
            
            <div className="setting-group">
              <label>Priority</label>
              <select
                value={settings.priority}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  priority: e.target.value
                }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="setting-group">
              <label>Notes</label>
              <textarea
                value={settings.notes}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notes: e.target.value
                }))}
                placeholder="Add personal notes..."
                rows="2"
              />
            </div>

            <div className="setting-group">
              <label>Notifications</label>
              <div className="notification-settings">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.endingAlert.enabled}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        endingAlert: {
                          ...prev.notifications.endingAlert,
                          enabled: e.target.checked
                        }
                      }
                    }))}
                  />
                  Ending alerts
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.outbidAlert.enabled}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        outbidAlert: {
                          ...prev.notifications.outbidAlert,
                          enabled: e.target.checked
                        }
                      }
                    }))}
                  />
                  Outbid alerts
                </label>
              </div>
            </div>

            <div className="settings-actions">
              <button 
                className="btn btn-primary"
                onClick={handleSettingsUpdate}
              >
                Save Settings
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="watchlist-manager">
      <div className="watchlist-header">
        <h1>My Watchlist</h1>
        <p>Track items you're interested in and get notified about important updates</p>
      </div>

      {/* Watchlist Stats */}
      <div className="watchlist-stats">
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-value">{stats.totalItems || 0}</div>
          <div className="stat-label">Total Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔴</div>
          <div className="stat-value">{stats.activeItems || 0}</div>
          <div className="stat-label">Active Auctions</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">₹{Math.round((stats.totalValue || 0) / 1000)}K</div>
          <div className="stat-label">Total Value</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">₹{Math.round(stats.avgPrice || 0)}</div>
          <div className="stat-label">Avg Price</div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="watchlist-controls">
        <div className="filters">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
            <option value="sold">Sold</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
          >
            <option value="addedAt">Date Added</option>
            <option value="auctionEndTime">Ending Soon</option>
            <option value="currentPrice">Price</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {selectedItems.length > 0 && (
          <div className="bulk-actions">
            <span>{selectedItems.length} items selected</span>
            <button 
              className="btn btn-danger"
              onClick={handleBulkRemove}
            >
              Remove Selected
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedItems([])}
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Watchlist Items */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your watchlist...</p>
        </div>
      ) : watchlistItems.length > 0 ? (
        <div className="watchlist-grid">
          {watchlistItems.map((watchlistItem) => (
            <WatchlistCard 
              key={watchlistItem._id} 
              watchlistItem={watchlistItem} 
            />
          ))}
        </div>
      ) : (
        <div className="empty-watchlist">
          <div className="empty-icon">👁️</div>
          <h3>Your watchlist is empty</h3>
          <p>Start adding items you're interested in to keep track of them!</p>
          <Link to="/" className="btn btn-primary">
            Browse Items
          </Link>
        </div>
      )}
    </div>
  );
};

export default WatchlistManager;
