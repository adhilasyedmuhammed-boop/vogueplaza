import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function ProductCard({ product, badge }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wished = isInWishlist(product._id);
  const [showSecondary, setShowSecondary] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const altImg = product.image2 || product.hoverImage || getAltImage(product.image);

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
    toast.success('Added to cart 🛍️');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleTouch = () => {
    setShowSecondary(prev => !prev);
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouch}
    >
      <div className="product-card-image-wrap">
        <img
          src={isHovered ? altImg : (showSecondary ? altImg : product.image)}
          alt={product.name}
          loading="lazy"
          className="product-card-img"
        />

        {badge && <span className={`product-card-badge ${badge}`}>{badge === 'new' ? 'New' : badge === 'sale' ? 'Sale' : badge}</span>}

        <button
          className={`product-wishlist-btn${wished ? ' active' : ''}`}
          onClick={handleWishlist}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wished ? '♥' : '♡'}
        </button>

        <button className="product-card-quick-add" onClick={handleQuickAdd}>
          Quick Add
        </button>
      </div>

      <div className="product-card-info">
        <div className="product-card-brand">{product.brand}</div>
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-price">
          <span>₹{product.price?.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="price-original">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function getAltImage(primaryUrl) {
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
  let hash = 0;
  for (let i = 0; i < (primaryUrl?.length || 0); i++) hash = (hash + primaryUrl.charCodeAt(i)) % alts.length;
  return alts[hash];
}
