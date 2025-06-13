import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    campus: '',
    year: '',
    bitsId: '',
    branch: '',
    phoneNumber: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});

  const campuses = [
    { value: 'pilani', label: 'BITS Pilani, Pilani Campus', code: 'P' },
    { value: 'goa', label: 'BITS Pilani, Goa Campus', code: 'G' },
    { value: 'hyderabad', label: 'BITS Pilani, Hyderabad Campus', code: 'H' },
    { value: 'dubai', label: 'BITS Pilani, Dubai Campus', code: 'D' }
  ];

  const branches = [
    'Computer Science Engineering',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Chemical Engineering',
    'Civil Engineering',
    'Electrical & Electronics Engineering',
    'Biotechnology',
    'Manufacturing Engineering',
    'Economics',
    'Mathematics',
    'Physics',
    'Chemistry'
  ];

  const years = [
    { value: '1', label: '1st Year' },
    { value: '2', label: '2nd Year' },
    { value: '3', label: '3rd Year' },
    { value: '4', label: '4th Year' },
    { value: '5', label: '5th Year (Dual Degree)' }
  ];

  const validateBITSEmail = (email) => {
    const bitsEmailRegex = /^[a-z]\d{4}\d{4}@(pilani|goa|hyderabad|dubai)\.bits-pilani\.ac\.in$/;
    return bitsEmailRegex.test(email.toLowerCase());
  };

  const validateBITSId = (bitsId) => {
    const bitsIdRegex = /^\d{4}[A-Z]\d[A-Z]{2}\d{4}[A-Z]$/;
    return bitsIdRegex.test(bitsId.toUpperCase());
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

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateBITSEmail(formData.email)) {
      newErrors.email = 'Please enter a valid BITS email (e.g., f20220479@hyderabad.bits-pilani.ac.in)';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.campus) {
      newErrors.campus = 'Please select your campus';
    }
    
    if (!formData.year) {
      newErrors.year = 'Please select your year';
    }
    
    if (!formData.bitsId.trim()) {
      newErrors.bitsId = 'BITS ID is required';
    } else if (!validateBITSId(formData.bitsId)) {
      newErrors.bitsId = 'Please enter a valid BITS ID (e.g., 2022A7PS0479G)';
    }
    
    if (!formData.branch) {
      newErrors.branch = 'Please select your branch';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit Indian phone number';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await register(formData);
      toast.success('Registration successful! Please check your email for verification.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-background-overlay">
        <div className="auth-pattern-grid"></div>
        <div className="floating-auth-elements">
          {[...Array(10)].map((_, i) => (
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
        <div className="auth-card register-card">
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
            
            <div className="progress-bar">
              <div className="progress-steps">
                <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                  <div className="step-number">1</div>
                  <span className="step-label">Account</span>
                </div>
                <div className="progress-line">
                  <div className={`progress-fill ${step >= 2 ? 'active' : ''}`}></div>
                </div>
                <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                  <div className="step-number">2</div>
                  <span className="step-label">Details</span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-content">
            <div className="auth-title-section">
              <h1 className="auth-title">Join BITSBids</h1>
              <p className="auth-subtitle">
                {step === 1 
                  ? 'Create your account to start buying and selling with fellow BITSians'
                  : 'Complete your profile with BITS details'
                }
              </p>
            </div>

            <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()} className="auth-form">
              {step === 1 && (
                <div className="form-step">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        First Name <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`form-input ${errors.firstName ? 'error' : ''}`}
                          placeholder="Enter your first name"
                        />
                        <div className="input-icon">👤</div>
                      </div>
                      {errors.firstName && (
                        <span className="error-message">{errors.firstName}</span>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">
                        Last Name <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`form-input ${errors.lastName ? 'error' : ''}`}
                          placeholder="Enter your last name"
                        />
                        <div className="input-icon">👤</div>
                      </div>
                      {errors.lastName && (
                        <span className="error-message">{errors.lastName}</span>
                      )}
                    </div>
                  </div>

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

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Password <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`form-input ${errors.password ? 'error' : ''}`}
                          placeholder="Create a strong password"
                        />
                        <div className="input-icon">🔒</div>
                      </div>
                      {errors.password && (
                        <span className="error-message">{errors.password}</span>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">
                        Confirm Password <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                          placeholder="Confirm your password"
                        />
                        <div className="input-icon">🔒</div>
                      </div>
                      {errors.confirmPassword && (
                        <span className="error-message">{errors.confirmPassword}</span>
                      )}
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleNextStep}
                    className="auth-submit-btn"
                  >
                    <span>Continue</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="form-step">
                  <div className="form-group">
                    <label className="form-label">
                      Campus <span className="required">*</span>
                    </label>
                    <div className="select-wrapper">
                      <select
                        name="campus"
                        value={formData.campus}
                        onChange={handleInputChange}
                        className={`form-select ${errors.campus ? 'error' : ''}`}
                      >
                        <option value="">Select your campus</option>
                        {campuses.map((campus) => (
                          <option key={campus.value} value={campus.value}>
                            {campus.label}
                          </option>
                        ))}
                      </select>
                      <div className="select-icon">🏛️</div>
                    </div>
                    {errors.campus && (
                      <span className="error-message">{errors.campus}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Year <span className="required">*</span>
                      </label>
                      <div className="select-wrapper">
                        <select
                          name="year"
                          value={formData.year}
                          onChange={handleInputChange}
                          className={`form-select ${errors.year ? 'error' : ''}`}
                        >
                          <option value="">Select year</option>
                          {years.map((year) => (
                            <option key={year.value} value={year.value}>
                              {year.label}
                            </option>
                          ))}
                        </select>
                        <div className="select-icon">📅</div>
                      </div>
                      {errors.year && (
                        <span className="error-message">{errors.year}</span>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">
                        BITS ID <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          name="bitsId"
                          value={formData.bitsId}
                          onChange={handleInputChange}
                          className={`form-input ${errors.bitsId ? 'error' : ''}`}
                          placeholder="2022A7PS0479G"
                        />
                        <div className="input-icon">🆔</div>
                      </div>
                      {errors.bitsId && (
                        <span className="error-message">{errors.bitsId}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Branch/Programme <span className="required">*</span>
                    </label>
                    <div className="select-wrapper">
                      <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        className={`form-select ${errors.branch ? 'error' : ''}`}
                      >
                        <option value="">Select your branch</option>
                        {branches.map((branch) => (
                          <option key={branch} value={branch}>
                            {branch}
                          </option>
                        ))}
                      </select>
                      <div className="select-icon">🎓</div>
                    </div>
                    {errors.branch && (
                      <span className="error-message">{errors.branch}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Phone Number <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                        placeholder="Enter 10-digit phone number"
                      />
                      <div className="input-icon">📱</div>
                    </div>
                    {errors.phoneNumber && (
                      <span className="error-message">{errors.phoneNumber}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      <span className="checkbox-text">
                        I agree to the <Link to="/terms" className="auth-link">Terms of Service</Link> and <Link to="/privacy" className="auth-link">Privacy Policy</Link>
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <span className="error-message">{errors.agreeToTerms}</span>
                    )}
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button"
                      onClick={handlePrevStep}
                      className="auth-back-btn"
                    >
                      <span>← Back</span>
                    </button>
                    
                    <button 
                      type="submit"
                      disabled={loading}
                      className="auth-submit-btn"
                    >
                      {loading ? (
                        <>
                          <div className="loading-spinner"></div>
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <span className="btn-arrow">🚀</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login" className="auth-link">Login here</Link></p>
            </div>
          </div>
        </div>

        <div className="auth-info-panel">
          <div className="info-content">
            <h3>Why Join BITSBids?</h3>
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

export default Register;
