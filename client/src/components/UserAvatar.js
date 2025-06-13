import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const UserAvatar = ({ user, size = 'medium', editable = false, onAvatarUpdate }) => {
  const [showUpload, setShowUpload] = useState(false);

  const sizeClasses = {
    small: 'avatar-small',
    medium: 'avatar-medium',
    large: 'avatar-large'
  };

  const handleAvatarUpload = (images) => {
    if (images && images.length > 0) {
      onAvatarUpdate && onAvatarUpdate(images[0].avatar);
      setShowUpload(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className={`user-avatar ${sizeClasses[size]}`}>
      {user?.avatar ? (
        <img 
          src={user.avatar} 
          alt={`${user.firstName} ${user.lastName}`}
          className="avatar-image"
        />
      ) : (
        <div className="avatar-placeholder">
          {getInitials(user?.firstName, user?.lastName)}
        </div>
      )}
      
      {editable && (
        <button 
          className="avatar-edit-btn"
          onClick={() => setShowUpload(!showUpload)}
          title="Change avatar"
        >
          📷
        </button>
      )}

      {showUpload && (
        <div className="avatar-upload-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Update Profile Picture</h3>
              <button 
                className="close-btn"
                onClick={() => setShowUpload(false)}
              >
                ×
              </button>
            </div>
            <ImageUpload 
              type="avatar"
              onImagesUploaded={handleAvatarUpload}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
