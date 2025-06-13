import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const ItemCard = ({ item }) => {
  const timeRemaining = () => {
    const endTime = new Date(item.auctionEndTime);
    const now = new Date();
    
    if (endTime < now) {
      return 'Auction ended';
    }
    
    return `Ends ${formatDistanceToNow(endTime, { addSuffix: true })}`;
  };

  return (
    <div className="item-card">
      <Link to={`/item/${item._id}`} className="item-link">
        <div className="item-image">
          {item.images && item.images.length > 0 ? (
            <img src={item.images[0].url} alt={item.title} />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>
        
        <div className="item-details">
          <h3 className="item-title">{item.title}</h3>
          <p className="item-campus">{item.campus} Campus</p>
          <p className="item-category">{item.category}</p>
          
          <div className="item-pricing">
            <span className="current-price">₹{item.currentPrice}</span>
            {item.totalBids > 0 && (
              <span className="bid-count">{item.totalBids} bids</span>
            )}
          </div>
          
          <div className="item-timing">
            <span className={`time-remaining ${new Date(item.auctionEndTime) < new Date() ? 'ended' : ''}`}>
              {timeRemaining()}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;
