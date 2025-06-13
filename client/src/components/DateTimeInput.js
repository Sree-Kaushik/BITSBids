import React, { useState, useEffect } from 'react';

const DateTimeInput = ({ 
  label, 
  value, 
  onChange, 
  name, 
  required = false, 
  minDate = null,
  maxDate = null,
  error = null,
  disabled = false,
  className = ''
}) => {
  const [localValue, setLocalValue] = useState('');

  useEffect(() => {
    if (value) {
      // Convert to local datetime string format
      const date = new Date(value);
      const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setLocalValue(localDateTime);
    }
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    if (onChange) {
      // Convert back to UTC for storage
      const utcDate = new Date(newValue);
      onChange({
        target: {
          name,
          value: utcDate.toISOString()
        }
      });
    }
  };

  const getMinDateTime = () => {
    if (minDate) {
      const date = new Date(minDate);
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    }
    // Default to current time
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const getMaxDateTime = () => {
    if (maxDate) {
      const date = new Date(maxDate);
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    }
    return null;
  };

  return (
    <div className={`datetime-input-container ${className}`}>
      {label && (
        <label className="datetime-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
      <div className="datetime-input-wrapper">
        <input
          type="datetime-local"
          name={name}
          value={localValue}
          onChange={handleChange}
          min={getMinDateTime()}
          max={getMaxDateTime()}
          required={required}
          disabled={disabled}
          className={`datetime-input ${error ? 'error' : ''}`}
        />
        
        <div className="datetime-icon">
          📅
        </div>
      </div>
      
      {error && (
        <span className="datetime-error">{error}</span>
      )}
      
      <div className="datetime-help">
        Select date and time for your auction
      </div>
    </div>
  );
};

export default DateTimeInput;
