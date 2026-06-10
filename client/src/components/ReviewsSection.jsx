import { useEffect, useState } from 'react';
import api from '../api/axios';

const fallbackReviews = [
  {
    id: 1,
    name: 'Sophia Henderson',
    date: 'May 15, 2026',
    rating: 5,
    comment:
      'The selection here is absolutely unmatched. I found beautiful designer options from Gucci and Burberry that weren\'t available anywhere else in the city. The personal shopper service made the experience incredibly smooth and completely stress-free. I will definitely be returning for my wardrobe upgrade next season.',
  },
  {
    id: 2,
    name: 'Marcus Vance',
    date: 'April 29, 2026',
    rating: 5,
    comment:
      'High-end store with fantastic customer care. I had an issue with a designer jacket I bought, and the manager handled it immediately with no questions asked. Extremely professional. It\'s rare to see this level of dedication to service these days. Vogue Plaza remains my favorite retail destination.',
  },
  {
    id: 3,
    name: 'Adhila Syedmuhammed',
    date: 'April 12, 2026',
    rating: 5,
    comment:
      'Elegant environment, clean store, and highly attentive staff. They helped me pick out a bespoke suit and matching shoes within an hour. The customer satisfaction team is top-notch, checking in post-purchase to ensure absolute comfort. Truly a masterclass in modern retail customer service.',
  },
];

export default function ReviewsSection() {
  const [reviews, setReviews] = useState(fallbackReviews);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/reviews');
        if (Array.isArray(response.data) && response.data.length > 0) {
          setReviews(response.data.map((review, index) => ({ id: review._id || review.id || index, ...review })));
        }
      } catch (error) {
        setReviews(fallbackReviews);
      }
    };

    fetchReviews();
  }, []);

  const toggleReadMore = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="reviews">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">CUSTOMER VOICES</h2>
        </div>
        <div className="overall-rating">
          <div className="rating-big">4.8</div>
          <div className="stars review-stars-large">★★★★★</div>
          <div className="review-count">Based on 482 verified customer reviews</div>
        </div>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <span className="reviewer-name">{review.name}</span>
                <span className="review-date">{review.date}</span>
              </div>
              <div className="review-stars">{'★'.repeat(review.rating || review.stars || 5)}</div>
              <div className="review-text-container">
                <p className={`review-text ${expanded[review.id] ? 'expanded' : 'clamped'}`}>{review.comment}</p>
                <button type="button" className="read-more-btn" onClick={() => toggleReadMore(review.id)}>
                  {expanded[review.id] ? 'Read Less' : 'Read More'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
