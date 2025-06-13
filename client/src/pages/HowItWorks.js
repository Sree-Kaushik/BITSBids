import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Sign up with your BITS email address to join our trusted student community.',
      icon: '🎓',
      details: [
        'Use your official BITS email (@pilani.bits-pilani.ac.in, @goa.bits-pilani.ac.in, etc.)',
        'Verify your student status automatically',
        'Complete your profile with campus and course details',
        'Start browsing immediately after verification'
      ],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
    },
    {
      number: '02',
      title: 'Browse & Discover',
      description: 'Explore thousands of items from fellow students across all BITS campuses.',
      icon: '🔍',
      details: [
        'Search by category, price range, or campus',
        'Use advanced filters to find exactly what you need',
        'View detailed photos and descriptions',
        'Check seller ratings and reviews'
      ],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop'
    },
    {
      number: '03',
      title: 'Place Your Bids',
      description: 'Bid on items you want or use our smart proxy bidding system.',
      icon: '💰',
      details: [
        'Place manual bids in real-time',
        'Set maximum bid amounts with proxy bidding',
        'Get notifications when you\'re outbid',
        'Track all your active bids in one place'
      ],
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop'
    },
    {
      number: '04',
      title: 'Sell Your Items',
      description: 'List your items and start earning from things you no longer need.',
      icon: '🏪',
      details: [
        'Upload high-quality photos and detailed descriptions',
        'Set starting prices and auction duration',
        'Manage all your listings from your dashboard',
        'Communicate directly with interested buyers'
      ],
      image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=300&fit=crop'
    },
    {
      number: '05',
      title: 'Safe Transactions',
      description: 'Complete your transactions safely with our built-in protection systems.',
      icon: '🛡️',
      details: [
        'Meet in safe, public locations on campus',
        'Use our dispute resolution system if needed',
        'Rate and review after each transaction',
        'Report any issues to our support team'
      ],
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop'
    }
  ];

  const features = [
    {
      icon: '🔒',
      title: 'Secure Platform',
      description: 'BITS email verification ensures only genuine students can participate.'
    },
    {
      icon: '⚡',
      title: 'Real-time Bidding',
      description: 'Live auction updates with instant notifications for all bid activities.'
    },
    {
      icon: '🌐',
      title: 'Multi-Campus',
      description: 'Connect with students from Pilani, Goa, Hyderabad, and Dubai campuses.'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Fully responsive design works perfectly on all devices.'
    },
    {
      icon: '💬',
      title: 'Direct Communication',
      description: 'Chat directly with buyers and sellers through our messaging system.'
    },
    {
      icon: '⭐',
      title: 'Rating System',
      description: 'Build trust through our comprehensive review and rating system.'
    }
  ];

  const faqs = [
    {
      question: 'Who can use BITSBids?',
      answer: 'Only current BITS Pilani students with valid BITS email addresses can create accounts and participate in auctions.'
    },
    {
      question: 'How does the bidding system work?',
      answer: 'You can place manual bids or set a maximum amount for proxy bidding. The system will automatically bid for you up to your maximum amount.'
    },
    {
      question: 'What if I win an auction?',
      answer: 'You\'ll receive a notification and the seller\'s contact information. Arrange a safe meeting on campus to complete the transaction.'
    },
    {
      question: 'How do I ensure safe transactions?',
      answer: 'Always meet in public places on campus, inspect items before payment, and use our rating system to build trust in the community.'
    },
    {
      question: 'What items are allowed?',
      answer: 'Most items are allowed except prohibited items like weapons, illegal substances, or items violating campus policies.'
    },
    {
      question: 'How do I resolve disputes?',
      answer: 'Use our built-in dispute resolution system or contact our support team for assistance with any transaction issues.'
    }
  ];

  return (
    <div className="how-it-works-page">
      {/* Hero Section */}
      <div className="how-it-works-hero">
        <div className="container">
          <div className="hero-content">
            <h1>How BITSBids Works</h1>
            <p>Your complete guide to buying and selling on India's premier student auction platform</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="number">18,632+</span>
                <span className="label">Active Students</span>
              </div>
              <div className="stat">
                <span className="number">3,247</span>
                <span className="label">Items Listed</span>
              </div>
              <div className="stat">
                <span className="number">₹18.5M</span>
                <span className="label">Total Traded</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="steps-section">
        <div className="container">
          <h2>Getting Started is Easy</h2>
          <div className="steps-timeline">
            {steps.map((step, index) => (
              <div key={index} className="step-item">
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <div className="step-text">
                    <div className="step-icon">{step.icon}</div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <ul className="step-details">
                      {step.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="step-image">
                    <img src={step.image} alt={step.title} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <h2>Why Choose BITSBids?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of BITS students already using BITSBids</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn-primary">
                <span>Join BITSBids</span>
                <span className="btn-arrow">→</span>
              </Link>
              <Link to="/browse" className="btn-secondary">
                <span>Browse Items</span>
                <span className="btn-icon">🔍</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
