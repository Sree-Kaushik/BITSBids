import React, { useState, useEffect } from 'react';

const MicroInteractions = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [ripples, setRipples] = useState([]);

  const handleRippleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <div className="micro-interactions">
      {/* Animated Like Button */}
      <button 
        className={`like-button ${isLiked ? 'liked' : ''}`}
        onClick={() => setIsLiked(!isLiked)}
      >
        <span className="heart-icon">❤️</span>
        <span className="like-text">{isLiked ? 'Liked' : 'Like'}</span>
        <div className="like-particles"></div>
      </button>

      {/* Ripple Effect Button */}
      <button 
        className="ripple-button"
        onClick={handleRippleClick}
      >
        Place Bid
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="ripple"
            style={{
              left: ripple.x,
              top: ripple.y
            }}
          />
        ))}
      </button>

      {/* Hover Card with Tilt Effect */}
      <div className="tilt-card">
        <div className="card-content">
          <h3>Auction Item</h3>
          <p>Hover for 3D effect</p>
        </div>
      </div>
    </div>
  );
};

export default MicroInteractions;
