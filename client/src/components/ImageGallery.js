import React, { useState, useRef, useEffect } from 'react';

const ImageGallery = ({ images = [], title = "Item Images" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isFullscreen) {
        switch (e.key) {
          case 'ArrowLeft':
            previousImage();
            break;
          case 'ArrowRight':
            nextImage();
            break;
          case 'Escape':
            setIsFullscreen(false);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, currentImageIndex]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setIsZoomed(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className="image-gallery-empty">
        <div className="empty-gallery-placeholder">
          <span className="empty-icon">📷</span>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="image-gallery" ref={containerRef}>
        {/* Main Image Display */}
        <div className="main-image-container">
          <div 
            className={`main-image-wrapper ${isZoomed ? 'zoomed' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <img
              ref={imageRef}
              src={images[currentImageIndex]}
              alt={`${title} - Image ${currentImageIndex + 1}`}
              className="main-image"
              onClick={toggleZoom}
              style={isZoomed ? {
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transform: 'scale(2)'
              } : {}}
            />
            
            {/* Image Controls */}
            <div className="image-controls">
              {images.length > 1 && (
                <>
                  <button 
                    className="nav-btn prev-btn"
                    onClick={previousImage}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button 
                    className="nav-btn next-btn"
                    onClick={nextImage}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
              
              <div className="image-actions">
                <button 
                  className="action-btn zoom-btn"
                  onClick={toggleZoom}
                  title={isZoomed ? "Zoom out" : "Zoom in"}
                >
                  {isZoomed ? '🔍-' : '🔍+'}
                </button>
                <button 
                  className="action-btn fullscreen-btn"
                  onClick={openFullscreen}
                  title="View fullscreen"
                >
                  ⛶
                </button>
              </div>
            </div>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="image-counter">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Zoom Indicator */}
            {isZoomed && (
              <div className="zoom-indicator">
                Click to zoom out
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="thumbnail-container">
            <div className="thumbnails-wrapper">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setIsZoomed(false);
                  }}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumbnail-image"
                  />
                  {index === currentImageIndex && (
                    <div className="thumbnail-overlay">
                      <span className="check-icon">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fullscreen-gallery" onClick={closeFullscreen}>
          <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-fullscreen"
              onClick={closeFullscreen}
              aria-label="Close fullscreen"
            >
              ✕
            </button>
            
            <div className="fullscreen-image-container">
              <img
                src={images[currentImageIndex]}
                alt={`${title} - Image ${currentImageIndex + 1}`}
                className="fullscreen-image"
              />
              
              {images.length > 1 && (
                <>
                  <button 
                    className="fullscreen-nav-btn prev"
                    onClick={previousImage}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button 
                    className="fullscreen-nav-btn next"
                    onClick={nextImage}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="fullscreen-thumbnails">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className={`fullscreen-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}

            <div className="fullscreen-counter">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
