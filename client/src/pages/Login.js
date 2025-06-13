import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const validateBITSEmail = (email) => {
    const bitsEmailRegex = /^[a-z]\d{4}\d{4}@(pilani|goa|hyderabad|dubai)\.bits-pilani\.ac\.in$/;
    return bitsEmailRegex.test(email.toLowerCase());
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateBITSEmail(formData.email)) {
      newErrors.email = 'Please enter a valid BITS email (e.g., f20220479@hyderabad.bits-pilani.ac.in)';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate successful login for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data based on email
      const mockUser = {
        id: '1',
        firstName: formData.email.includes('f2022') ? 'Arjun' : 'Priya',
        lastName: formData.email.includes('f2022') ? 'Sharma' : 'Patel',
        email: formData.email,
        campus: formData.email.includes('goa') ? 'Goa' : 
                formData.email.includes('pilani') ? 'Pilani' : 
                formData.email.includes('hyderabad') ? 'Hyderabad' : 'Dubai',
        role: 'student',
        avatar: null
      };
      
      // Store user in localStorage for persistence
      localStorage.setItem('bitsbids_user', JSON.stringify(mockUser));
      localStorage.setItem('bitsbids_token', 'mock_jwt_token_' + Date.now());
      
      toast.success('Welcome back to BITSBids!');
      navigate(from, { replace: true });
      
      // Trigger a page reload to update auth state
      window.location.reload();
      
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (userType) => {
    setLoading(true);
    const demoCredentials = {
      student: { 
        email: 'f20220479@goa.bits-pilani.ac.in', 
        password: 'demo123',
        userData: {
          id: '1',
          firstName: 'Demo',
          lastName: 'Student',
          email: 'f20220479@goa.bits-pilani.ac.in',
          campus: 'Goa',
          role: 'student'
        }
      },
      seller: { 
        email: 'f20210256@pilani.bits-pilani.ac.in', 
        password: 'demo123',
        userData: {
          id: '2',
          firstName: 'Demo',
          lastName: 'Seller',
          email: 'f20210256@pilani.bits-pilani.ac.in',
          campus: 'Pilani',
          role: 'student'
        }
      }
    };
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { userData } = demoCredentials[userType];
      localStorage.setItem('bitsbids_user', JSON.stringify(userData));
      localStorage.setItem('bitsbids_token', 'demo_token_' + userType);
      
      toast.success(`Welcome to BITSBids Demo (${userType})!`);
      navigate('/dashboard', { replace: true });
      window.location.reload();
      
    } catch (error) {
      toast.error('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-background-overlay">
        <div className="auth-pattern-grid"></div>
        <div className="floating-auth-elements">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="floating-auth-element"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            >
              {['🎓', '📚', '💡', '🚀', '⭐'][Math.floor(Math.random() * 5)]}
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
            <div className="auth-title-section">
              <h1 className="auth-title">Welcome Back</h1>
              <p className="auth-subtitle">
                Sign in to your account to continue buying and selling with fellow BITSians
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
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="f20220479@hyderabad.bits-pilani.ac.in"
                    autoComplete="email"
                  />
                  <div className="input-icon">📧</div>
                </div>
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
                <div className="form-help">
                  Format: <strong>f</strong> (degree) + <strong>2022</strong> (batch) + <strong>0479</strong> (ID) @ <strong>campus</strong>.bits-pilani.ac.in
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Password <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-options">
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">Remember me</span>
                </label>
                
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="auth-submit-btn"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="demo-section">
              <div className="demo-divider">
                <span>Or try demo accounts</span>
              </div>
              <div className="demo-buttons">
                <button 
                  onClick={() => handleDemoLogin('student')}
                  className="demo-btn student-demo"
                  disabled={loading}
                >
                  <span>👨‍🎓</span>
                  <span>Demo Student</span>
                </button>
                <button 
                  onClick={() => handleDemoLogin('seller')}
                  className="demo-btn seller-demo"
                  disabled={loading}
                >
                  <span>🛍️</span>
                  <span>Demo Seller</span>
                </button>
              </div>
            </div>

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/register" className="auth-link">Create one here</Link></p>
            </div>
          </div>
        </div>

        <div className="auth-info-panel">
          <div className="info-content">
            <h3>Welcome to BITSBids</h3>
            <div className="info-features">
              <div className="info-feature">
                <div className="feature-icon">🛡️</div>
                <div className="feature-content">
                  <h4>Secure & Trusted</h4>
                  <p>Verified BITS students only with official email validation</p>
                </div>
              </div>
              <div className="info-feature">
                <div className="feature-icon">💰</div>
                <div className="feature-content">
                  <h4>Best Prices</h4>
                  <p>Student-friendly pricing with transparent bidding</p>
                </div>
              </div>
              <div className="info-feature">
                <div className="feature-icon">🌐</div>
                <div className="feature-content">
                  <h4>All Campuses</h4>
                  <p>Connect across Pilani, Goa, Hyderabad & Dubai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
