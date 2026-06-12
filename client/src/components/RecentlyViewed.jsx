import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'vp_recently_viewed';
const MAX_ITEMS = 10;

// Utility to add a product to recently viewed (called from ProductDetail)
export function addToRecentlyViewed(product) {
  if (!product || !product._id) return;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = stored.filter(p => p._id !== product._id);
    filtered.unshift({
      _id: product._id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
  } catch { /* ignore */ }
}

export default function RecentlyViewed({ excludeId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setItems(excludeId ? stored.filter(p => p._id !== excludeId) : stored);
    } catch { /* ignore */ }
  }, [excludeId]);

  if (items.length === 0) return null;

  return (
    <section className="recently-viewed-section">
      <h2 className="section-title">Recently Viewed</h2>
      <div className="recently-viewed-scroll">
        {items.map(product => (
          <Link key={product._id} to={`/product/${product._id}`} className="rv-card">
            <div className="rv-card-img">
              <img src={product.image} alt={product.name} loading="lazy" />
            </div>
            <div className="rv-card-info">
              <span className="rv-card-brand">{product.brand}</span>
              <span className="rv-card-name">{product.name}</span>
              <span className="rv-card-price">₹{product.price?.toLocaleString('en-IN')}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
