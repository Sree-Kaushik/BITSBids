import React, { useState, useEffect } from 'react';

const AuctionTimer = ({ 
  endTime, 
  onTimeUp = null, 
  showMilliseconds = false,
  size = 'medium',
  theme = 'default'
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    total: 0
  });
  
  const [isUrgent, setIsUrgent] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setHasEnded(true);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
          total: 0
        });
        
        if (onTimeUp && !hasEnded) {
          onTimeUp();
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      const milliseconds = Math.floor((difference % 1000) / 10);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        total: difference
      });

      // Set urgent state (less than 1 hour)
      setIsUrgent(difference < 60 * 60 * 1000);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, showMilliseconds ? 10 : 1000);

    return () => clearInterval(interval);
  }, [endTime, onTimeUp, hasEnded, showMilliseconds]);

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  const getTimerClass = () => {
    let classes = `auction-timer timer-${size} timer-${theme}`;
    
    if (hasEnded) {
      classes += ' timer-ended';
    } else if (isUrgent) {
      classes += ' timer-urgent';
    } else if (timeLeft.days === 0 && timeLeft.hours < 6) {
      classes += ' timer-warning';
    }
    
    return classes;
  };

  const getStatusText = () => {
    if (hasEnded) {
      return 'Auction Ended';
    }
    
    if (timeLeft.days > 0) {
      return `${timeLeft.days} day${timeLeft.days !== 1 ? 's' : ''} left`;
    }
    
    if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m left`;
    }
    
    if (timeLeft.minutes > 0) {
      return `${timeLeft.minutes}m ${timeLeft.seconds}s left`;
    }
    
    return `${timeLeft.seconds}s left`;
  };

  if (hasEnded) {
    return (
      <div className={getTimerClass()}>
        <div className="timer-ended-message">
          <span className="ended-icon">🏁</span>
          <span className="ended-text">Auction Ended</span>
        </div>
      </div>
    );
  }

  return (
    <div className={getTimerClass()}>
      <div className="timer-status">
        <span className="status-icon">⏰</span>
        <span className="status-text">{getStatusText()}</span>
      </div>
      
      <div className="timer-display">
        {timeLeft.days > 0 && (
          <div className="time-unit">
            <span className="time-value">{formatNumber(timeLeft.days)}</span>
            <span className="time-label">Days</span>
          </div>
        )}
        
        {(timeLeft.days > 0 || timeLeft.hours > 0) && (
          <div className="time-unit">
            <span className="time-value">{formatNumber(timeLeft.hours)}</span>
            <span className="time-label">Hours</span>
          </div>
        )}
        
        <div className="time-unit">
          <span className="time-value">{formatNumber(timeLeft.minutes)}</span>
          <span className="time-label">Min</span>
        </div>
        
        <div className="time-unit">
          <span className="time-value">{formatNumber(timeLeft.seconds)}</span>
          <span className="time-label">Sec</span>
        </div>
        
        {showMilliseconds && timeLeft.total < 60000 && (
          <div className="time-unit milliseconds">
            <span className="time-value">{formatNumber(timeLeft.milliseconds)}</span>
            <span className="time-label">MS</span>
          </div>
        )}
      </div>
      
      {isUrgent && (
        <div className="urgent-warning">
          <span className="warning-icon">🚨</span>
          <span className="warning-text">Ending Soon!</span>
        </div>
      )}
    </div>
  );
};

export default AuctionTimer;
