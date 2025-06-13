import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    campus: '',
    subject: '',
    category: '',
    message: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        campus: '',
        subject: '',
        category: '',
        message: '',
        priority: 'medium'
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@bitsbids.com',
      availability: '24/7'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with our team',
      contact: 'Available in app',
      availability: '9 AM - 9 PM IST'
    },
    {
      icon: '📱',
      title: 'WhatsApp',
      description: 'Quick support via WhatsApp',
      contact: '+91 98765 43210',
      availability: '9 AM - 6 PM IST'
    },
    {
      icon: '🎓',
      title: 'Campus Support',
      description: 'On-campus assistance',
      contact: 'Available at all campuses',
      availability: 'College hours'
    }
  ];

  const faqItems = [
    {
      question: 'How do I create an account?',
      answer: 'Use your official BITS email address to register. You\'ll receive a verification email to activate your account.'
    },
    {
      question: 'Is my personal information safe?',
      answer: 'Yes, we use industry-standard encryption and only verified BITS students can access the platform.'
    },
    {
      question: 'How does the bidding system work?',
      answer: 'You can place manual bids or set maximum amounts for automatic proxy bidding. The highest bidder wins when the auction ends.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We support UPI, bank transfers, and cash payments. All transactions are between students directly.'
    },
    {
      question: 'How do I report a problem?',
      answer: 'Use this contact form, email us, or use the in-app report feature. We respond within 24 hours.'
    }
  ];

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>We're here to help you with any questions or issues you might have</p>
        </div>
      </div>

      <div className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="form-header">
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you as soon as possible</p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@bits-pilani.ac.in"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Campus</label>
                    <select
                      name="campus"
                      value={formData.campus}
                      onChange={handleInputChange}
                    >
                      <option value="">Select your campus</option>
                      <option value="Pilani">BITS Pilani, Pilani Campus</option>
                      <option value="Goa">BITS Pilani, Goa Campus</option>
                      <option value="Hyderabad">BITS Pilani, Hyderabad Campus</option>
                      <option value="Dubai">BITS Pilani, Dubai Campus</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="">Select category</option>
                      <option value="technical">Technical Issue</option>
                      <option value="account">Account Problem</option>
                      <option value="payment">Payment Issue</option>
                      <option value="dispute">Dispute Resolution</option>
                      <option value="feature">Feature Request</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <div className="priority-options">
                    {['low', 'medium', 'high', 'urgent'].map(priority => (
                      <label key={priority} className="priority-option">
                        <input
                          type="radio"
                          name="priority"
                          value={priority}
                          checked={formData.priority === priority}
                          onChange={handleInputChange}
                        />
                        <span className={`priority-indicator ${priority}`}></span>
                        <span className="priority-label">{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please provide detailed information about your issue or question..."
                    rows="6"
                    required
                  />
                  <div className="character-count">
                    {formData.message.length}/2000 characters
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <span className="btn-arrow">📤</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Methods */}
            <div className="contact-methods-section">
              <h2>Other Ways to Reach Us</h2>
              
              <div className="contact-methods">
                {contactMethods.map((method, index) => (
                  <div key={index} className="contact-method">
                    <div className="method-icon">{method.icon}</div>
                    <div className="method-content">
                      <h3>{method.title}</h3>
                      <p>{method.description}</p>
                      <div className="method-contact">{method.contact}</div>
                      <div className="method-availability">{method.availability}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Section */}
              <div className="faq-section">
                <h3>Frequently Asked Questions</h3>
                <div className="faq-list">
                  {faqItems.map((faq, index) => (
                    <details key={index} className="faq-item">
                      <summary className="faq-question">{faq.question}</summary>
                      <div className="faq-answer">{faq.answer}</div>
                    </details>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="emergency-contact">
                <h3>🚨 Emergency Contact</h3>
                <p>For urgent issues that require immediate attention:</p>
                <div className="emergency-details">
                  <div className="emergency-item">
                    <span className="emergency-icon">📞</span>
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="emergency-item">
                    <span className="emergency-icon">📧</span>
                    <span>emergency@bitsbids.com</span>
                  </div>
                </div>
                <p className="emergency-note">
                  Available 24/7 for security issues, payment problems, or urgent disputes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
