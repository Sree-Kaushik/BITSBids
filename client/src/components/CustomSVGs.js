import React from 'react';

const CustomSVGs = () => {
  return (
    <div className="custom-svgs">
      {/* Animated Logo */}
      <svg className="animated-logo" width="100" height="100" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="url(#logoGradient)"
          className="logo-circle"
        />
        <path 
          d="M30 40 L50 60 L70 40" 
          stroke="white" 
          strokeWidth="4" 
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo-arrow"
        />
      </svg>

      {/* Auction Hammer Icon */}
      <svg className="hammer-icon" width="80" height="80" viewBox="0 0 80 80">
        <defs>
          <linearGradient id="hammerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <rect 
          x="10" 
          y="20" 
          width="30" 
          height="15" 
          rx="7" 
          fill="url(#hammerGradient)"
          className="hammer-head"
        />
        <rect 
          x="35" 
          y="30" 
          width="4" 
          height="40" 
          fill="#8b4513"
          className="hammer-handle"
        />
        <circle 
          cx="60" 
          cy="60" 
          r="8" 
          fill="#ef4444"
          className="impact-circle"
        />
      </svg>

      {/* Loading Spinner */}
      <svg className="custom-spinner" width="60" height="60" viewBox="0 0 60 60">
        <circle 
          cx="30" 
          cy="30" 
          r="25" 
          fill="none" 
          stroke="#e5e7eb" 
          strokeWidth="4"
        />
        <circle 
          cx="30" 
          cy="30" 
          r="25" 
          fill="none" 
          stroke="#3b82f6" 
          strokeWidth="4"
          strokeLinecap="round"
          className="spinner-circle"
        />
      </svg>

      {/* Success Checkmark */}
      <svg className="success-check" width="60" height="60" viewBox="0 0 60 60">
        <circle 
          cx="30" 
          cy="30" 
          r="25" 
          fill="#10b981"
          className="check-circle"
        />
        <path 
          d="M20 30 L27 37 L40 23" 
          stroke="white" 
          strokeWidth="3" 
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="check-mark"
        />
      </svg>
    </div>
  );
};

export default CustomSVGs;
