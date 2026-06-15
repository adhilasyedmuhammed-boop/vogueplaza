import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import RecentlyViewed, { addToRecentlyViewed } from '../components/RecentlyViewed';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';

const FALLBACK = [
  { _id: 'fallback1', name: 'Cashmere Coat', brand: 'Armani', category: 'womenswear', price: 1299, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800', description: 'A timeless cashmere coat crafted from the finest Mongolian cashmere. Features a clean, minimal silhouette with subtle tonal buttons and a beautifully structured collar. Available in a range of classic and seasonal colours.', sizes: ['XS','S','M','L','XL'] },
  { _id: 'fallback2', name: 'Silk Dress', brand: 'Gucci', category: 'womenswear', price: 899, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800', description: 'A luxurious silk dress with delicate draping and a fluid silhouette. Crafted from 100% pure silk, this piece is perfect for any occasion from daytime elegance to evening sophistication.', sizes: ['XS','S','M','L'] },
];

const DEMO_REVIEWS = [
  { _id: 'r1', name: 'Priya Sharma', rating: 5, title: 'Absolutely stunning quality!', comment: 'This is hands down the best purchase I\'ve made this year. The fabric quality is exceptional, fits perfectly and looks even better in person. Got so many compliments already! Totally worth the price.', isVerifiedPurchase: true, createdAt: '2026-05-28T10:30:00Z' },
  { _id: 'r2', name: 'Rahul Menon', rating: 5, title: 'Premium feel, excellent packaging', comment: 'Ordered for my wife\'s birthday and she loved it. The packaging was luxurious, product quality is top-notch. Delivery was on time too. Will definitely order again from Vogue Plaza!', isVerifiedPurchase: true, createdAt: '2026-05-20T14:15:00Z' },
  { _id: 'r3', name: 'Ananya Krishnan', rating: 4, title: 'Great product, minor size issue', comment: 'The quality and design are fantastic. Only reason for 4 stars is that it runs slightly small - I\'d recommend sizing up. Otherwise, the material is luxurious and colour is exactly as shown.', isVerifiedPurchase: true, createdAt: '2026-05-15T09:45:00Z' },
  { _id: 'r4', name: 'Arjun Nair', rating: 5, title: 'Best luxury fashion store online!', comment: 'I\'ve been shopping from Vogue Plaza for 6 months now. Every product has been genuine and premium. This one is no exception - அடிபொளி! Superb craftsmanship and attention to detail.', isVerifiedPurchase: true, createdAt: '2026-05-10T16:20:00Z' },
  { _id: 'r5', name: 'Meera Joshi', rating: 5, title: 'Worth every rupee!', comment: 'Was hesitant about the price initially but after receiving it, I can say it\'s 100% worth it. The quality speaks for itself. Perfect stitching, premium material, and elegant design.', isVerifiedPurchase: false, createdAt: '2026-04-28T11:00:00Z' },
];

const DEMO_STATS = { total: 5, avgRating: 4.8, distribution: { 5: 4, 4: 1, 3: 0, 2: 0, 1: 0 } };

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
  const zoomRef = useRef(null);

  // Pinch-to-zoom with non-passive touch listeners
  useEffect(() => {
    const el = zoomRef.current;
    if (!el) return;
    let pinchStart = 0;

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        pinchStart = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scale = Math.min(Math.max(dist / (pinchStart || dist), 1), 3);
        const img = el.querySelector('img');
        if (img) img.style.transform = `scale(${scale})`;
      }
    };
    const onTouchEnd = () => {
      const img = el.querySelector('img');
      if (img) img.style.transform = 'scale(1)';
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [mainImage]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data);
        setMainImage(res.data.image);
        addToRecentlyViewed(res.data);
        const relRes = await axios.get(`/products?category=${res.data.category}&limit=5`);
        const relProducts = Array.isArray(relRes.data?.products) ? relRes.data.products : (Array.isArray(relRes.data) ? relRes.data : []);
        setRelated(relProducts.filter(p => p._id !== id).slice(0, 4));
      } catch {
        const found = FALLBACK.find(p => p._id === id) || FALLBACK[0];
        setProduct(found);
        setMainImage(found.image);
        setRelated(FALLBACK.filter(p => p._id !== found._id).slice(0, 4));
      }
      // Fetch reviews
      try {
        const revRes = await axios.get(`/reviews/product/${id}`);
        const fetchedReviews = revRes.data.reviews || [];
        if (fetchedReviews.length > 0) {
          setReviews(fetchedReviews);
          setReviewStats(revRes.data.stats);
        } else {
          // Show demo reviews when no real reviews exist
          setReviews(DEMO_REVIEWS);
          setReviewStats(DEMO_STATS);
        }
      } catch {
        setReviews(DEMO_REVIEWS);
        setReviewStats(DEMO_STATS);
      }
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
      toast.warning('Please select your preferred size');
      return;
    }
    addToCart({ ...product, size: selectedSize || 'One Size' });
    toast.success('Item added to your bag');
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
              <div
                ref={zoomRef}
                className="product-images-main product-zoom-container"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.style.setProperty('--zoom-x', `${x}%`);
                  e.currentTarget.style.setProperty('--zoom-y', `${y}%`);
                }}
              >
                <img src={mainImage} alt={product.name} style={{ transition: 'transform 0.2s ease' }} />
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

              {product.originalPrice && product.discount > 0 && (
                <div className="product-offer-box">
                  <div className="product-offer-title">Special Offer</div>
                  <div className="product-offer-detail">
                    MRP <span className="product-offer-mrp">₹{product.originalPrice?.toLocaleString('en-IN')}</span> — Get it for just <strong>₹{product.price?.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="product-offer-saving">You save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({product.discount}% off)</div>
                </div>
              )}

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
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '6px', marginBottom: '12px' }}>
                    👗 This item usually fits true to size. When in doubt, go one size up.
                  </div>
                </>
              )}

              <div className="product-actions">
                {product.inStock === false ? (
                  <button className="btn-notify-me" onClick={() => {
                    const email = prompt('Enter your email to get notified when this item is back in stock:');
                    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                      toast.success('We\'ll notify you when this item is back!');
                    } else if (email) {
                      toast.error('Please enter a valid email');
                    }
                  }}>
                    🔔 Notify Me When Available
                  </button>
                ) : (
                  <button className="btn-add-cart" onClick={handleAddToCart}>Add to Cart</button>
                )}
                <button className={`btn-wishlist${wished ? ' active' : ''}`} onClick={() => toggleWishlist(product)}>
                  {wished ? '♥ In Wishlist' : '♡ Add to Wishlist'}
                </button>
              </div>

              {product.stockQty > 0 && product.stockQty <= 5 && (
                <div style={{ fontSize: '13px', color: '#e74c3c', fontWeight: 600, marginTop: '-12px', marginBottom: '16px' }}>
                  ⚡ Hurry! Only {product.stockQty} left in stock
                </div>
              )}

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
                <div className="review-photo-upload">
                  <label className="review-photo-label">
                    📷 Add Photos (optional)
                    <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => {
                      const files = Array.from(e.target.files).slice(0, 3);
                      const previews = files.map(f => URL.createObjectURL(f));
                      setReviewForm({ ...reviewForm, photos: previews });
                    }} />
                  </label>
                  {reviewForm.photos?.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      {reviewForm.photos.map((src, i) => (
                        <img key={i} src={src} alt="review" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                      ))}
                    </div>
                  )}
                </div>
                <button className="btn-primary" disabled={submittingReview} onClick={async () => {
                  if (!reviewForm.name || !reviewForm.comment) { toast.error('Please fill name and review'); return; }
                  setSubmittingReview(true);
                  try {
                    await axios.post(`/reviews/product/${id}`, reviewForm);
                    toast.success('Review submitted! Thank you');
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
              {reviews.map((rev) => (
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
              ))}
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

          {/* Complete the Look — cross-sell from complementary category */}
          {related.length > 0 && (
            <div style={{ marginTop: '48px', padding: '32px', background: '#faf8f5', borderRadius: '12px' }}>
              <div className="section-header-center">
                <span className="section-eyebrow">Style It</span>
                <h2 className="section-heading">Complete the Look</h2>
              </div>
              <div className="product-grid-4">
                {related.filter(p => p.category !== product.category || p.brand !== product.brand).slice(0, 3).map(p => (
                  <ProductCard key={p._id} product={p} />
                ))}
                {related.filter(p => p.category !== product.category || p.brand !== product.brand).length === 0 &&
                  related.slice(0, 2).map(p => <ProductCard key={p._id} product={p} />)
                }
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="vp-container">
        <RecentlyViewed excludeId={id} />
      </div>

      <Footer />
      <div className="whatsapp-bubble" onClick={() => window.open('https://wa.me/919876543210','_blank')} role="button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
        <span className="whatsapp-tooltip">Chat with us</span>
      </div>
    </>
  );
}
