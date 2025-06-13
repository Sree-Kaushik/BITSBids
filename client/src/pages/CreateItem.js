import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CreateItem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    startingPrice: '',
    minimumIncrement: '50',
    auctionStartTime: '',
    auctionEndTime: '',
    location: '',
    quickStart: false,
    specifications: {
      brand: '',
      model: '',
      color: '',
      size: '',
      weight: '',
      warranty: ''
    }
  });
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'Electronics', icon: '💻', subcategories: ['Smartphones', 'Laptops', 'Gaming', 'Audio', 'Cameras'] },
    { value: 'Books & Study Materials', icon: '📚', subcategories: ['Textbooks', 'Notes', 'References', 'Stationery'] },
    { value: 'Fashion & Accessories', icon: '👕', subcategories: ['Clothing', 'Shoes', 'Bags', 'Watches', 'Jewelry'] },
    { value: 'Sports & Fitness', icon: '🏃', subcategories: ['Gym Equipment', 'Sports Gear', 'Outdoor', 'Fitness'] },
    { value: 'Furniture', icon: '🪑', subcategories: ['Study Furniture', 'Storage', 'Decor', 'Lighting'] },
    { value: 'Vehicles', icon: '🚲', subcategories: ['Bicycles', 'Scooters', 'Accessories', 'Parts'] },
    { value: 'Services', icon: '🔧', subcategories: ['Tutoring', 'Design', 'Repairs', 'Programming'] },
    { value: 'Others', icon: '📦', subcategories: ['Collectibles', 'Art', 'Music', 'Hobbies'] }
  ];

  const conditions = [
    { value: 'New', description: 'Brand new, never used', color: '#10b981' },
    { value: 'Like New', description: 'Barely used, excellent condition', color: '#059669' },
    { value: 'Very Good', description: 'Minor signs of use, works perfectly', color: '#3b82f6' },
    { value: 'Good', description: 'Some wear, fully functional', color: '#f59e0b' },
    { value: 'Fair', description: 'Visible wear, works as intended', color: '#ef4444' },
    { value: 'Poor', description: 'Heavy wear, may need repairs', color: '#991b1b' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('specifications.')) {
      const specField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      return true;
    });

    if (images.length + validFiles.length > 8) {
      toast.error('Maximum 8 images allowed');
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          file,
          url: e.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const reorderImages = (dragIndex, hoverIndex) => {
    const draggedImage = images[dragIndex];
    const newImages = [...images];
    newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, draggedImage);
    setImages(newImages);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.condition) {
      newErrors.condition = 'Condition is required';
    }
    
    if (!formData.startingPrice) {
      newErrors.startingPrice = 'Starting price is required';
    } else if (parseFloat(formData.startingPrice) < 1) {
      newErrors.startingPrice = 'Starting price must be at least ₹1';
    }
    
    if (!formData.auctionEndTime) {
      newErrors.auctionEndTime = 'Auction end time is required';
    } else {
      const endTime = new Date(formData.auctionEndTime);
      const now = new Date();
      const minEndTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
      
      if (endTime <= minEndTime) {
        newErrors.auctionEndTime = 'Auction must run for at least 1 hour';
      }
    }
    
    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    
    if (!isDraft && !validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const auctionData = {
        ...formData,
        images: images.map(img => img.url),
        seller: user.id,
        status: isDraft ? 'draft' : 'active',
        createdAt: new Date().toISOString()
      };
      
      console.log('Auction data:', auctionData);
      
      toast.success(isDraft ? 'Draft saved successfully!' : 'Auction created successfully!');
      navigate('/my-auctions');
    } catch (error) {
      toast.error('Failed to create auction');
    } finally {
      setLoading(false);
    }
  };

  const setQuickStartTimes = () => {
    const now = new Date();
    const startTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
    const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    
    setFormData(prev => ({
      ...prev,
      auctionStartTime: startTime.toISOString().slice(0, 16),
      auctionEndTime: endTime.toISOString().slice(0, 16),
      quickStart: true
    }));
  };

  return (
    <div className="create-item-page">
      <div className="create-item-container">
        <div className="create-item-header">
          <div className="header-content">
            <h1>Create New Auction</h1>
            <p>List your item and start earning from fellow BITSians</p>
            <div className="header-stats">
              <div className="stat">
                <span className="stat-icon">💰</span>
                <span className="stat-text">Avg. Sale Price: ₹12,500</span>
              </div>
              <div className="stat">
                <span className="stat-icon">⏱️</span>
                <span className="stat-text">Avg. Sale Time: 3.2 days</span>
              </div>
              <div className="stat">
                <span className="stat-icon">📈</span>
                <span className="stat-text">Success Rate: 94%</span>
              </div>
            </div>
          </div>
        </div>

        <form className="create-item-form">
          {/* Images Section */}
          <div className="form-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">📷</span>
                Images
                <span className="required">*</span>
              </h2>
              <p className="section-description">
                Add up to 8 high-quality images. First image will be the main display image.
              </p>
            </div>
            
            <div 
              className={`image-upload-area ${dragActive ? 'drag-active' : ''} ${errors.images ? 'error' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-label">
                <div className="upload-icon">📸</div>
                <div className="upload-text">
                  <strong>Click to upload</strong> or drag and drop images here
                </div>
                <div className="upload-hint">
                  PNG, JPG, JPEG up to 5MB each • Maximum 8 images
                </div>
              </label>
            </div>
            
            {errors.images && (
              <span className="error-message">{errors.images}</span>
            )}

            {images.length > 0 && (
              <div className="image-preview-grid">
                {images.map((image, index) => (
                  <div key={image.id} className="image-preview">
                    <img src={image.url} alt={`Preview ${index + 1}`} />
                    <div className="image-overlay">
                      {index === 0 && (
                        <span className="main-image-badge">Main</span>
                      )}
                      <button
                        type="button"
                        className="image-remove"
                        onClick={() => removeImage(image.id)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="image-info">
                      <span className="image-name">{image.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="form-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">📝</span>
                Basic Information
              </h2>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Item Title <span className="required">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Enter a descriptive title (e.g., iPhone 15 Pro Max 256GB Natural Titanium)"
                maxLength="100"
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
              <div className="input-help">
                {formData.title.length}/100 characters • Be specific and descriptive
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Describe your item in detail. Include condition, usage history, included accessories, reason for selling, etc."
                rows="6"
                maxLength="2000"
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
              <div className="input-help">
                {formData.description.length}/2000 characters • Detailed descriptions get more bids
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Category <span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`form-select ${errors.category ? 'error' : ''}`}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.value}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category && (
                  <span className="error-message">{errors.category}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Condition <span className="required">*</span>
                </label>
                <div className="condition-grid">
                  {conditions.map((condition) => (
                    <label
                      key={condition.value}
                      className={`condition-option ${formData.condition === condition.value ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={condition.value}
                        checked={formData.condition === condition.value}
                        onChange={handleInputChange}
                      />
                      <div className="condition-content">
                        <div 
                          className="condition-indicator"
                          style={{ backgroundColor: condition.color }}
                        ></div>
                        <div className="condition-text">
                          <span className="condition-name">{condition.value}</span>
                          <span className="condition-desc">{condition.description}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.condition && (
                  <span className="error-message">{errors.condition}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Pickup location (e.g., Hostel A, Room 123 or Main Gate)"
              />
              <div className="input-help">
                Help buyers know where to collect the item
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="form-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">🔧</span>
                Specifications
              </h2>
              <p className="section-description">
                Add specific details about your item (optional but recommended)
              </p>
            </div>

            <div className="specifications-grid">
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  name="specifications.brand"
                  value={formData.specifications.brand}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Apple, Samsung, Dell"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Model</label>
                <input
                  type="text"
                  name="specifications.model"
                  value={formData.specifications.model}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., iPhone 15 Pro Max, Galaxy S24"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Color</label>
                <input
                  type="text"
                  name="specifications.color"
                  value={formData.specifications.color}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Natural Titanium, Space Gray"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Size/Capacity</label>
                <input
                  type="text"
                  name="specifications.size"
                  value={formData.specifications.size}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., 256GB, Large, 15-inch"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Weight</label>
                <input
                  type="text"
                  name="specifications.weight"
                  value={formData.specifications.weight}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., 221g, 2.1kg"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Warranty</label>
                <input
                  type="text"
                  name="specifications.warranty"
                  value={formData.specifications.warranty}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., 6 months remaining, No warranty"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Auction Settings */}
          <div className="form-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">💰</span>
                Pricing & Auction Settings
              </h2>
            </div>

            <div className="pricing-grid">
              <div className="form-group">
                <label className="form-label">
                  Starting Price (₹) <span className="required">*</span>
                </label>
                <div className="price-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    name="startingPrice"
                    value={formData.startingPrice}
                    onChange={handleInputChange}
                    className={`form-input price-input ${errors.startingPrice ? 'error' : ''}`}
                    placeholder="0"
                    min="1"
                    step="1"
                  />
                </div>
                {errors.startingPrice && (
                  <span className="error-message">{errors.startingPrice}</span>
                )}
                <div className="input-help">
                  Set a competitive starting price to attract more bidders
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Minimum Bid Increment (₹)</label>
                <div className="price-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    name="minimumIncrement"
                    value={formData.minimumIncrement}
                    onChange={handleInputChange}
                    className="form-input price-input"
                    min="1"
                    step="1"
                  />
                </div>
                <div className="input-help">
                  Minimum amount by which each bid must increase
                </div>
              </div>
            </div>

            <div className="auction-timing">
              <div className="timing-header">
                <h3>Auction Timing</h3>
                <button
                  type="button"
                  className="quick-start-btn"
                  onClick={setQuickStartTimes}
                >
                  <span>⚡</span>
                  Quick Start (7 days)
                </button>
              </div>

              <div className="timing-grid">
                <div className="form-group">
                  <label className="form-label">
                    Auction Start Time
                  </label>
                  <input
                    type="datetime-local"
                    name="auctionStartTime"
                    value={formData.auctionStartTime}
                    onChange={handleInputChange}
                    className="form-input"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <div className="input-help">
                    Leave empty to start immediately
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Auction End Time <span className="required">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="auctionEndTime"
                    value={formData.auctionEndTime}
                    onChange={handleInputChange}
                    className={`form-input ${errors.auctionEndTime ? 'error' : ''}`}
                    min={new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)}
                  />
                  {errors.auctionEndTime && (
                    <span className="error-message">{errors.auctionEndTime}</span>
                  )}
                  <div className="input-help">
                    Auction must run for at least 1 hour
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button"
              className="btn-save-draft"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Save Draft</span>
                </>
              )}
            </button>
            
            <button 
              type="submit"
              className="btn-create-auction"
              onClick={(e) => handleSubmit(e, false)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Create Auction</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;
