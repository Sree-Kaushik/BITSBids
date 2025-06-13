import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [reports, setReports] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, auctionsRes, reportsRes, healthRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/auctions'),
        axios.get('/api/admin/reports'),
        axios.get('/api/admin/system-health')
      ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setAuctions(auctionsRes.data.data);
      setReports(reportsRes.data.data);
      setSystemHealth(healthRes.data.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      await axios.put(`/api/admin/users/${userId}/${action}`);
      toast.success(`User ${action} successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleAuctionAction = async (auctionId, action) => {
    try {
      await axios.put(`/api/admin/auctions/${auctionId}/${action}`);
      toast.success(`Auction ${action} successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error(`Failed to ${action} auction`);
    }
  };

  const OverviewTab = () => (
    <div className="admin-overview">
      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <div className="stat-number">{stats.totalUsers || 0}</div>
            <div className="stat-change positive">
              +{stats.newUsersToday || 0} today
            </div>
          </div>
        </div>

        <div className="stat-card auctions">
          <div className="stat-icon">🏛️</div>
          <div className="stat-content">
            <h3>Active Auctions</h3>
            <div className="stat-number">{stats.activeAuctions || 0}</div>
            <div className="stat-change positive">
              +{stats.newAuctionsToday || 0} today
            </div>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <div className="stat-number">₹{(stats.totalRevenue || 0).toLocaleString()}</div>
            <div className="stat-change positive">
              +₹{(stats.revenueToday || 0).toLocaleString()} today
            </div>
          </div>
        </div>

        <div className="stat-card bids">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Total Bids</h3>
            <div className="stat-number">{stats.totalBids || 0}</div>
            <div className="stat-change positive">
              +{stats.bidsToday || 0} today
            </div>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>User Registration Trend</h3>
          <div className="chart-placeholder">
            <canvas id="userChart" width="400" height="200"></canvas>
          </div>
        </div>

        <div className="chart-container">
          <h3>Revenue Trend</h3>
          <div className="chart-placeholder">
            <canvas id="revenueChart" width="400" height="200"></canvas>
          </div>
        </div>
      </div>

      <div className="system-health">
        <h3>System Health</h3>
        <div className="health-metrics">
          <div className="health-metric">
            <span className="metric-label">Server Status</span>
            <span className={`metric-value ${systemHealth.serverStatus}`}>
              {systemHealth.serverStatus === 'healthy' ? '🟢 Healthy' : '🔴 Issues'}
            </span>
          </div>
          <div className="health-metric">
            <span className="metric-label">Database</span>
            <span className={`metric-value ${systemHealth.databaseStatus}`}>
              {systemHealth.databaseStatus === 'healthy' ? '🟢 Connected' : '🔴 Issues'}
            </span>
          </div>
          <div className="health-metric">
            <span className="metric-label">Redis Cache</span>
            <span className={`metric-value ${systemHealth.redisStatus}`}>
              {systemHealth.redisStatus === 'healthy' ? '🟢 Active' : '🔴 Down'}
            </span>
          </div>
          <div className="health-metric">
            <span className="metric-label">Socket.IO</span>
            <span className={`metric-value ${systemHealth.socketStatus}`}>
              {systemHealth.socketStatus === 'healthy' ? '🟢 Connected' : '🔴 Issues'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const UsersTab = () => (
    <div className="admin-users">
      <div className="users-header">
        <h3>User Management</h3>
        <div className="users-filters">
          <select>
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
          <input type="text" placeholder="Search users..." />
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Campus</th>
              <th>Joined</th>
              <th>Auctions</th>
              <th>Bids</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.firstName} />
                      ) : (
                        <div className="avatar-placeholder">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="user-details">
                      <div className="user-name">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>{user.campus}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{user.auctionCount || 0}</td>
                <td>{user.bidCount || 0}</td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {user.status === 'active' ? (
                      <button 
                        className="btn btn-warning btn-sm"
                        onClick={() => handleUserAction(user._id, 'suspend')}
                      >
                        Suspend
                      </button>
                    ) : (
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleUserAction(user._id, 'activate')}
                      >
                        Activate
                      </button>
                    )}
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleUserAction(user._id, 'ban')}
                    >
                      Ban
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AuctionsTab = () => (
    <div className="admin-auctions">
      <div className="auctions-header">
        <h3>Auction Management</h3>
        <div className="auctions-filters">
          <select>
            <option value="all">All Auctions</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
            <option value="flagged">Flagged</option>
          </select>
          <input type="text" placeholder="Search auctions..." />
        </div>
      </div>

      <div className="auctions-grid">
        {auctions.map(auction => (
          <div key={auction._id} className="auction-card">
            <div className="auction-image">
              {auction.images?.[0] ? (
                <img src={auction.images[0]} alt={auction.title} />
              ) : (
                <div className="no-image">📷</div>
              )}
            </div>
            
            <div className="auction-details">
              <h4>{auction.title}</h4>
              <p className="auction-seller">
                by {auction.seller.firstName} {auction.seller.lastName}
              </p>
              <div className="auction-stats">
                <span>Current: ₹{auction.currentPrice.toLocaleString()}</span>
                <span>{auction.totalBids} bids</span>
              </div>
              <div className="auction-status">
                <span className={`status-badge ${auction.status}`}>
                  {auction.status}
                </span>
              </div>
            </div>

            <div className="auction-actions">
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => window.open(`/item/${auction._id}`, '_blank')}
              >
                View
              </button>
              {auction.status === 'active' && (
                <button 
                  className="btn btn-warning btn-sm"
                  onClick={() => handleAuctionAction(auction._id, 'pause')}
                >
                  Pause
                </button>
              )}
              <button 
                className="btn btn-danger btn-sm"
                onClick={() => handleAuctionAction(auction._id, 'remove')}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ReportsTab = () => (
    <div className="admin-reports">
      <div className="reports-header">
        <h3>Reports & Issues</h3>
        <div className="reports-filters">
          <select>
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      <div className="reports-list">
        {reports.map(report => (
          <div key={report._id} className="report-card">
            <div className="report-header">
              <div className="report-type">
                <span className={`type-badge ${report.type}`}>
                  {report.type}
                </span>
              </div>
              <div className="report-date">
                {new Date(report.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="report-content">
              <h4>{report.title}</h4>
              <p>{report.description}</p>
              
              <div className="report-details">
                <span>Reporter: {report.reporter.firstName} {report.reporter.lastName}</span>
                {report.targetUser && (
                  <span>Target: {report.targetUser.firstName} {report.targetUser.lastName}</span>
                )}
                {report.targetAuction && (
                  <span>Auction: {report.targetAuction.title}</span>
                )}
              </div>
            </div>

            <div className="report-actions">
              <button className="btn btn-success btn-sm">
                Resolve
              </button>
              <button className="btn btn-secondary btn-sm">
                Dismiss
              </button>
              <button className="btn btn-primary btn-sm">
                Investigate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, auctions, and system health</p>
      </div>

      <div className="admin-navigation">
        {[
          { id: 'overview', icon: '📊', label: 'Overview' },
          { id: 'users', icon: '👥', label: 'Users' },
          { id: 'auctions', icon: '🏛️', label: 'Auctions' },
          { id: 'reports', icon: '📋', label: 'Reports' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`admin-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'auctions' && <AuctionsTab />}
        {activeTab === 'reports' && <ReportsTab />}
      </div>
    </div>
  );
};

export default AdminDashboard;
