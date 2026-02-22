import { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Reviews/Testimonials Component
function Reviews() {
  const [currentReview, setCurrentReview] = useState(0);

  // Customer reviews data
  const reviews = [
    {
      id: 1,
      name: "Chidi Okafor",
      location: "Lekki, Lagos",
      rating: 5,
      date: "2 days ago",
      image: "https://i.pravatar.cc/150?img=12",
      review: "Best shawarma in Lagos! The chicken is always fresh and perfectly seasoned. I order from Masterpiece at least twice a week. Their garlic sauce is addictive!",
      verified: true
    },
    {
      id: 2,
      name: "Amina Mohammed",
      location: "Victoria Island",
      rating: 5,
      date: "1 week ago",
      image: "https://i.pravatar.cc/150?img=47",
      review: "Amazing quality and generous portions! The beef shawarma is my favorite. Delivery is always on time and the food arrives hot. Highly recommend!",
      verified: true
    },
    {
      id: 3,
      name: "Tunde Bakare",
      location: "Ikoyi",
      rating: 5,
      date: "3 days ago",
      image: "https://i.pravatar.cc/150?img=33",
      review: "I've tried many shawarma spots in Lagos, but Masterpiece is on another level. The flavors are authentic, ingredients are fresh, and service is excellent!",
      verified: true
    },
    {
      id: 4,
      name: "Sarah Johnson",
      location: "Ajah",
      rating: 4,
      date: "5 days ago",
      image: "https://i.pravatar.cc/150?img=45",
      review: "Delicious shawarma with great value for money. The mixed grill plate is incredible! Only wish they had more locations. Will definitely order again.",
      verified: true
    },
    {
      id: 5,
      name: "Ibrahim Suleiman",
      location: "Lekki Phase 2",
      rating: 5,
      date: "1 day ago",
      image: "https://i.pravatar.cc/150?img=56",
      review: "Outstanding! The food quality is consistently excellent. I appreciate that they're halal certified. The customer service is also top-notch. Five stars all the way!",
      verified: true
    },
    {
      id: 6,
      name: "Ngozi Eze",
      location: "Victoria Island",
      rating: 5,
      date: "4 days ago",
      image: "https://i.pravatar.cc/150?img=29",
      review: "My go-to spot for lunch! The portions are generous, prices are fair, and everything tastes amazing. The veggie wrap is surprisingly good too!",
      verified: true
    }
  ];

  // Auto-rotate reviews every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [reviews.length]);

  // Navigate to previous review
  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Navigate to next review
  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  // Calculate average rating
  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const totalReviews = reviews.length;

  return (
    <section className="reviews-section">
      <div className="reviews-container">
        {/* Section Header */}
        <div className="reviews-header">
          <h2 className="reviews-title">What Our Customers Say</h2>
          <p className="reviews-subtitle">
            Real reviews from real customers
          </p>
          
          {/* Overall Rating */}
          <div className="overall-rating">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="star-icon filled" />
              ))}
            </div>
            <div className="rating-info">
              <span className="rating-number">{averageRating}</span>
              <span className="rating-text">out of 5</span>
            </div>
            <div className="total-reviews">
              Based on {totalReviews}+ verified reviews
            </div>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="reviews-carousel">
          {/* Navigation Buttons */}
          <button 
            className="carousel-btn prev-btn"
            onClick={prevReview}
            aria-label="Previous review"
          >
            <FaChevronLeft />
          </button>

          <button 
            className="carousel-btn next-btn"
            onClick={nextReview}
            aria-label="Next review"
          >
            <FaChevronRight />
          </button>

          {/* Review Cards */}
          <div className="reviews-track">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className={`review-card ${
                  index === currentReview ? 'active' : ''
                } ${
                  index === (currentReview - 1 + reviews.length) % reviews.length ? 'prev' : ''
                } ${
                  index === (currentReview + 1) % reviews.length ? 'next' : ''
                }`}
              >
                <div className="review-card-inner">
                  {/* Quote Icon */}
                  <div className="quote-icon">
                    <FaQuoteLeft />
                  </div>

                  {/* Review Text */}
                  <p className="review-text">"{review.review}"</p>

                  {/* Rating Stars */}
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`star-icon ${i < review.rating ? 'filled' : ''}`}
                      />
                    ))}
                  </div>

                  {/* Reviewer Info */}
                  <div className="reviewer-info">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="reviewer-image"
                    />
                    <div className="reviewer-details">
                      <div className="reviewer-name">
                        {review.name}
                        {review.verified && (
                          <span className="verified-badge" title="Verified Purchase">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="reviewer-meta">
                        <span className="reviewer-location">{review.location}</span>
                        <span className="review-date"> • {review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="carousel-dots">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentReview ? 'active' : ''}`}
                onClick={() => setCurrentReview(index)}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <div className="trust-item">
            <span className="trust-icon">✓</span>
            <span className="trust-text">Verified Reviews</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🏆</span>
            <span className="trust-text">Top Rated</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">❤️</span>
            <span className="trust-text">Customer Favorite</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Reviews;