import React, { useState, useEffect } from 'react';

const StaticBlueBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Limit movement to very small range around center for subtle effect
      const x = 50 + (e.clientX / window.innerWidth - 0.5) * 8; // +/-4% movement
      const y = 50 + (e.clientY / window.innerHeight - 0.5) * 8; // +/-4% movement
      
      // Clamp values to prevent extreme positions
      const clampedX = Math.max(45, Math.min(55, x));
      const clampedY = Math.max(45, Math.min(55, y));
      
      setMousePosition({ x: clampedX, y: clampedY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="static-blue-background"
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`
      }}
    />
  );
};

export default StaticBlueBackground;
