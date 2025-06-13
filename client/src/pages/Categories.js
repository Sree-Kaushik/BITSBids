import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCategories([
        {
          name: 'Electronics',
          icon: '💻',
          count: 1186,
          trend: '+35%',
          image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
          description: 'Laptops, smartphones, gaming devices, and tech accessories',
          avgPrice: 45000,
          topItems: ['iPhone 15 Pro', 'MacBook Pro M3', 'Gaming Setup'],
          subcategories: ['Smartphones', 'Laptops', 'Gaming', 'Accessories', 'Audio']
        },
        {
          name: 'Books & Study Materials',
          icon: '📚',
          count: 824,
          trend: '+28%',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
          description: 'Textbooks, notes, study guides, and academic resources',
          avgPrice: 2500,
          topItems: ['Engineering Books', 'Study Notes', 'Reference Materials'],
          subcategories: ['Textbooks', 'Notes', 'References', 'Digital Content', 'Stationery']
        },
        {
          name: 'Fashion & Accessories',
          icon: '👕',
          count: 589,
          trend: '+18%',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
          description: 'Clothing, shoes, bags, watches, and fashion accessories',
          avgPrice: 1800,
          topItems: ['Designer Bags', 'Sneakers', 'Watches'],
          subcategories: ['Clothing', 'Shoes', 'Bags', 'Watches', 'Jewelry']
        },
        {
          name: 'Sports & Fitness',
          icon: '🏃',
          count: 367,
          trend: '+22%',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          description: 'Sports equipment, fitness gear, and outdoor activities',
          avgPrice: 3200,
          topItems: ['Gym Equipment', 'Sports Gear', 'Outdoor Equipment'],
          subcategories: ['Gym Equipment', 'Sports Gear', 'Outdoor', 'Fitness Accessories', 'Team Sports']
        },
        {
          name: 'Furniture',
          icon: '🪑',
          count: 234,
          trend: '+15%',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          description: 'Study desks, chairs, storage solutions, and room decor',
          avgPrice: 5500,
          topItems: ['Study Desks', 'Office Chairs', 'Storage Units'],
          subcategories: ['Study Furniture', 'Storage', 'Decor', 'Lighting', 'Bedding']
        },
        {
          name: 'Vehicles',
          icon: '🚲',
          count: 156,
          trend: '+12%',
          image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
          description: 'Bicycles, scooters, and vehicle accessories',
          avgPrice: 8500,
          topItems: ['Bicycles', 'Electric Scooters', 'Bike Accessories'],
          subcategories: ['Bicycles', 'Scooters', 'Accessories', 'Parts', 'Safety Gear']
        },
        {
          name: 'Services',
          icon: '🔧',
          count: 89,
          trend: '+25%',
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
          description: 'Tutoring, repairs, design services, and freelance work',
          avgPrice: 1500,
          topItems: ['Tutoring', 'Design Services', 'Repair Services'],
          subcategories: ['Tutoring', 'Design', 'Repairs', 'Programming', 'Writing']
        },
        {
          name: 'Others',
          icon: '📦',
          count: 267,
          trend: '+8%',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
          description: 'Miscellaneous items, collectibles, and unique finds',
          avgPrice: 2200,
          topItems: ['Collectibles', 'Art & Crafts', 'Musical Instruments'],
          subcategories: ['Collectibles', 'Art', 'Music', 'Hobbies', 'Miscellaneous']
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const CategoryCard = ({ category, index }) => (
    <div 
      className="category-card-detailed"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="category-image-container">
        <img 
          src={category.image} 
          alt={category.name}
          className="category-image"
        />
        <div className="category-overlay">
          <div className="category-icon-large">{category.icon}</div>
          <div className="category-trend-badge">
            <span className="trend-arrow">↗</span>
            <span>{category.trend}</span>
          </div>
        </div>
      </div>
      
      <div className="category-content-detailed">
        <div className="category-header">
          <h3 className="category-name">{category.name}</h3>
          <span className="category-count">{category.count} items</span>
        </div>
        
        <p className="category-description">{category.description}</p>
        
        <div className="category-stats">
          <div className="stat-item">
            <span className="stat-label">Avg Price</span>
            <span className="stat-value">₹{category.avgPrice.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Growth</span>
            <span className="stat-value positive">{category.trend}</span>
          </div>
        </div>
        
        <div className="top-items">
          <h4>Popular Items:</h4>
          <div className="top-items-list">
            {category.topItems.map((item, idx) => (
              <span key={idx} className="top-item-tag">{item}</span>
            ))}
          </div>
        </div>
        
        <div className="subcategories">
          <h4>Subcategories:</h4>
          <div className="subcategories-list">
            {category.subcategories.map((sub, idx) => (
              <Link 
                key={idx} 
                to={`/browse?category=${category.name}&subcategory=${sub}`}
                className="subcategory-link"
              >
                {sub}
              </Link>
            ))}
          </div>
        </div>
        
        <Link 
          to={`/browse?category=${category.name}`}
          className="browse-category-btn"
        >
          <span>Browse {category.name}</span>
          <span className="btn-arrow">→</span>
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="categories-page">
        <div className="categories-header">
          <h1>Categories</h1>
          <p>Loading categories...</p>
        </div>
        <div className="loading-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="category-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-description"></div>
                <div className="skeleton-stats"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h1>Browse by Categories</h1>
        <p>Explore items across different categories from fellow BITSians</p>
        
        <div className="categories-stats">
          <div className="total-categories">
            <span className="stat-number">{categories.length}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="total-items">
            <span className="stat-number">
              {categories.reduce((sum, cat) => sum + cat.count, 0).toLocaleString()}
            </span>
            <span className="stat-label">Total Items</span>
          </div>
          <div className="avg-growth">
            <span className="stat-number">+19%</span>
            <span className="stat-label">Avg Growth</span>
          </div>
        </div>
      </div>

      <div className="categories-grid-detailed">
        {categories.map((category, index) => (
          <CategoryCard key={category.name} category={category} index={index} />
        ))}
      </div>

      <div className="categories-footer">
        <div className="cta-section">
          <h2>Can't find what you're looking for?</h2>
          <p>Create a listing and let other students know what you need!</p>
          <Link to="/create-item" className="cta-btn">
            <span>Create Listing</span>
            <span className="btn-icon">➕</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Categories;
