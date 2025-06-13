import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Activity = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockActivities = [
        {
          _id: '1',
          type: 'bid_placed',
          title: 'MacBook Pro M3 Max 16"',
          message: 'You placed a bid of ₹1,85,000',
          amount: 185000,
          status: 'winning',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          item: { _id: 'item1', category: 'Electronics' },
          icon: '💎'
        },
        {
          _id: '2',
          type: 'auction_won',
          title: 'iPhone 15 Pro Max',
          message: 'Congratulations! You won this auction',
          amount: 89000,
          status: 'completed',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          item: { _id: 'item2', category: 'Electronics' },
          icon: '🏆'
        },
        {
          _id: '3',
          type: 'outbid',
          title: 'Gaming Setup RTX 4090',
          message: 'You were outbid by ₹8,000',
          amount: 245000,
          status: 'outbid',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          item: { _id: 'item3', category: 'Electronics' },
          icon: '⚡'
        },
        {
          _id: '4',
          type: 'item_sold',
          title: 'ThinkPad X1 Carbon',
          message: 'Your item was sold successfully',
          amount: 75000,
          status: 'completed',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          item: { _id: 'item4', category: 'Electronics' },
          icon: '✨'
        },
        {
          _id: '5',
          type: 'watchlist_added',
          title: 'Study Chair Ergonomic',
          message: 'Added to your watchlist',
          amount: null,
          status: 'info',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          item: { _id: 'item5', category: 'Furniture' },
          icon: '👁️'
        },
        {
          _id: '6',
          type: 'bid_placed',
          title: 'Engineering Textbooks',
          message: 'You placed a bid of ₹4,500',
          amount: 4500,
          status: 'active',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          item: { _id: 'item6', category: 'Books' },
          icon: '💰'
        },
        {
          _id: '7',
          type: 'auction_created',
          title: 'Wireless Headphones',
          message: 'Your auction went live',
          amount: 8000,
          status: 'active',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          item: { _id: 'item7', category: 'Electronics' },
          icon: '🚀'
        },
        {
          _id: '8',
          type: 'bid_received',
          title: 'Wireless Headphones',
          message: 'Someone bid ₹8,500 on your item',
          amount: 8500,
          status: 'active',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000),
          item: { _id: 'item7', category: 'Electronics' },
          icon: '📈'
        }
      ];
      
      setActivities(mockActivities);
      
    } catch (error) {
      toast.error('Failed to load activity');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredActivities = () => {
    let filtered = activities;
    
    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter(activity => {
        switch (filter) {
          case 'bids':
            return ['bid_placed', 'outbid', 'auction_won'].includes(activity.type);
          case 'sales':
            return ['item_sold', 'bid_received', 'auction_created'].includes(activity.type);
          case 'watchlist':
            return activity.type === 'watchlist_added';
          default:
            return true;
        }
      });
    }
    
    // Filter by time
    if (timeFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(activity => {
        const activityTime = new Date(activity.timestamp);
        const diffHours = (now - activityTime) / (1000 * 60 * 60);
        
        switch (timeFilter) {
          case 'today':
            return diffHours <= 24;
          case 'week':
            return diffHours <= 24 * 7;
          case 'month':
            return diffHours <= 24 * 30;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  };

  const getActivityTypeLabel = (type) => {
    switch (type) {
      case 'bid_placed': return 'Bid Placed';
      case 'auction_won': return 'Auction Won';
      case 'outbid': return 'Outbid';
      case 'item_sold': return 'Item Sold';
      case 'watchlist_added': return 'Watchlist';
      case 'auction_created': return 'Auction Created';
      case 'bid_received': return 'Bid Received';
      default: return 'Activity';
    }
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  const ActivityItem = ({ activity }) => (
    <div className={`ultra-activity-item activity-${activity.status}`}>
      <div className="activity-glow"></div>
      <div className={`activity-border border-${activity.status}`}></div>
      
      <div className="activity-icon-container">
        <div className="activity-icon">{activity.icon}</div>
        <div className="activity-pulse"></div>
      </div>
      
      <div className="activity-content">
        <div className="activity-header">
          <h4 className="activity-title">{activity.title}</h4>
          {activity.amount && (
            <span className="activity-amount">₹{activity.amount.toLocaleString()}</span>
          )}
        </div>
        <p className="activity-message">{activity.message}</p>
        <div className="activity-meta">
          <span className="activity-time">{getRelativeTime(activity.timestamp)}</span>
          <span className={`activity-status-badge status-${activity.status}`}>
            {getActivityTypeLabel(activity.type)}
          </span>
        </div>
      </div>
      
      <Link to={`/item/${activity.item._id}`} className="activity-link">
        <span>→</span>
      </Link>
    </div>
  );

  const filteredActivities = getFilteredActivities();

  if (loading) {
    return (
      <div className="enhanced-loading">
        <div className="loading-animation">
          <div className="loading-spinner"></div>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <p>Loading your activity...</p>
      </div>
    );
  }

  return (
    <div className="my-auctions-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Activity Timeline</h1>
          <p className="page-subtitle">Complete history of your marketplace activity</p>
        </div>

        {/* Activity Stats */}
        <div className="auction-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{activities.length}</div>
            <div className="stat-label">Total Activities</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-value">
              {activities.filter(a => a.type === 'bid_placed').length}
            </div>
            <div className="stat-label">Bids Placed</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-value">
              {activities.filter(a => a.type === 'auction_won').length}
            </div>
            <div className="stat-label">Auctions Won</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✨</div>
            <div className="stat-value">
              {activities.filter(a => a.type === 'item_sold').length}
            </div>
            <div className="stat-label">Items Sold</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="activity-filters">
          <div className="filter-group">
            <h3>Activity Type</h3>
            <div className="filter-buttons">
              {[
                { id: 'all', label: 'All Activities' },
                { id: 'bids', label: 'Bids & Wins' },
                { id: 'sales', label: 'Sales & Listings' },
                { id: 'watchlist', label: 'Watchlist' }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  className={`filter-btn ${filter === filterOption.id ? 'active' : ''}`}
                  onClick={() => setFilter(filterOption.id)}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <h3>Time Period</h3>
            <div className="filter-buttons">
              {[
                { id: 'all', label: 'All Time' },
                { id: 'today', label: 'Today' },
                { id: 'week', label: 'This Week' },
                { id: 'month', label: 'This Month' }
              ].map((timeOption) => (
                <button
                  key={timeOption.id}
                  className={`filter-btn ${timeFilter === timeOption.id ? 'active' : ''}`}
                  onClick={() => setTimeFilter(timeOption.id)}
                >
                  {timeOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        {filteredActivities.length > 0 ? (
          <div className="ultra-timeline">
            {filteredActivities.map((activity, index) => (
              <div key={activity._id} className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  <div className="marker-pulse"></div>
                </div>
                <ActivityItem activity={activity} />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-items">
            <div className="no-items-icon">📊</div>
            <h3>No activities found</h3>
            <p>
              {filter === 'all' && timeFilter === 'all' 
                ? "You haven't had any activity yet. Start bidding or creating auctions!"
                : "No activities match your current filters. Try adjusting the filters above."
              }
            </p>
            {filter === 'all' && timeFilter === 'all' && (
              <div className="empty-actions">
                <Link to="/" className="btn btn-primary">
                  Browse Items
                </Link>
                <Link to="/create-item" className="btn btn-secondary">
                  Create Auction
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
