import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function ProductCard({ product, badge, onQuickView }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wished = isInWishlist(product._id);
  const [isHovered, setIsHovered] = useState(false);

  const altImg = product.image2 || product.hoverImage || getAltImage(product.image);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, size: product.sizes?.[0] || 'One Size' });
    toast.success('Item added to your bag');
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-card-image-wrap">
        <img
          src={isHovered ? altImg : product.image}
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
        {onQuickView && (
          <button className="product-card-quick-view" onClick={handleQuickView}>
            Quick View
          </button>
        )}
      </div>

      <div className="product-card-info">
        <div className="product-card-brand">{product.brand}</div>
        <div className="product-card-name">{product.name}</div>
        {(product.rating > 0 || product.reviewCount > 0) && (
          <div className="product-card-rating">
            <span className="product-card-stars">★ {product.rating?.toFixed(1) || '4.5'}</span>
            <span className="product-card-review-count">({product.reviewCount || 0})</span>
          </div>
        )}
        <div className="product-card-price">
          {product.originalPrice ? (
            <>
              <span className="price-current">₹{product.price?.toLocaleString('en-IN')}</span>
              <span className="price-mrp">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
              {product.discount > 0 && <span className="price-off">{product.discount}%</span>}
            </>
          ) : (
            <span className="price-current">₹{product.price?.toLocaleString('en-IN')}</span>
          )}
        </div>
        {product.stockQty > 0 && product.stockQty <= 5 && (
          <div className="product-card-low-stock">Only {product.stockQty} left!</div>
        )}
        {product.inStock === false && (
          <div className="product-card-out-of-stock">Out of Stock</div>
        )}
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
