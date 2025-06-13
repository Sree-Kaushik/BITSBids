import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '', // Fixed: Added phone number
    campus: '',
    year: '',
    branch: '',
    bitsId: '',
    bio: '',
    location: '',
    socialLinks: {
      linkedin: '',
      github: '',
      instagram: ''
    }
  });
  const [avatar, setAvatar] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '', // Fixed: Load phone number
        campus: user.campus || '',
        year: user.year || '',
        branch: user.branch || '',
        bitsId: user.bitsId || '',
        bio: user.bio || '',
        location: user.location || '',
        socialLinks: user.socialLinks || {
          linkedin: '',
          github: '',
          instagram: ''
        }
      });
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats({
        totalListings: 12,
        activeBids: 8,
        wonAuctions: 3,
        totalEarnings: 25000,
        rating: 4.8,
        reviewCount: 24
      });
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedData = {
        ...formData,
        avatar: avatar || user.avatar
      };
      
      updateUser(updatedData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limited = cleaned.slice(0, 10);
    
    // Format as XXX-XXX-XXXX
    if (limited.length >= 6) {
      return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
    } else if (limited.length >= 3) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    }
    return limited;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phoneNumber: formatted
    }));
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {avatar || user?.avatar ? (
                  <img src={avatar || user.avatar} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload" className="avatar-upload-btn">
                  📷
                </label>
              </div>
              
              <div className="profile-name">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="profile-email">{user?.email}</div>
              <div className="profile-campus">{user?.campus} Campus</div>
            </div>
          </div>

          <div className="profile-stats">
            <h3 className="stats-title">Your Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{stats.totalListings || 0}</div>
                <div className="stat-label">Listings</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.activeBids || 0}</div>
                <div className="stat-label">Active Bids</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.wonAuctions || 0}</div>
                <div className="stat-label">Won</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">₹{(stats.totalEarnings || 0).toLocaleString()}</div>
                <div className="stat-label">Earned</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.rating || 0}⭐</div>
                <div className="stat-label">Rating</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.reviewCount || 0}</div>
                <div className="stat-label">Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Main Content */}
        <div className="profile-main">
          <div className="profile-tabs">
            {[
              { id: 'personal', label: 'Personal Info', icon: '👤' },
              { id: 'academic', label: 'Academic Details', icon: '🎓' },
              { id: 'preferences', label: 'Preferences', icon: '⚙️' },
              { id: 'security', label: 'Security', icon: '🔒' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="profile-content">
            <form onSubmit={handleSubmit} className="profile-form">
              {activeTab === 'personal' && (
                <>
                  <h3>Personal Information</h3>
                  
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                    />
                    <small>Email cannot be changed as it's linked to your BITS account</small>
                  </div>

                  <div className="form-group full-width">
                    <label>Phone Number</label>
                    <div className="phone-input-container">
                      <span className="phone-prefix">+91</span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="Enter your phone number"
                        maxLength="12"
                      />
                    </div>
                    <small>Format: XXX-XXX-XXXX</small>
                  </div>

                  <div className="form-group full-width">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      rows="4"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Your current location"
                    />
                  </div>
                </>
              )}

              {activeTab === 'academic' && (
                <>
                  <h3>Academic Details</h3>
                  
                  <div className="form-group">
                    <label>Campus</label>
                    <select
                      name="campus"
                      value={formData.campus}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Campus</option>
                      <option value="Pilani">BITS Pilani, Pilani Campus</option>
                      <option value="Goa">BITS Pilani, Goa Campus</option>
                      <option value="Hyderabad">BITS Pilani, Hyderabad Campus</option>
                      <option value="Dubai">BITS Pilani, Dubai Campus</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Year</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year (Dual Degree)</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Branch/Programme</label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Branch</option>
                      <option value="Computer Science Engineering">Computer Science Engineering</option>
                      <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Chemical Engineering">Chemical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                      <option value="Biotechnology">Biotechnology</option>
                      <option value="Manufacturing Engineering">Manufacturing Engineering</option>
                      <option value="Economics">Economics</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>BITS ID</label>
                    <input
                      type="text"
                      name="bitsId"
                      value={formData.bitsId}
                      onChange={handleInputChange}
                      placeholder="e.g., 2022A7PS0479G"
                    />
                  </div>
                </>
              )}

              {activeTab === 'preferences' && (
                <>
                  <h3>Social Links</h3>
                  
                  <div className="form-group full-width">
                    <label>LinkedIn Profile</label>
                    <input
                      type="url"
                      name="socialLinks.linkedin"
                      value={formData.socialLinks.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>GitHub Profile</label>
                    <input
                      type="url"
                      name="socialLinks.github"
                      value={formData.socialLinks.github}
                      onChange={handleInputChange}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Instagram Profile</label>
                    <input
                      type="url"
                      name="socialLinks.instagram"
                      value={formData.socialLinks.instagram}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/yourusername"
                    />
                  </div>
                </>
              )}

              {activeTab === 'security' && (
                <>
                  <h3>Security Settings</h3>
                  
                  <div className="security-section">
                    <h4>Change Password</h4>
                    <div className="form-group">
                      <label>Current Password</label>
                      <input type="password" placeholder="Enter current password" />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input type="password" placeholder="Confirm new password" />
                    </div>
                  </div>

                  <div className="security-section">
                    <h4>Two-Factor Authentication</h4>
                    <div className="security-option">
                      <label className="checkbox-wrapper">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span>Enable 2FA via SMS</span>
                      </label>
                    </div>
                    <div className="security-option">
                      <label className="checkbox-wrapper">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span>Enable 2FA via Email</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="form-actions">
                <button type="button" className="btn-cancel">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-save"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
