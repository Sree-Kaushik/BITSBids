import React, { useState, useRef, useEffect } from 'react';

const AdvancedAnimations = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        const parallax = parallaxRef.current;
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="advanced-animations">
      {/* Staggered Animation Cards */}
      <div className="staggered-cards">
        {[1, 2, 3, 4].map((item, index) => (
          <div 
            key={item}
            className="stagger-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <h3>Card {item}</h3>
            <p>Staggered animation effect</p>
          </div>
        ))}
      </div>

      {/* Morphing Shape */}
      <div className="morphing-container">
        <div className="morphing-shape"></div>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-circle"></div>
        <div className="floating-square"></div>
        <div className="floating-triangle"></div>
      </div>

      {/* Parallax Background */}
      <div className="parallax-container">
        <div ref={parallaxRef} className="parallax-bg"></div>
        <div className="parallax-content">
          <h2>Parallax Scrolling Effect</h2>
          <p>Scroll to see the background move at different speed</p>
        </div>
      </div>

      {/* Mouse Follower */}
      <div 
        className="mouse-follower"
        style={{
          left: mousePosition.x,
          top: mousePosition.y
        }}
      ></div>

      {/* Reveal on Scroll */}
      <div 
        className={`reveal-element ${isVisible ? 'revealed' : ''}`}
        onMouseEnter={() => setIsVisible(true)}
      >
        <h3>Reveal Animation</h3>
        <p>Hover to reveal content</p>
      </div>
    </div>
  );
};

export default AdvancedAnimations;
