import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/browse', label: 'Browse', icon: '🔍' },
    { path: '/categories', label: 'Categories', icon: '📂' },
    { path: '/how-it-works', label: 'How It Works', icon: '❓' },
    { path: '/contact', label: 'Contact', icon: '📞' }
  ];

  const userMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/my-auctions', label: 'My Auctions', icon: '🏪' },
    { path: '/my-bids', label: 'My Bids', icon: '💰' },
    { path: '/watchlist', label: 'Watchlist', icon: '👁️' },
    { path: '/activity', label: 'Activity', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <header className={`professional-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-background-overlay"></div>
      
      <div className="container">
        <div className="header-content">
          {/* Enhanced Logo with BITS Pilani Logo */}
          <Link to="/" className="logo-enhanced">
            <div className="logo-container">
              <div className="logo-icon-wrapper">
                <div className="bits-logo-container">
                  <img 
                    src="/images/bits-logo.svg" 
                    alt="BITS Pilani Logo" 
                    className="bits-logo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="bits-logo-fallback" style={{ display: 'none' }}>
                    <span>🎓</span>
                  </div>
                </div>
                <div className="logo-pulse-ring"></div>
              </div>
              <div className="logo-text">
                <h1 className="logo-title">
                  <span className="bits-text">BITS</span>
                  <span className="bids-text">Bids</span>
                </h1>
                <span className="logo-subtitle">Student Marketplace</span>
              </div>
            </div>
            <div className="logo-glow-effect"></div>
          </Link>

          {/* Enhanced Navigation */}
          <nav className="main-navigation">
            <ul className="nav-list">
              {navLinks.map((link) => (
                <li key={link.path} className="nav-item">
                  <Link 
                    to={link.path}
                    className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{link.icon}</span>
                    <span className="nav-text">{link.label}</span>
                    <div className="nav-link-glow"></div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Enhanced User Section */}
          <div className="user-section">
            {isAuthenticated ? (
              <div className="authenticated-user">
                <Link to="/create-item" className="create-auction-btn">
                  <span className="btn-icon">➕</span>
                  <span className="btn-text">Create Auction</span>
                  <div className="btn-shimmer"></div>
                </Link>

                <div className="notifications-container">
                  <button className="notification-btn">
                    <span className="notification-icon">🔔</span>
                    <span className="notification-badge">3</span>
                    <div className="notification-pulse"></div>
                  </button>
                </div>

                <div className="user-menu-container">
                  <button 
                    className="user-menu-trigger"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <div className="user-avatar-wrapper">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Profile" className="user-avatar" />
                      ) : (
                        <div className="user-avatar-placeholder">
                          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </div>
                      )}
                      <div className="avatar-status-indicator"></div>
                    </div>
                    <div className="user-info">
                      <span className="user-name">{user?.firstName} {user?.lastName}</span>
                      <span className="user-campus">{user?.campus} Campus</span>
                    </div>
                    <span className="dropdown-arrow">▼</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="user-dropdown">
                      <div className="dropdown-header">
                        <div className="user-details">
                          <h4>{user?.firstName} {user?.lastName}</h4>
                          <p>{user?.email}</p>
                          <span className="campus-badge">{user?.campus}</span>
                        </div>
                      </div>
                      
                      <div className="dropdown-menu">
                        {userMenuItems.map((item) => (
                          <Link 
                            key={item.path}
                            to={item.path}
                            className="dropdown-item"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <span className="item-icon">{item.icon}</span>
                            <span className="item-text">{item.label}</span>
                            <span className="item-arrow">→</span>
                          </Link>
                        ))}
                        
                        <div className="dropdown-divider"></div>
                        
                        <button 
                          className="dropdown-item logout-item"
                          onClick={handleLogout}
                        >
                          <span className="item-icon">🚪</span>
                          <span className="item-text">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="guest-user">
                <Link to="/login" className="login-btn">
                  <span className="btn-icon">🔑</span>
                  <span className="btn-text">Login</span>
                </Link>
                <Link to="/register" className="register-btn">
                  <span className="btn-icon">🚀</span>
                  <span className="btn-text">Join BITSBids</span>
                  <div className="btn-shimmer"></div>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
              <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
              <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="mobile-navigation">
            <div className="mobile-nav-content">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-text">{link.label}</span>
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="mobile-auth-buttons">
                  <Link to="/login" className="mobile-login-btn">Login</Link>
                  <Link to="/register" className="mobile-register-btn">Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
