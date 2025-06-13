import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const EnhancedHeader = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="enhanced-header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-content">
              <span className="logo-icon">🎯</span>
              <span className="logo-text">BITSBids</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="header-search">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search auctions, items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                🔍
              </button>
            </form>
          </div>

          {/* Navigation */}
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link 
              to="/" 
              className={`nav-link ${isActivePath('/') ? 'active' : ''}`}
            >
              🏠 Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActivePath('/dashboard') ? 'active' : ''}`}
                >
                  📊 Dashboard
                </Link>
                <Link 
                  to="/create-item" 
                  className={`nav-link ${isActivePath('/create-item') ? 'active' : ''}`}
                >
                  ➕ Sell Item
                </Link>
                
                {/* Notifications */}
                <div className="notifications-dropdown">
                  <button 
                    className="notifications-btn"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    🔔
                    {notifications.length > 0 && (
                      <span className="notification-badge">{notifications.length}</span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="notifications-menu">
                      <div className="notifications-header">
                        <h4>Notifications</h4>
                      </div>
                      <div className="notifications-list">
                        {notifications.length > 0 ? (
                          notifications.map((notification, index) => (
                            <div key={index} className="notification-item">
                              <span className="notification-icon">{notification.icon}</span>
                              <div className="notification-content">
                                <p>{notification.message}</p>
                                <span className="notification-time">{notification.time}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="no-notifications">
                            <p>No new notifications</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="user-menu">
                  <button className="user-btn">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="user-avatar" />
                    ) : (
                      <div className="user-avatar-placeholder">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </div>
                    )}
                    <span className="user-name">{user?.firstName}</span>
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  
                  <div className="dropdown">
                    <Link to="/profile" className="dropdown-link">
                      👤 Profile
                    </Link>
                    <Link to="/my-auctions" className="dropdown-link">
                      🎯 My Auctions
                    </Link>
                    <Link to="/watchlist" className="dropdown-link">
                      👁️ Watchlist
                    </Link>
                    <Link to="/settings" className="dropdown-link">
                      ⚙️ Settings
                    </Link>
                    <hr className="dropdown-divider" />
                    <button onClick={handleLogout} className="dropdown-link logout-btn">
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  🔑 Login
                </Link>
                <Link to="/register" className="nav-link register-btn">
                  📝 Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default EnhancedHeader;
