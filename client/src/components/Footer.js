import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    quickLinks: [
      { label: 'Home', path: '/' },
      { label: 'Browse Items', path: '/browse' },
      { label: 'Categories', path: '/categories' },
      { label: 'How It Works', path: '/how-it-works' },
      { label: 'Create Auction', path: '/create-item' }
    ],
    account: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'My Auctions', path: '/my-auctions' },
      { label: 'My Bids', path: '/my-bids' },
      { label: 'Watchlist', path: '/watchlist' },
      { label: 'Profile', path: '/profile' }
    ],
    support: [
      { label: 'Help Center', path: '/help' },
      { label: 'Contact Us', path: '/contact' },
      { label: 'Safety Guidelines', path: '/safety' },
      { label: 'Dispute Resolution', path: '/disputes' },
      { label: 'Report Issue', path: '/report' }
    ],
    legal: [
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Cookie Policy', path: '/cookies' },
      { label: 'Community Guidelines', path: '/guidelines' },
      { label: 'Intellectual Property', path: '/ip' }
    ]
  };

  const campuses = [
    { name: 'Pilani', code: 'PIL', students: '7,453' },
    { name: 'Goa', code: 'GOA', students: '4,658' },
    { name: 'Hyderabad', code: 'HYD', students: '5,590' },
    { name: 'Dubai', code: 'DUB', students: '931' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'LinkedIn', icon: '💼', url: '#' },
    { name: 'YouTube', icon: '📺', url: '#' }
  ];

  return (
    <footer className="professional-footer">
      <div className="footer-background">
        <div className="footer-pattern"></div>
        <div className="footer-gradient"></div>
      </div>

      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Company Section */}
          <div className="footer-section company-section">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <img 
                  src="/images/bits-logo.svg" 
                  alt="BITS Pilani" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="logo-fallback" style={{ display: 'none' }}>🎓</div>
              </div>
              <div className="footer-logo-text">
                <span className="bits-text">BITS</span>
                <span className="bids-text">Bids</span>
              </div>
            </div>
            
            <p className="footer-description">
              The premier auction platform for BITS Pilani students across all campuses. 
              Buy, sell, and trade with confidence in our trusted student community.
            </p>

            <div className="footer-stats">
              <div className="stat-item">
                <span className="stat-number">18,632+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">3,247</span>
                <span className="stat-label">Active Listings</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">₹18.5M</span>
                <span className="stat-label">Total Traded</span>
              </div>
            </div>

            <div className="social-links">
              <h4>Connect With Us</h4>
              <div className="social-icons">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.url} 
                    className="social-link"
                    title={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="social-icon">{social.icon}</span>
                    <span className="social-name">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-section-title">
              <span className="title-icon">🔗</span>
              Quick Links
            </h3>
            <ul className="footer-links">
              {footerSections.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="footer-section">
            <h3 className="footer-section-title">
              <span className="title-icon">👤</span>
              Account
            </h3>
            <ul className="footer-links">
              {footerSections.account.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3 className="footer-section-title">
              <span className="title-icon">🛠️</span>
              Support
            </h3>
            <ul className="footer-links">
              {footerSections.support.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h3 className="footer-section-title">
              <span className="title-icon">⚖️</span>
              Legal
            </h3>
            <ul className="footer-links">
              {footerSections.legal.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Campus Network Section */}
        <div className="campus-network-section">
          <h3 className="campus-network-title">
            <span className="network-icon">🌐</span>
            BITS Campus Network
          </h3>
          <div className="campus-grid">
            {campuses.map((campus, index) => (
              <div key={index} className="campus-card">
                <div className="campus-info">
                  <div className="campus-name">{campus.name}</div>
                  <div className="campus-code">BITS {campus.code}</div>
                </div>
                <div className="campus-stats">
                  <span className="student-count">{campus.students}</span>
                  <span className="student-label">Students</span>
                </div>
                <div className="campus-status">
                  <div className="status-dot active"></div>
                  <span>Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <div className="newsletter-info">
              <h3>Stay Updated</h3>
              <p>Get the latest deals and auction updates delivered to your inbox</p>
            </div>
            <div className="newsletter-form">
              <div className="email-input-wrapper">
                <input 
                  type="email" 
                  placeholder="Enter your BITS email address"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">
                  <span>Subscribe</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>
              <p className="newsletter-note">
                📧 We'll only send you relevant updates. No spam, ever.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <span>© {currentYear} BITSBids. All rights reserved.</span>
              <span className="separator">•</span>
              <span>Made with ❤️ for BITSians</span>
            </div>
            
            <div className="footer-badges">
              <div className="security-badge">
                <span className="badge-icon">🔒</span>
                <span>Secure Platform</span>
              </div>
              <div className="verified-badge">
                <span className="badge-icon">✅</span>
                <span>BITS Verified</span>
              </div>
              <div className="trusted-badge">
                <span className="badge-icon">🛡️</span>
                <span>Trusted by Students</span>
              </div>
            </div>

            <div className="footer-meta">
              <span>Platform Status: </span>
              <span className="status-indicator">
                <div className="status-dot online"></div>
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
