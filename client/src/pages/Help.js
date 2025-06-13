import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      description: 'Learn the basics of using BITSBids'
    },
    {
      id: 'bidding',
      title: 'Bidding & Auctions',
      icon: '💰',
      description: 'How to bid and participate in auctions'
    },
    {
      id: 'selling',
      title: 'Selling Items',
      icon: '🏪',
      description: 'Create and manage your auctions'
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: '👤',
      description: 'Manage your account settings'
    },
    {
      id: 'safety',
      title: 'Safety & Security',
      icon: '🛡️',
      description: 'Stay safe while trading'
    },
    {
      id: 'payments',
      title: 'Payments & Transactions',
      icon: '💳',
      description: 'Payment methods and transaction help'
    }
  ];

  const helpArticles = {
    'getting-started': [
      {
        title: 'How to create an account',
        content: `To create an account on BITSBids:
        
1. Click "Join BITSBids" on the homepage
2. Enter your BITS email address (must be official BITS email)
3. Fill in your personal details
4. Verify your email address
5. Complete your profile with campus and course information

Your BITS email ensures only genuine students can access the platform.`
      },
      {
        title: 'Understanding the dashboard',
        content: `Your dashboard is your control center:

- **Overview**: See your recent activity and statistics
- **My Items**: Manage your auction listings
- **My Bids**: Track your bidding activity
- **Watchlist**: Items you're interested in
- **Notifications**: Important updates and alerts

Use the navigation menu to access different sections quickly.`
      },
      {
        title: 'Browsing and searching items',
        content: `Find items easily:

- Use the search bar for specific items
- Browse by categories (Electronics, Books, etc.)
- Apply filters for price, condition, campus
- Sort by price, ending time, or popularity
- Use the advanced search for detailed filtering

Save interesting items to your watchlist for later.`
      }
    ],
    'bidding': [
      {
        title: 'How to place a bid',
        content: `Placing a bid is simple:

1. Find an item you want to bid on
2. Click "View Details" to see the auction page
3. Enter your bid amount (must be higher than current price)
4. Click "Place Bid" to submit
5. You'll receive confirmation and notifications about bid status

Remember: All bids are binding commitments to purchase.`
      },
      {
        title: 'Understanding proxy bidding',
        content: `Proxy bidding helps you win auctions automatically:

- Set your maximum bid amount
- The system bids for you incrementally
- You'll only pay the minimum needed to win
- Saves time and helps you not miss auctions
- You can modify or cancel proxy bids anytime

Enable proxy bidding when placing your bid.`
      },
      {
        title: 'Auction end times and winning',
        content: `When auctions end:

- Auctions have fixed end times
- The highest bidder when time expires wins
- Winners are notified immediately
- You have 24 hours to contact the seller
- Payment and pickup should be arranged promptly

Check auction end times carefully to avoid missing out.`
      }
    ],
    'selling': [
      {
        title: 'Creating your first auction',
        content: `To sell an item:

1. Click "Create Auction" from your dashboard
2. Upload clear, high-quality photos
3. Write a detailed description
4. Set starting price and auction duration
5. Choose category and condition
6. Review and publish your auction

Good photos and descriptions get more bids!`
      },
      {
        title: 'Setting the right price',
        content: `Price your items competitively:

- Research similar items on the platform
- Consider the item's age and condition
- Start with a reasonable reserve price
- Factor in depreciation and market demand
- Be honest about condition to avoid disputes

Lower starting prices often attract more bidders.`
      },
      {
        title: 'Managing your auctions',
        content: `Keep track of your sales:

- Monitor bids and watchers regularly
- Answer questions from potential buyers
- Update item details if needed
- Communicate with winning bidders promptly
- Leave feedback after successful transactions

Active sellers get better results and ratings.`
      }
    ],
    'account': [
      {
        title: 'Updating your profile',
        content: `Keep your profile current:

- Add a profile photo for trust
- Update contact information
- Set notification preferences
- Add social links if desired
- Keep campus information accurate

Complete profiles get more engagement from other users.`
      },
      {
        title: 'Notification settings',
        content: `Customize your notifications:

- Bid alerts: When you're outbid
- Auction ending: Items you're watching
- New messages: From other users
- Price drops: On watchlist items
- Account security: Login alerts

Manage notifications in your profile settings.`
      },
      {
        title: 'Privacy and data',
        content: `Your privacy matters:

- Only verified BITS students can see your profile
- Control what information is visible
- Your email is never shared with other users
- Transaction history is private
- You can delete your account anytime

Review privacy settings regularly.`
      }
    ],
    'safety': [
      {
        title: 'Safe trading practices',
        content: `Stay safe while trading:

- Meet in public places on campus
- Inspect items before payment
- Use secure payment methods
- Trust your instincts about deals
- Report suspicious activity immediately
- Keep records of all transactions

Never share personal financial information.`
      },
      {
        title: 'Avoiding scams',
        content: `Red flags to watch for:

- Prices too good to be true
- Pressure to pay immediately
- Requests for payment before meeting
- Poor quality photos or descriptions
- Sellers avoiding direct communication
- Requests for personal information

Always verify items and sellers before committing.`
      },
      {
        title: 'Reporting issues',
        content: `If something goes wrong:

1. Try to resolve with the other party first
2. Use the in-app reporting system
3. Provide detailed information and evidence
4. Contact support for serious issues
5. Leave honest feedback about your experience

We investigate all reports promptly.`
      }
    ],
    'payments': [
      {
        title: 'Accepted payment methods',
        content: `Safe payment options:

- UPI payments (recommended)
- Bank transfers
- Cash (for campus meetups)
- Digital wallets
- Installment plans (for high-value items)

Avoid payment methods that offer no protection.`
      },
      {
        title: 'Payment security',
        content: `Protect your payments:

- Never pay before seeing the item
- Use traceable payment methods
- Keep payment receipts
- Verify seller identity before paying
- Report payment issues immediately

BITSBids doesn't handle payments directly.`
      },
      {
        title: 'Refunds and disputes',
        content: `If you need a refund:

1. Contact the seller directly first
2. Document the issue with photos/messages
3. Use our dispute resolution system
4. Provide all relevant evidence
5. Follow the resolution process

Most disputes are resolved through communication.`
      }
    ]
  };

  const filteredArticles = helpArticles[activeCategory]?.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="help-page">
      <div className="help-header">
        <div className="container">
          <h1>Help Center</h1>
          <p>Find answers to your questions and learn how to use BITSBids effectively</p>
          
          <div className="help-search">
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="help-search-input"
            />
            <button className="help-search-btn">🔍</button>
          </div>
        </div>
      </div>

      <div className="help-content">
        <div className="container">
          <div className="help-layout">
            {/* Categories Sidebar */}
            <div className="help-sidebar">
              <h3>Categories</h3>
              <div className="help-categories">
                {helpCategories.map(category => (
                  <button
                    key={category.id}
                    className={`help-category ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <div className="category-content">
                      <span className="category-title">{category.title}</span>
                      <span className="category-description">{category.description}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="help-contact">
                <h4>Still need help?</h4>
                <p>Can't find what you're looking for?</p>
                <Link to="/contact" className="contact-support-btn">
                  📧 Contact Support
                </Link>
              </div>
            </div>

            {/* Articles Content */}
            <div className="help-main">
              <div className="help-articles">
                <h2>
                  {helpCategories.find(cat => cat.id === activeCategory)?.title}
                </h2>
                
                {filteredArticles.length > 0 ? (
                  <div className="articles-list">
                    {filteredArticles.map((article, index) => (
                      <div key={index} className="help-article">
                        <h3>{article.title}</h3>
                        <div className="article-content">
                          {article.content.split('\n').map((line, lineIndex) => (
                            <p key={lineIndex}>{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-articles">
                    <div className="no-articles-icon">🔍</div>
                    <h3>No articles found</h3>
                    <p>Try adjusting your search or browse other categories</p>
                  </div>
                )}
              </div>

              {/* Quick Links */}
              <div className="quick-links">
                <h3>Quick Links</h3>
                <div className="quick-links-grid">
                  <Link to="/browse" className="quick-link">
                    <span className="quick-link-icon">🔍</span>
                    <span>Browse Items</span>
                  </Link>
                  <Link to="/create-item" className="quick-link">
                    <span className="quick-link-icon">➕</span>
                    <span>Create Auction</span>
                  </Link>
                  <Link to="/dashboard" className="quick-link">
                    <span className="quick-link-icon">📊</span>
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/profile" className="quick-link">
                    <span className="quick-link-icon">👤</span>
                    <span>Profile Settings</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
