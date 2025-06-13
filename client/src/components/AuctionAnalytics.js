import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AuctionAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/analytics/auction?range=${timeRange}`);
      setAnalytics(response.data.analytics);
      setChartData(response.data.chartData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="auction-analytics">
      <div className="analytics-header">
        <h2>Auction Analytics</h2>
        <div className="time-range-selector">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <div className="metric-value">{formatCurrency(analytics?.totalRevenue || 0)}</div>
            <div className={`metric-change ${analytics?.revenueChange >= 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(analytics?.revenueChange || 0)} from last period
            </div>
          </div>
        </div>

        <div className="metric-card auctions">
          <div className="metric-icon">🏛️</div>
          <div className="metric-content">
            <h3>Total Auctions</h3>
            <div className="metric-value">{analytics?.totalAuctions || 0}</div>
            <div className={`metric-change ${analytics?.auctionsChange >= 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(analytics?.auctionsChange || 0)} from last period
            </div>
          </div>
        </div>

        <div className="metric-card bids">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <h3>Total Bids</h3>
            <div className="metric-value">{analytics?.totalBids || 0}</div>
            <div className={`metric-change ${analytics?.bidsChange >= 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(analytics?.bidsChange || 0)} from last period
            </div>
          </div>
        </div>

        <div className="metric-card success-rate">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>Success Rate</h3>
            <div className="metric-value">{analytics?.successRate || 0}%</div>
            <div className={`metric-change ${analytics?.successRateChange >= 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(analytics?.successRateChange || 0)} from last period
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Revenue Over Time</h3>
          <div className="chart-placeholder">
            <canvas id="revenueChart" width="400" height="200"></canvas>
          </div>
        </div>

        <div className="chart-container">
          <h3>Auction Activity</h3>
          <div className="chart-placeholder">
            <canvas id="activityChart" width="400" height="200"></canvas>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="detailed-analytics">
        <div className="analytics-section">
          <h3>Category Performance</h3>
          <div className="category-performance">
            {analytics?.categoryPerformance?.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-info">
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.count} auctions</span>
                </div>
                <div className="category-revenue">
                  {formatCurrency(category.revenue)}
                </div>
                <div className="category-bar">
                  <div 
                    className="category-progress"
                    style={{ width: `${(category.revenue / analytics.totalRevenue) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-section">
          <h3>Campus Performance</h3>
          <div className="campus-performance">
            {analytics?.campusPerformance?.map((campus, index) => (
              <div key={index} className="campus-item">
                <div className="campus-info">
                  <span className="campus-name">{campus.name}</span>
                  <span className="campus-count">{campus.count} auctions</span>
                </div>
                <div className="campus-revenue">
                  {formatCurrency(campus.revenue)}
                </div>
                <div className="campus-bar">
                  <div 
                    className="campus-progress"
                    style={{ width: `${(campus.revenue / analytics.totalRevenue) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Items */}
      <div className="top-items-section">
        <h3>Top Performing Auctions</h3>
        <div className="top-items-list">
          {analytics?.topItems?.map((item, index) => (
            <div key={index} className="top-item">
              <div className="item-rank">#{index + 1}</div>
              <div className="item-image">
                {item.image ? (
                  <img src={item.image} alt={item.title} />
                ) : (
                  <div className="no-image">📷</div>
                )}
              </div>
              <div className="item-details">
                <h4>{item.title}</h4>
                <p>{item.category} • {item.campus}</p>
              </div>
              <div className="item-stats">
                <div className="final-price">{formatCurrency(item.finalPrice)}</div>
                <div className="bid-count">{item.totalBids} bids</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="insights-section">
        <h3>Insights & Recommendations</h3>
        <div className="insights-grid">
          {analytics?.insights?.map((insight, index) => (
            <div key={index} className={`insight-card ${insight.type}`}>
              <div className="insight-icon">{insight.icon}</div>
              <div className="insight-content">
                <h4>{insight.title}</h4>
                <p>{insight.description}</p>
                {insight.action && (
                  <button className="insight-action">{insight.action}</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuctionAnalytics;
