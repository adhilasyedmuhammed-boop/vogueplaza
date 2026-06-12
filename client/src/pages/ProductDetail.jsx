import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';

const FALLBACK = [
  { _id: '1', name: 'Cashmere Coat', brand: 'Armani', category: 'womenswear', price: 1299, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800', description: 'A timeless cashmere coat crafted from the finest Mongolian cashmere. Features a clean, minimal silhouette with subtle tonal buttons and a beautifully structured collar. Available in a range of classic and seasonal colours.', sizes: ['XS','S','M','L','XL'] },
  { _id: '2', name: 'Silk Dress', brand: 'Gucci', category: 'womenswear', price: 899, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800', description: 'A luxurious silk dress with delicate draping and a fluid silhouette. Crafted from 100% pure silk, this piece is perfect for any occasion from daytime elegance to evening sophistication.', sizes: ['XS','S','M','L'] },
];

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ total: 0, avgRating: 0, distribution: { 5:0,4:0,3:0,2:0,1:0 } });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data);
        setMainImage(res.data.image);
        const relRes = await axios.get(`/products?category=${res.data.category}&limit=4`);
        setRelated(relRes.data.filter(p => p._id !== id).slice(0, 4));
      } catch {
        const found = FALLBACK.find(p => p._id === id) || FALLBACK[0];
        setProduct(found);
        setMainImage(found.image);
        setRelated(FALLBACK.filter(p => p._id !== found._id).slice(0, 4));
      }
      // Fetch reviews
      try {
        const revRes = await axios.get(`/reviews/product/${id}`);
        setReviews(revRes.data.reviews || []);
        setReviewStats(revRes.data.stats || { total: 0, avgRating: 0, distribution: { 5:0,4:0,3:0,2:0,1:0 } });
      } catch { /* no reviews yet */ }
      setLoading(false);
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <><Navbar /><div className="loading-screen"><div className="spinner"/><span className="loading-text">Loading</span></div><Footer /></>;
  if (!product) return null;

  const wished = isInWishlist(product._id);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      toast.warning('Please select a size');
      return;
    }
    addToCart({ ...product, size: selectedSize || 'One Size' });
    toast.success('Added to cart 🛍️');
  };

  const thumbnails = [product.image, 
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=300',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300',
  ];

  return (
    <>
      <Navbar />
      <div className="vp-container">
        <div className="product-detail-page">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link to="/">Home</Link><span className="breadcrumb-sep">/</span>
            <Link to="/products">Products</Link><span className="breadcrumb-sep">/</span>
            <Link to={`/products?category=${product.category}`}>{product.category}</Link><span className="breadcrumb-sep">/</span>
            <span style={{ color: '#111' }}>{product.name}</span>
          </div>

          <div className="product-detail-grid">
            {/* Images */}
            <div>
              <div className="product-images-main">
                <img src={mainImage} alt={product.name} />
              </div>
              <div className="product-thumbnails">
                {thumbnails.map((src, i) => (
                  <div key={i} className={`product-thumbnail${mainImage === src ? ' active' : ''}`} onClick={() => setMainImage(src)}>
                    <img src={src} alt={`${product.name} view ${i+1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="product-detail-info">
              <div className="product-detail-brand">{product.brand}</div>
              <h1 className="product-detail-name">{product.name}</h1>
              <div className="product-detail-price">
                {product.originalPrice ? (
                  <>
                    <span className="price-original">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                    <span className="price-sale">₹{product.price?.toLocaleString('en-IN')}</span>
                    {product.discount > 0 && <span className="price-discount-badge">{product.discount}% OFF</span>}
                  </>
                ) : (
                  <span>₹{product.price?.toLocaleString('en-IN')}</span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                <span style={{ color: '#B8914E', fontSize: '14px', letterSpacing: '2px' }}>
                  {'★'.repeat(Math.round(reviewStats.avgRating || 5))}{'☆'.repeat(5 - Math.round(reviewStats.avgRating || 5))}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{reviewStats.avgRating || '5.0'}</span>
                <span style={{ fontSize: '12px', color: '#888' }}>({reviewStats.total || 0} reviews)</span>
              </div>

              <div className="product-detail-divider" />

              {product.sizes?.length > 0 && (
                <>
                  <div className="product-size-label">
                    Select Size
                    <span className="size-guide-link">Size Guide</span>
                  </div>
                  <div className="product-sizes">
                    {product.sizes.map(s => (
                      <button key={s} className={`size-btn${selectedSize === s ? ' selected' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
                    ))}
                  </div>
                </>
              )}

              <div className="product-actions">
                <button className="btn-add-cart" onClick={handleAddToCart}>🛍️ Add to Cart</button>
                <button className={`btn-wishlist${wished ? ' active' : ''}`} onClick={() => toggleWishlist(product)}>
                  {wished ? '♥ In Wishlist' : '♡ Add to Wishlist'}
                </button>
              </div>

              <div className="product-detail-divider" />

              <div className="product-detail-meta">
                <p><strong>Description:</strong></p>
                <p>{product.description || 'A premium luxury piece crafted from the finest materials. Designed for those who appreciate the finest things in life, this item combines superior craftsmanship with timeless style.'}</p>
                <div className="product-detail-divider" />
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Brand:</strong> {product.brand}</p>
                <p><strong>Availability:</strong> {product.inStock !== false ? '✓ In Stock' : '✗ Out of Stock'}</p>
              </div>

              <div className="product-detail-divider" />
              <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#888' }}>
                <span>🚚 Free Shipping over ₹5,000</span>
                <span>↩ 15-Day Returns</span>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="product-reviews-section">
            <div className="section-header-center">
              <span className="section-eyebrow">Customer Feedback</span>
              <h2 className="section-heading">Ratings & Reviews</h2>
            </div>

            <div className="reviews-overview">
              {/* Rating Summary */}
              <div className="reviews-summary">
                <div className="reviews-avg">
                  <span className="reviews-avg-number">{reviewStats.avgRating || '0'}</span>
                  <div className="reviews-avg-stars">
                    {'★'.repeat(Math.round(reviewStats.avgRating || 0))}{'☆'.repeat(5 - Math.round(reviewStats.avgRating || 0))}
                  </div>
                  <span className="reviews-avg-count">{reviewStats.total} {reviewStats.total === 1 ? 'Review' : 'Reviews'}</span>
                </div>
                <div className="reviews-distribution">
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="reviews-dist-row">
                      <span className="reviews-dist-label">{star}★</span>
                      <div className="reviews-dist-bar">
                        <div className="reviews-dist-fill" style={{ width: reviewStats.total > 0 ? `${(reviewStats.distribution[star] / reviewStats.total) * 100}%` : '0%' }}/>
                      </div>
                      <span className="reviews-dist-count">{reviewStats.distribution[star] || 0}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Write Review Button */}
              <div className="reviews-write">
                <button className="btn-write-review" onClick={() => setShowReviewForm(!showReviewForm)}>
                  {showReviewForm ? '✕ Cancel' : '✍ Write a Review'}
                </button>
              </div>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="review-form-card">
                <h3 className="review-form-title">Share Your Experience</h3>
                <div className="review-form-rating">
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Your Rating:</span>
                  <div className="star-selector">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} className={`star-select-btn${reviewForm.rating >= star ? ' active' : ''}`} onClick={() => setReviewForm({...reviewForm, rating: star})}>
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <input type="text" className="review-form-input" placeholder="Your Name" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} />
                <input type="text" className="review-form-input" placeholder="Review Title (e.g., Excellent quality!)" value={reviewForm.title} onChange={e => setReviewForm({...reviewForm, title: e.target.value})} />
                <textarea className="review-form-textarea" placeholder="Write your review here... What did you like? How was the quality? Would you recommend this product?" value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} rows={4} />
                <button className="btn-primary" disabled={submittingReview} onClick={async () => {
                  if (!reviewForm.name || !reviewForm.comment) { toast.error('Please fill name and review'); return; }
                  setSubmittingReview(true);
                  try {
                    await axios.post(`/reviews/product/${id}`, reviewForm);
                    toast.success('Review submitted! Thank you 🎉');
                    setShowReviewForm(false);
                    setReviewForm({ name: '', rating: 5, title: '', comment: '' });
                    // Refresh reviews
                    const revRes = await axios.get(`/reviews/product/${id}`);
                    setReviews(revRes.data.reviews || []);
                    setReviewStats(revRes.data.stats || reviewStats);
                  } catch { toast.error('Failed to submit review'); }
                  setSubmittingReview(false);
                }}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
              {reviews.length === 0 ? (
                <div className="reviews-empty">
                  <p>No reviews yet for this product. Be the first to share your experience!</p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="review-card">
                    <div className="review-card-header">
                      <div className="review-avatar">{rev.name.charAt(0).toUpperCase()}</div>
                      <div className="review-header-info">
                        <div className="review-author">{rev.name}</div>
                        <div className="review-date">{new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      </div>
                      <div className="review-stars">
                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                      </div>
                    </div>
                    {rev.title && <div className="review-title">{rev.title}</div>}
                    <p className="review-comment">{rev.comment}</p>
                    {rev.isVerifiedPurchase && <span className="review-verified">✓ Verified Purchase</span>}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div style={{ marginTop: '64px' }}>
              <div className="section-header-center">
                <span className="section-eyebrow">You May Also Like</span>
                <h2 className="section-heading">Related Products</h2>
              </div>
              <div className="product-grid-4">
                {related.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <div className="whatsapp-bubble" onClick={() => window.open('https://wa.me/919876543210','_blank')} role="button">
        💬<span className="whatsapp-tooltip">Chat with us</span>
      </div>
    </>
  );
}
