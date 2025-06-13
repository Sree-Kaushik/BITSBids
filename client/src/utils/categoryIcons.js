export const categoryIcons = {
  'Electronics': '📱',
  'Books': '📚',
  'Clothing': '👕',
  'Sports': '⚽',
  'Furniture': '🪑',
  'Accessories': '👜',
  'Vehicles': '🚗',
  'Services': '🔧',
  'Others': '📦'
};

export const getCategoryIcon = (category) => {
  return categoryIcons[category] || '📦';
};

export const getCategoryColor = (category) => {
  const colors = {
    'Electronics': '#3498db',
    'Books': '#e74c3c',
    'Clothing': '#9b59b6',
    'Sports': '#f39c12',
    'Furniture': '#27ae60',
    'Accessories': '#e91e63',
    'Vehicles': '#34495e',
    'Services': '#16a085',
    'Others': '#95a5a6'
  };
  return colors[category] || '#95a5a6';
};
