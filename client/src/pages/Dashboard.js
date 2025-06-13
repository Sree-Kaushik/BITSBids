import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentItems, setRecentItems] = useState([]);
  const [recentBids, setRecentBids] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStats({
        totalItems: 12,
        activeAuctions: 8,
        totalBids: 45,
        wonAuctions: 3,
        totalEarnings: 25000,
        totalSpent: 18500,
        watchlistItems: 15,
        completedDeals: 7
      });

      setRecentItems([
        {
          id: 1,
          title: 'MacBook Pro M3 Max',
          currentPrice: 185000,
          totalBids: 23,
          status: 'active',
          timeRemaining: '2d 14h',
          image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=400&hei=300&fmt=jpeg&qlt=90&.v=1697311054290'
        },
        {
          id: 2,
          title: 'iPhone 15 Pro Max',
          currentPrice: 89000,
          totalBids: 31,
          status: 'active',
          timeRemaining: '1d 8h',
          image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=400&hei=300&fmt=p-jpg&qlt=80&.v=1692895395658'
        },
        {
          id: 3,
          title: 'Gaming Setup RTX 4090',
          currentPrice: 245000,
          totalBids: 18,
          status: 'sold',
          timeRemaining: 'Ended',
          image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop'
        }
      ]);

      setRecentBids([
        {
          id: 1,
          itemTitle: 'PlayStation 5 Console',
          bidAmount: 35000,
          status: 'winning',
          timeRemaining: '3h 25m',
          seller: 'Ananya G.'
        },
        {
          id: 2,
          itemTitle: 'Study Desk & Chair Set',
          bidAmount: 8500,
          status: 'outbid',
          currentPrice: 9200,
          seller: 'Karan J.'
        },
        {
          id: 3,
          itemTitle: 'Engineering Textbooks',
          bidAmount: 4500,
          status: 'won',
          finalPrice: 4500,
          seller: 'Sneha R.'
        }
      ]);

      setNotifications([
        {
          id: 1,
          type: 'bid',
          message: 'You have been outbid on PlayStation 5 Console',
          time: '5 minutes ago',
          unread: true
        },
        {
          id: 2,
          type: 'auction',
          message: 'Your MacBook Pro M3 Max auction is ending soon',
          time: '1 hour ago',
          unread: true
        },
        {
          id: 3,
          type: 'sale',
          message: 'Your Gaming Setup has been sold for ₹2,45,000',
          time: '2 hours ago',
          unread: false
        }
      ]);

    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, change, color }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
        {change && (
          <div className={`stat-change ${change.type}`}>
            {change.type === 'positive' ? '↗' : '↘'} {change.value}
          </div>
        )}
      </div>
    </div>
  );

  const ItemCard = ({ item }) => (
    <div className="dashboard-item-card">
      <div className="item-image">
        <img src={item.image} alt={item.title} />
        <div className={`item-status ${item.status}`}>
          {item.status === 'active' ? '🔴 Live' : 
           item.status === 'sold' ? '✅ Sold' : '⏸️ Ended'}
        </div>
      </div>
      <div className="item-details">
        <h4>{item.title}</h4>
        <div className="item-price">₹{item.currentPrice.toLocaleString()}</div>
        <div className="item-meta">
          <span>{item.totalBids} bids</span>
          <span>{item.timeRemaining}</span>
        </div>
      </div>
      <Link to={`/item/${item.id}`} className="item-action">
        View Details
      </Link>
    </div>
  );

  const BidCard = ({ bid }) => (
    <div className={`bid-card ${bid.status}`}>
      <div className="bid-info">
        <h4>{bid.itemTitle}</h4>
        <div className="bid-amount">Your bid: ₹{bid.bidAmount.toLocaleString()}</div>
        <div className="bid-seller">Seller: {bid.seller}</div>
      </div>
      <div className="bid-status">
        {bid.status === 'winning' && (
          <div className="status-badge winning">
            🏆 Winning
            <div className="time-remaining">{bid.timeRemaining} left</div>
          </div>
        )}
        {bid.status === 'outbid' && (
          <div className="status-badge outbid">
            ⚠️ Outbid
            <div className="current-price">Current: ₹{bid.currentPrice.toLocaleString()}</div>
          </div>
        )}
        {bid.status === 'won' && (
          <div className="status-badge won">
            🎉 Won
            <div className="final-price">Final: ₹{bid.finalPrice.toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.firstName}! 👋</h1>
          <p>Here's what's happening with your auctions and bids</p>
        </div>
        <div className="quick-actions">
          <Link to="/create-item" className="quick-action-btn primary">
            <span>➕</span>
            <span>Create Auction</span>
          </Link>
          <Link to="/browse" className="quick-action-btn secondary">
            <span>🔍</span>
            <span>Browse Items</span>
          </Link>
        </div>
      </div>

      <div className="dashboard-stats">
        <StatCard
          icon="🏪"
          title="Your Items"
          value={stats.totalItems}
          change={{ type: 'positive', value: '+2 this week' }}
          color="blue"
        />
        <StatCard
          icon="🔴"
          title="Active Auctions"
          value={stats.activeAuctions}
          color="green"
        />
        <StatCard
          icon="💰"
          title="Total Bids"
          value={stats.totalBids}
          change={{ type: 'positive', value: '+8 today' }}
          color="yellow"
        />
        <StatCard
          icon="🏆"
          title="Won Auctions"
          value={stats.wonAuctions}
          color="purple"
        />
      </div>

      <div className="dashboard-tabs">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'items', label: 'My Items', icon: '🏪' },
          { id: 'bids', label: 'My Bids', icon: '💰' },
          { id: 'notifications', label: 'Notifications', icon: '🔔' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="overview-section">
                <div className="section-header">
                  <h3>Recent Items</h3>
                  <Link to="/my-items" className="see-all">See all</Link>
                </div>
                <div className="items-list">
                  {recentItems.slice(0, 3).map(item => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>

              <div className="overview-section">
                <div className="section-header">
                  <h3>Recent Bids</h3>
                  <Link to="/my-bids" className="see-all">See all</Link>
                </div>
                <div className="bids-list">
                  {recentBids.slice(0, 3).map(bid => (
                    <BidCard key={bid.id} bid={bid} />
                  ))}
                </div>
              </div>
            </div>

            <div className="earnings-section">
              <h3>Earnings Overview</h3>
              <div className="earnings-cards">
                <div className="earning-card">
                  <div className="earning-icon">💵</div>
                  <div className="earning-content">
                    <h4>Total Earnings</h4>
                    <div className="earning-amount">₹{stats.totalEarnings.toLocaleString()}</div>
                  </div>
                </div>
                <div className="earning-card">
                  <div className="earning-icon">💸</div>
                  <div className="earning-content">
                    <h4>Total Spent</h4>
                    <div className="earning-amount">₹{stats.totalSpent.toLocaleString()}</div>
                  </div>
                </div>
                <div className="earning-card">
                  <div className="earning-icon">💰</div>
                  <div className="earning-content">
                    <h4>Net Profit</h4>
                    <div className="earning-amount positive">
                      ₹{(stats.totalEarnings - stats.totalSpent).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="items-tab">
            <div className="tab-header">
              <h3>My Items</h3>
              <Link to="/create-item" className="create-btn">
                ➕ Create New Auction
              </Link>
            </div>
            <div className="items-grid">
              {recentItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bids' && (
          <div className="bids-tab">
            <div className="tab-header">
              <h3>My Bids</h3>
              <Link to="/browse" className="browse-btn">
                🔍 Browse More Items
              </Link>
            </div>
            <div className="bids-grid">
              {recentBids.map(bid => (
                <BidCard key={bid.id} bid={bid} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="notifications-tab">
            <div className="tab-header">
              <h3>Notifications</h3>
              <button className="mark-all-read">Mark all as read</button>
            </div>
            <div className="notifications-list">
              {notifications.map(notification => (
                <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
                  <div className="notification-icon">
                    {notification.type === 'bid' ? '💰' :
                     notification.type === 'auction' ? '⏰' : '🎉'}
                  </div>
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                  {notification.unread && <div className="unread-dot"></div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
