import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DeviceShowcase = ({ category = 'Electronics', limit = 8 }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  // Device categories with real device data
  const deviceCategories = {
    'smartphones': {
      title: 'Smartphones',
      icon: '📱',
      brands: ['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Google'],
      devices: [
        {
          id: 1,
          title: 'iPhone 15 Pro Max',
          brand: 'Apple',
          model: '256GB Natural Titanium',
          currentPrice: 89000,
          originalPrice: 159900,
          condition: 'Like New',
          seller: 'Arjun Sharma',
          campus: 'Goa',
          images: [
            'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692895395658'
          ],
          specs: {
            display: '6.7" Super Retina XDR',
            processor: 'A17 Pro chip',
            camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
            battery: 'Up to 29 hours video playback',
            storage: '256GB'
          },
          totalBids: 31,
          timeRemaining: '2d 14h',
          featured: true
        },
        {
          id: 2,
          title: 'Samsung Galaxy S24 Ultra',
          brand: 'Samsung',
          model: '512GB Titanium Gray',
          currentPrice: 75000,
          originalPrice: 129999,
          condition: 'Excellent',
          seller: 'Priya Patel',
          campus: 'Pilani',
          images: [
            'https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-ultra-s928-sm-s928bztqins-thumb-539573043'
          ],
          specs: {
            display: '6.8" Dynamic AMOLED 2X',
            processor: 'Snapdragon 8 Gen 3',
            camera: '200MP Main + 50MP Periscope + 10MP Telephoto + 12MP Ultra Wide',
            battery: '5000mAh',
            storage: '512GB'
          },
          totalBids: 18,
          timeRemaining: '1d 8h',
          featured: true
        },
        {
          id: 3,
          title: 'Xiaomi 14 Ultra',
          brand: 'Xiaomi',
          model: '512GB Black',
          currentPrice: 45000,
          originalPrice: 99999,
          condition: 'Very Good',
          seller: 'Rohit Kumar',
          campus: 'Hyderabad',
          images: [
            'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1709888470.77242990.png'
          ],
          specs: {
            display: '6.73" LTPO AMOLED',
            processor: 'Snapdragon 8 Gen 3',
            camera: '50MP Main + 50MP Ultra Wide + 50MP Periscope + 50MP Telephoto',
            battery: '5300mAh',
            storage: '512GB'
          },
          totalBids: 24,
          timeRemaining: '3d 2h',
          featured: false
        }
      ]
    },
    'laptops': {
      title: 'Laptops',
      icon: '💻',
      brands: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS'],
      devices: [
        {
          id: 4,
          title: 'MacBook Pro M3 Max',
          brand: 'Apple',
          model: '16-inch 32GB 1TB',
          currentPrice: 185000,
          originalPrice: 399900,
          condition: 'Like New',
          seller: 'Sneha Reddy',
          campus: 'Goa',
          images: [
            'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290'
          ],
          specs: {
            display: '16.2" Liquid Retina XDR',
            processor: 'Apple M3 Max chip',
            memory: '32GB unified memory',
            storage: '1TB SSD',
            graphics: '40-core GPU'
          },
          totalBids: 23,
          timeRemaining: '2d 14h',
          featured: true
        },
        {
          id: 5,
          title: 'Dell XPS 15',
          brand: 'Dell',
          model: '9530 i7 32GB RTX 4070',
          currentPrice: 125000,
          originalPrice: 249990,
          condition: 'Excellent',
          seller: 'Vikram Singh',
          campus: 'Pilani',
          images: [
            'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/gray/notebook-xps-15-9530-gray-gallery-1.psd'
          ],
          specs: {
            display: '15.6" 4K OLED Touch',
            processor: 'Intel Core i7-13700H',
            memory: '32GB DDR5',
            storage: '1TB NVMe SSD',
            graphics: 'NVIDIA RTX 4070 8GB'
          },
          totalBids: 15,
          timeRemaining: '4d 6h',
          featured: false
        }
      ]
    },
    'gaming': {
      title: 'Gaming Devices',
      icon: '🎮',
      brands: ['Sony', 'Microsoft', 'Nintendo', 'Steam Deck', 'ASUS ROG'],
      devices: [
        {
          id: 6,
          title: 'PlayStation 5',
          brand: 'Sony',
          model: 'Standard Edition 825GB',
          currentPrice: 35000,
          originalPrice: 54990,
          condition: 'Very Good',
          seller: 'Ananya Gupta',
          campus: 'Hyderabad',
          images: [
            'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21'
          ],
          specs: {
            processor: 'AMD Zen 2 8-core',
            graphics: 'AMD RDNA 2 GPU',
            memory: '16GB GDDR6',
            storage: '825GB SSD',
            resolution: '4K at 120fps'
          },
          totalBids: 42,
          timeRemaining: '1d 12h',
          featured: true
        },
        {
          id: 7,
          title: 'Steam Deck OLED',
          brand: 'Valve',
          model: '512GB OLED',
          currentPrice: 45000,
          originalPrice: 65000,
          condition: 'Like New',
          seller: 'Karan Joshi',
          campus: 'Goa',
          images: [
            'https://cdn.cloudflare.steamstatic.com/steamdeck/images/steamdeck_hero_01.jpg'
          ],
          specs: {
            display: '7.4" HDR OLED',
            processor: 'AMD APU Zen 2',
            memory: '16GB LPDDR5',
            storage: '512GB NVMe SSD',
            battery: '50Whr'
          },
          totalBids: 18,
          timeRemaining: '5d 3h',
          featured: false
        }
      ]
    },
    'accessories': {
      title: 'Accessories',
      icon: '🎧',
      brands: ['Apple', 'Sony', 'Bose', 'Samsung', 'JBL'],
      devices: [
        {
          id: 8,
          title: 'AirPods Pro 2nd Gen',
          brand: 'Apple',
          model: 'USB-C with MagSafe',
          currentPrice: 18000,
          originalPrice: 24900,
          condition: 'Like New',
          seller: 'Ravi Sharma',
          campus: 'Pilani',
          images: [
            'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361'
          ],
          specs: {
            connectivity: 'Bluetooth 5.3',
            battery: '6 hours + 30 hours with case',
            features: 'Active Noise Cancellation',
            water: 'IPX4 rated',
            charging: 'USB-C + MagSafe'
          },
          totalBids: 12,
          timeRemaining: '3d 8h',
          featured: false
        }
      ]
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [activeFilter, category]);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let allDevices = [];
      Object.values(deviceCategories).forEach(cat => {
        allDevices = [...allDevices, ...cat.devices];
      });

      if (activeFilter !== 'all') {
        allDevices = allDevices.filter(device => 
          deviceCategories[activeFilter]?.devices.some(d => d.id === device.id)
        );
      }

      setDevices(allDevices.slice(0, limit));
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const DeviceCard = ({ device }) => (
    <div className="device-showcase-card">
      <div className="device-image-container">
        <img 
          src={device.images[0]} 
          alt={device.title}
          className="device-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Device+Image';
          }}
        />
        
        <div className="device-overlay">
          <div className="device-badges">
            {device.featured && (
              <span className="featured-badge">⭐ Featured</span>
            )}
            <span className="condition-badge">{device.condition}</span>
            <span className="brand-badge">{device.brand}</span>
          </div>
          
          <div className="device-quick-actions">
            <button className="quick-action-btn" title="Add to Watchlist">
              👁️
            </button>
            <button className="quick-action-btn" title="Share">
              📤
            </button>
          </div>
        </div>
      </div>

      <div className="device-content">
        <div className="device-header">
          <h3 className="device-title">{device.title}</h3>
          <p className="device-model">{device.model}</p>
        </div>

        <div className="device-specs-preview">
          {Object.entries(device.specs).slice(0, 2).map(([key, value]) => (
            <div key={key} className="spec-item">
              <span className="spec-label">{key}:</span>
              <span className="spec-value">{value}</span>
            </div>
          ))}
        </div>

        <div className="device-pricing">
          <div className="price-section">
            <div className="current-price">₹{device.currentPrice.toLocaleString()}</div>
            <div className="original-price">₹{device.originalPrice.toLocaleString()}</div>
            <div className="discount-percentage">
              {Math.round((1 - device.currentPrice / device.originalPrice) * 100)}% OFF
            </div>
          </div>
        </div>

        <div className="device-meta">
          <div className="seller-info">
            <span className="seller-icon">👤</span>
            <span className="seller-name">{device.seller}</span>
            <span className="campus-tag">{device.campus}</span>
          </div>
          
          <div className="auction-info">
            <div className="bid-count">
              <span className="bid-icon">🎯</span>
              <span>{device.totalBids} bids</span>
            </div>
            <div className="time-remaining">
              <span className="time-icon">⏰</span>
              <span>{device.timeRemaining}</span>
            </div>
          </div>
        </div>

        <div className="device-actions">
          <Link to={`/item/${device.id}`} className="view-details-btn">
            View Details
          </Link>
          <button className="bid-now-btn">
            Bid Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="device-showcase">
      <div className="showcase-header">
        <h2>Featured Devices & Electronics</h2>
        <p>Discover amazing deals on the latest tech from fellow students</p>
      </div>

      <div className="showcase-filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          <span className="filter-icon">📱</span>
          <span>All Devices</span>
        </button>
        
        {Object.entries(deviceCategories).map(([key, category]) => (
          <button 
            key={key}
            className={`filter-btn ${activeFilter === key ? 'active' : ''}`}
            onClick={() => setActiveFilter(key)}
          >
            <span className="filter-icon">{category.icon}</span>
            <span>{category.title}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="showcase-loading">
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="device-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-price"></div>
                  <div className="skeleton-meta"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="devices-grid">
          {devices.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      )}

      <div className="showcase-footer">
        <Link to="/browse?category=Electronics" className="view-all-btn">
          <span>View All Electronics</span>
          <span className="arrow-icon">→</span>
        </Link>
      </div>
    </div>
  );
};

export default DeviceShowcase;
