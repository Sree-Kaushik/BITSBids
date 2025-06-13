import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateBITSEmail = (email) => {
    const bitsEmailRegex = /^[a-z]\d{4}\d{4}@(pilani|goa|hyderabad|dubai)\.bits-pilani\.ac\.in$/;
    return bitsEmailRegex.test(email.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!validateBITSEmail(email)) {
      setError('Please enter a valid BITS email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEmailSent(true);
      toast.success('Password reset email sent successfully!');
    } catch (error) {
      toast.error('Failed to send reset email');
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-background-overlay">
        <div className="auth-pattern-grid"></div>
        <div className="floating-auth-elements">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="floating-auth-element"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            >
              {['🔑', '📧', '🔐', '✨'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-card login-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <div className="auth-logo-icon">
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
              <div className="auth-logo-text">
                <span className="bits-text">BITS</span>
                <span className="bids-text">Bids</span>
              </div>
            </Link>
          </div>

          <div className="auth-content">
            {!emailSent ? (
              <>
                <div className="auth-title-section">
                  <h1 className="auth-title">Forgot Password?</h1>
                  <p className="auth-subtitle">
                    No worries! Enter your BITS email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group">
                    <label className="form-label">
                      BITS Email Address <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError('');
                        }}
                        className={`form-input ${error ? 'error' : ''}`}
                        placeholder="f20220479@hyderabad.bits-pilani.ac.in"
                        autoComplete="email"
                      />
                      <div className="input-icon">📧</div>
                    </div>
                    {error && (
                      <span className="error-message">{error}</span>
                    )}
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="auth-submit-btn"
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span>Sending Reset Link...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <span className="btn-arrow">📧</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="success-state">
                <div className="success-icon">📧</div>
                <h2 className="success-title">Check Your Email</h2>
                <p className="success-message">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <div className="success-instructions">
                  <p>Please check your email and click the link to reset your password.</p>
                  <p>Didn't receive the email? Check your spam folder or try again.</p>
                </div>
                <button 
                  onClick={() => setEmailSent(false)}
                  className="auth-back-btn"
                >
                  Try Different Email
                </button>
              </div>
            )}

            <div className="auth-footer">
              <p>Remember your password? <Link to="/login" className="auth-link">Back to Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
