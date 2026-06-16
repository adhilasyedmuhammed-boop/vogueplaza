import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';

/* ── reusable slider – pass any products array ───────────────── */
export default function ProductSlider({ title, eyebrow, products = [], viewAllLink = '/products', badge }) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const wrapRef  = useRef(null);

  const VISIBLE = 4;
  const max = Math.max(0, products.length - VISIBLE);

  const goTo = useCallback((n) => {
    const next = Math.max(0, Math.min(n, max));
    setIndex(next);
  }, [max]);

  /* ── translate the track ─────────────────────────────────────── */
  useEffect(() => {
    const track = trackRef.current;
    const wrap  = wrapRef.current;
    if (!track || !track.children[0]) return;
    const cardW = track.children[0].getBoundingClientRect().width;
    const gap   = 24;
    track.style.transform = `translateX(-${index * (cardW + gap)}px)`;
  }, [index, products]);

  /* ── autoplay loop timer ─────────────────────────────────────── */
  useEffect(() => {
    if (max <= 0) return;
    const timer = setInterval(() => {
      setIndex(prev => {
        if (prev >= max) return 0;
        return prev + 1;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, [max]);

  return (
    <section className="tc-slider-section">
      <div className="vp-container">
        <div className="tc-slider-header">
          <div>
            {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
            <h2 className="tc-slider-title">{title}</h2>
          </div>
          <Link to={viewAllLink} className="view-all-link">View All →</Link>
        </div>

        <div className="tc-slider-viewport" ref={wrapRef}>
          {/* Prev arrow */}
          <button
            className={`tc-slider-arrow left${index === 0 ? ' disabled' : ''}`}
            onClick={() => goTo(index - 1)}
            aria-label="Previous"
            disabled={index === 0}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div className="tc-slider-overflow">
            <div className="tc-slider-track" ref={trackRef}>
              {products.map((p) => (
                <SliderCard key={p._id} product={p} badge={badge} />
              ))}
            </div>
          </div>

          {/* Next arrow */}
          <button
            className={`tc-slider-arrow right${index >= max ? ' disabled' : ''}`}
            onClick={() => goTo(index + 1)}
            aria-label="Next"
            disabled={index >= max}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        {/* Pagination dots */}
        {products.length > VISIBLE && (
          <div className="tc-slider-dots">
            {Array.from({ length: max + 1 }).map((_, i) => (
              <button
                key={i}
                className={`tc-slider-dot${i === index ? ' active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── individual card inside slider ──────────────────────────── */
function SliderCard({ product, badge }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wished = isInWishlist(product._id);
  const [showSecondary, setShowSecondary] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setShowSecondary(prev => !prev);
    }, 1200 + Math.random() * 500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, size: product.sizes?.[0] || 'One Size' });
    toast.success('Item added to your bag');
  };

  const handleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleTouch = () => {
    setShowSecondary(prev => !prev);
  };

  // secondary hover image — only use product's own image2
  const hoverImg = product.image2 || product.image;

  return (
    <Link
      to={`/product/${product._id}`}
      className="tc-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouch}
    >
      <div className="tc-card-img-wrap">
        <img
          className="tc-img-primary"
          src={isHovered ? hoverImg : (showSecondary ? hoverImg : product.image)}
          alt={product.name}
          loading="lazy"
          style={{ opacity: 1 }}
        />

        {badge && <span className={`tc-badge${badge === 'sale' ? ' sale' : badge === 'new' ? ' new-in' : ''}`}>{badge === 'new' ? 'New In' : badge === 'sale' ? 'Sale' : badge}</span>}

        <button
          className={`tc-wish-btn${wished ? ' active' : ''}`}
          onClick={handleWish}
          aria-label="Wishlist"
        >
          {wished ? '♥' : '♡'}
        </button>

        <button className="tc-quick-view" onClick={handleQuickAdd}>
          Quick Add
        </button>
      </div>

      <div className="tc-card-info">
        <p className="tc-card-brand">{product.brand}</p>
        <p className="tc-card-name">{product.name}</p>
        <p className="tc-card-price">
          ₹{product.price?.toLocaleString('en-IN')}
          {product.originalPrice && (
            <span className="tc-card-original">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
          )}
        </p>
      </div>
    </Link>
  );
}

/* ── helper: generate a contrasting alt image from Unsplash ─── */
function getAltImage(primaryUrl) {
  // Rotate through a set of curated fashion images
  const alts = [
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1495385794356-15371f348c31?q=80&w=600&auto=format&fit=crop',
  ];
  // use a hash of the primary url to pick a stable alt
  let hash = 0;
  for (let i = 0; i < (primaryUrl?.length || 0); i++) hash = (hash + primaryUrl.charCodeAt(i)) % alts.length;
  return alts[hash];
}
