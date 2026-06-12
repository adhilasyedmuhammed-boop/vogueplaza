import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const fallbackBrands = [
  { slug: 'armani', name: 'Armani', initials: 'AR' },
  { slug: 'gucci', name: 'Gucci', initials: 'GU' },
  { slug: 'versace', name: 'Versace', initials: 'VE' },
  { slug: 'burberry', name: 'Burberry', initials: 'BU' },
  { slug: 'prada', name: 'Prada', initials: 'PR' },
  { slug: 'chanel', name: 'Chanel', initials: 'CH' },
  { slug: 'dior', name: 'Dior', initials: 'DI' },
  { slug: 'rolex', name: 'Rolex', initials: 'RO' },
];

export default function BrandScroller() {
  const scrollRef = useRef(null);
  const [brands, setBrands] = useState(fallbackBrands);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get('/brands');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setBrands(res.data);
        }
      } catch {}
    };
    fetchBrands();
  }, []);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 260, behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const track = scrollRef.current;
      if (!track) return;
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: 260, behavior: 'smooth' });
      }
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="tc-brands-section">
      <div className="vp-container">
        <div className="tc-slider-header">
          <div>
            <span className="section-eyebrow">Premium Labels</span>
            <h2 className="tc-section-title">Shop by Brand</h2>
          </div>
          <Link to="/brands" className="view-all-link">All Brands →</Link>
        </div>

        <div className="tc-brands-viewport">
          <button className="tc-slider-arrow left" onClick={() => scroll(-1)} aria-label="Scroll left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div className="tc-brands-track" ref={scrollRef}>
            {brands.map((brand) => (
              <Link key={brand.slug} to={`/products?brand=${brand.slug}`} className="tc-brand-item">
                <div className="tc-brand-circle">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                  ) : (
                    <span className="tc-brand-initial">{brand.initials}</span>
                  )}
                </div>
                <span className="tc-brand-name">{brand.name}</span>
              </Link>
            ))}
          </div>

          <button className="tc-slider-arrow right" onClick={() => scroll(1)} aria-label="Scroll right">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
