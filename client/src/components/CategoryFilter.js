import React from 'react';
import { getCategoryIcon, getCategoryColor } from '../utils/categoryIcons';

const CategoryFilter = ({ selectedCategory, onCategoryChange, showAll = true }) => {
  const categories = [
    'Electronics', 'Books', 'Clothing', 'Sports', 
    'Furniture', 'Accessories', 'Vehicles', 'Services', 'Others'
  ];

  return (
    <div className="category-filter">
      <h3>Categories</h3>
      <div className="category-grid">
        {showAll && (
          <button
            className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => onCategoryChange('all')}
          >
            <span className="category-icon">🏪</span>
            <span className="category-name">All</span>
          </button>
        )}
        
        {categories.map(category => (
          <button
            key={category}
            className={`category-item ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
            style={{ '--category-color': getCategoryColor(category) }}
          >
            <span className="category-icon">{getCategoryIcon(category)}</span>
            <span className="category-name">{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
