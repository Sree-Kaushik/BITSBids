import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReviewSystem = ({ userId, itemId, orderId, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewStats, setReviewStats] = useState({});
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
    aspects: {
      communication: 5,
      itemCondition: 5,
      delivery: 5,
      overall: 5
    }
  });

  useEffect(() => {
    if (userId) {
      fetchReviews();
    }
  }, [userId, filter, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        rating: filter !== 'all' ? filter : undefined,
        sortBy,
        sortOrder: 'desc'
      };

      const response = await axios.get(`/api/reviews/user/${userId}`, { params });
      setReviews(response.data.data.reviews);
      setReviewStats(response.data.data.stats);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const reviewData = {
        revieweeId: userId,
        itemId,
        orderId,
        ...reviewForm
      };

      await axios.post('/api/reviews', reviewData);
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewForm({
        rating: 5,
        title: '',
        comment: '',
        aspects: {
          communication: 5,
          itemCondition: 5,
          delivery: 5,
          overall: 5
        }
      });
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleHelpfulVote = async (reviewId, helpful) => {
    try {
      await axios.put(`/api/reviews/${reviewId}/helpful`, { helpful });
      fetchReviews(); // Refresh to show updated vote counts
    } catch (error) {
      toast.error('Failed to update vote');
    }
  };

  const StarRating = ({ rating, onRatingChange, readonly = false, size = 'medium' }) => {
    const [hover, setHover] = useState(0);

    return (
      <div className={`star-rating ${size}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= (hover || rating) ? 'filled' : 'empty'}`}
            onClick={() => !readonly && onRatingChange && onRatingChange(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            disabled={readonly}
          >
            ★
          </button>
        ))}
        <span className="rating-text">({rating}/5)</span>
      </div>
    );
  };

  const RatingDistribution = ({ distribution, total }) => (
    <div className="rating-distribution">
      <h4>Rating Distribution</h4>
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = distribution.find(d => d._id === rating)?.count || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;
        
        return (
          <div key={rating} className="rating-bar">
            <span className="rating-label">{rating} ★</span>
            <div className="bar-container">
              <div 
                className="bar-fill" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="rating-count">({count})</span>
          </div>
        );
      })}
    </div>
  );

  const ReviewCard = ({ review }) => {
    const [showResponse, setShowResponse] = useState(false);
    const [responseText, setResponseText] = useState('');

    const handleResponse = async () => {
      try {
        await axios.put(`/api/reviews/${review._id}/respond`, {
          comment: responseText
        });
        toast.success('Response added successfully');
        setShowResponse(false);
        setResponseText('');
        fetchReviews();
      } catch (error) {
        toast.error('Failed to add response');
      }
    };

    return (
      <div className="review-card">
        <div className="review-header">
          <div className="reviewer-info">
            <div className="reviewer-avatar">
              {review.reviewer.avatar ? (
                <img src={review.reviewer.avatar} alt="Reviewer" />
              ) : (
                <div className="avatar-placeholder">
                  {review.reviewer.firstName.charAt(0)}{review.reviewer.lastName.charAt(0)}
                </div>
              )}
            </div>
            <div className="reviewer-details">
              <h4>{review.reviewer.firstName} {review.reviewer.lastName}</h4>
              <p>{review.reviewer.campus} Campus</p>
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="review-rating">
            <StarRating rating={review.rating} readonly size="small" />
            {review.isVerified && (
              <span className="verified-badge">✓ Verified Purchase</span>
            )}
          </div>
        </div>

        <div className="review-content">
          <h3 className="review-title">{review.title}</h3>
          <p className="review-comment">{review.comment}</p>
          
          {review.aspects && (
            <div className="review-aspects">
              <h5>Detailed Ratings:</h5>
              <div className="aspects-grid">
                {Object.entries(review.aspects).map(([aspect, rating]) => (
                  <div key={aspect} className="aspect-item">
                    <span className="aspect-label">
                      {aspect.charAt(0).toUpperCase() + aspect.slice(1)}:
                    </span>
                    <StarRating rating={rating} readonly size="small" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {review.images && review.images.length > 0 && (
            <div className="review-images">
              {review.images.map((image, index) => (
                <img key={index} src={image} alt={`Review ${index + 1}`} />
              ))}
            </div>
          )}
        </div>

        <div className="review-actions">
          <div className="helpful-votes">
            <span>Was this helpful?</span>
            <button 
              className="helpful-btn"
              onClick={() => handleHelpfulVote(review._id, true)}
            >
              👍 Yes ({review.helpfulVotes?.filter(v => v.helpful).length || 0})
            </button>
            <button 
              className="helpful-btn"
              onClick={() => handleHelpfulVote(review._id, false)}
            >
              👎 No ({review.helpfulVotes?.filter(v => !v.helpful).length || 0})
            </button>
          </div>

          {user && user._id === userId && !review.response && (
            <button 
              className="respond-btn"
              onClick={() => setShowResponse(!showResponse)}
            >
              Respond
            </button>
          )}
        </div>

        {review.response && (
          <div className="review-response">
            <h5>Response from seller:</h5>
            <p>{review.response.comment}</p>
            <span className="response-date">
              {new Date(review.response.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}

        {showResponse && (
          <div className="response-form">
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write your response..."
              rows="3"
            />
            <div className="response-actions">
              <button onClick={handleResponse} className="btn btn-primary">
                Submit Response
              </button>
              <button 
                onClick={() => setShowResponse(false)} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="review-system">
      {/* Review Summary */}
      {reviewStats.averages && (
        <div className="review-summary">
          <div className="summary-header">
            <div className="overall-rating">
              <div className="rating-number">
                {reviewStats.averages.avgRating?.toFixed(1) || '0.0'}
              </div>
              <StarRating 
                rating={Math.round(reviewStats.averages.avgRating || 0)} 
                readonly 
              />
              <p>Based on {reviewStats.totalReviews} reviews</p>
            </div>
            
            <RatingDistribution 
              distribution={reviewStats.ratingDistribution} 
              total={reviewStats.totalReviews} 
            />
          </div>

          {reviewStats.averages.avgCommunication && (
            <div className="aspect-averages">
              <h4>Average Aspect Ratings</h4>
              <div className="aspects-summary">
                <div className="aspect-summary">
                  <span>Communication</span>
                  <StarRating 
                    rating={Math.round(reviewStats.averages.avgCommunication)} 
                    readonly 
                    size="small" 
                  />
                </div>
                <div className="aspect-summary">
                  <span>Item Condition</span>
                  <StarRating 
                    rating={Math.round(reviewStats.averages.avgItemCondition)} 
                    readonly 
                    size="small" 
                  />
                </div>
                <div className="aspect-summary">
                  <span>Delivery</span>
                  <StarRating 
                    rating={Math.round(reviewStats.averages.avgDelivery)} 
                    readonly 
                    size="small" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Write Review Button */}
      {user && user._id !== userId && itemId && orderId && (
        <div className="write-review-section">
          <button 
            className="btn btn-primary"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            Write a Review
          </button>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="review-form-container">
          <form onSubmit={handleReviewSubmit} className="review-form">
            <h3>Write Your Review</h3>
            
            <div className="form-group">
              <label>Overall Rating *</label>
              <StarRating 
                rating={reviewForm.rating}
                onRatingChange={(rating) => 
                  setReviewForm(prev => ({ ...prev, rating }))
                }
              />
            </div>

            <div className="form-group">
              <label>Review Title *</label>
              <input
                type="text"
                value={reviewForm.title}
                onChange={(e) => 
                  setReviewForm(prev => ({ ...prev, title: e.target.value }))
                }
                placeholder="Summarize your experience"
                maxLength="100"
                required
              />
            </div>

            <div className="form-group">
              <label>Your Review *</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => 
                  setReviewForm(prev => ({ ...prev, comment: e.target.value }))
                }
                placeholder="Share details about your experience"
                rows="5"
                maxLength="1000"
                required
              />
            </div>

            <div className="aspects-section">
              <h4>Rate Specific Aspects</h4>
              <div className="aspects-grid">
                {Object.entries(reviewForm.aspects).map(([aspect, rating]) => (
                  <div key={aspect} className="aspect-rating">
                    <label>
                      {aspect.charAt(0).toUpperCase() + aspect.slice(1)}
                    </label>
                    <StarRating 
                      rating={rating}
                      onRatingChange={(newRating) => 
                        setReviewForm(prev => ({
                          ...prev,
                          aspects: {
                            ...prev.aspects,
                            [aspect]: newRating
                          }
                        }))
                      }
                      size="small"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Submit Review
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Sorting */}
      <div className="review-controls">
        <div className="review-filters">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Most Recent</option>
            <option value="rating">Highest Rated</option>
            <option value="helpfulScore">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))
        ) : (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to leave a review!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;
