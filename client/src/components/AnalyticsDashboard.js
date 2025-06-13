import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics?range=${timeRange}`);
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type) => {
    try {
      const response = await api.get(`/analytics/report/${type}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Analytics & Reports</h2>
        <div className="time-range-selector">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading analytics...</div>
      ) : (
        <div className="analytics-content">
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Total Revenue</h3>
              <p className="metric-value">₹{analytics.totalRevenue?.toLocaleString()}</p>
              <span className="metric-change positive">
                +{analytics.revenueGrowth}% from last period
              </span>
            </div>

            <div className="metric-card">
              <h3>Active Users</h3>
              <p className="metric-value">{analytics.activeUsers}</p>
              <span className="metric-change positive">
                +{analytics.userGrowth}% from last period
              </span>
            </div>

            <div className="metric-card">
              <h3>Successful Auctions</h3>
              <p className="metric-value">{analytics.successfulAuctions}</p>
              <span className="metric-change">
                {analytics.auctionSuccessRate}% success rate
              </span>
            </div>

            <div className="metric-card">
              <h3>Average Bid Value</h3>
              <p className="metric-value">₹{analytics.avgBidValue}</p>
              <span className="metric-change positive">
                +{analytics.bidValueGrowth}% from last period
              </span>
            </div>
          </div>

          <div className="charts-section">
            <div className="chart-container">
              <h3>Revenue Trend</h3>
              {/* Chart implementation would go here */}
              <div className="chart-placeholder">
                Revenue chart visualization
              </div>
            </div>

            <div className="chart-container">
              <h3>User Activity</h3>
              {/* Chart implementation would go here */}
              <div className="chart-placeholder">
                User activity chart visualization
              </div>
            </div>
          </div>

          <div className="reports-section">
            <h3>Generate Reports</h3>
            <div className="report-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => generateReport('sales')}
              >
                Sales Report
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => generateReport('users')}
              >
                User Report
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => generateReport('auctions')}
              >
                Auction Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
