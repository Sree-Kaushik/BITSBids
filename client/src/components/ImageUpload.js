import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../utils/api';
import { toast } from 'react-toastify';

const ImageUpload = ({ onImagesUploaded, maxImages = 5, type = 'item' }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    if (type === 'avatar') {
      formData.append('avatar', acceptedFiles[0]);
    } else {
      acceptedFiles.forEach(file => {
        formData.append('images', file);
      });
    }

    try {
      const endpoint = type === 'avatar' ? '/upload/avatar' : '/upload/item-images';
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (type === 'avatar') {
        onImagesUploaded([response.data.data]);
        toast.success('Avatar uploaded successfully!');
      } else {
        const newImages = [...uploadedImages, ...response.data.data];
        setUploadedImages(newImages);
        onImagesUploaded(newImages);
        toast.success(`${response.data.data.length} image(s) uploaded successfully!`);
      }
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  }, [uploadedImages, onImagesUploaded, type]);

  const removeImage = async (index, publicId) => {
    try {
      await api.delete(`/upload/image/${publicId}`);
      const newImages = uploadedImages.filter((_, i) => i !== index);
      setUploadedImages(newImages);
      onImagesUploaded(newImages);
      toast.success('Image removed successfully!');
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: type === 'avatar' ? 1 : maxImages,
    disabled: uploading || (type !== 'avatar' && uploadedImages.length >= maxImages)
  });

  return (
    <div className="image-upload">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="upload-progress">
            <div className="spinner"></div>
            <p>Uploading...</p>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">📷</div>
            <p>
              {isDragActive
                ? 'Drop the images here...'
                : type === 'avatar'
                ? 'Click or drag to upload avatar'
                : `Click or drag to upload images (${uploadedImages.length}/${maxImages})`
              }
            </p>
            <small>Supports: JPG, PNG, GIF, WebP (Max 5MB each)</small>
          </div>
        )}
      </div>

      {uploadedImages.length > 0 && type !== 'avatar' && (
        <div className="uploaded-images">
          <h4>Uploaded Images:</h4>
          <div className="image-grid">
            {uploadedImages.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.url} alt={`Upload ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => removeImage(index, image.publicId)}
                  className="remove-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
