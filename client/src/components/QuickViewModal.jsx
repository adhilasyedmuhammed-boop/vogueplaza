import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';

export default function QuickViewModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState('');
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!product) return null;

  const wished = isInWishlist(product._id);

  const handleAdd = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      toast.warning('Please select a size');
      return;
    }
    addToCart({ ...product, size: selectedSize || 'One Size' });
    toast.success('Added to bag!');
    onClose();
  };

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="quickview-modal" onClick={e => e.stopPropagation()}>
        <button className="quickview-close" onClick={onClose}>✕</button>

        <div className="quickview-body">
          <div className="quickview-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="quickview-info">
            <div className="quickview-brand">{product.brand}</div>
            <h2 className="quickview-name">{product.name}</h2>

            <div className="quickview-price">
              <span className="price-current">₹{product.price?.toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <>
                  <span className="price-mrp">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                  {product.discount > 0 && <span className="price-off">{product.discount}% OFF</span>}
                </>
              )}
            </div>

            {product.rating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '8px 0' }}>
                <span style={{ color: '#c9a96e', fontSize: '13px' }}>★ {product.rating?.toFixed(1)}</span>
                <span style={{ fontSize: '12px', color: '#888' }}>({product.reviewCount || 0} reviews)</span>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="quickview-sizes">
                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Select Size</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      className={`size-btn${selectedSize === s ? ' selected' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn-add-cart" style={{ flex: 1, height: '44px', fontSize: '12px' }} onClick={handleAdd}>
                Add to Cart
              </button>
              <button
                className={`btn-wishlist${wished ? ' active' : ''}`}
                style={{ flex: 0, width: '44px', height: '44px', padding: 0, fontSize: '18px' }}
                onClick={() => toggleWishlist(product)}
              >
                {wished ? '♥' : '♡'}
              </button>
            </div>

            <Link to={`/product/${product._id}`} className="quickview-full-link" onClick={onClose}>
              View Full Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
