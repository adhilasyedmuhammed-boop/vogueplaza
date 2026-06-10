import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const brands = [
  { slug: 'armani', name: 'Armani', initial: 'AR' },
  { slug: 'gucci', name: 'Gucci', initial: 'GU' },
  { slug: 'versace', name: 'Versace', initial: 'VS' },
  { slug: 'burberry', name: 'Burberry', initial: 'BB' },
  { slug: 'prada', name: 'Prada', initial: 'PR' },
  { slug: 'chanel', name: 'Chanel', initial: 'CH' },
  { slug: 'dior', name: 'Dior', initial: 'CD' },
  { slug: 'hugo-boss', name: 'Hugo Boss', initial: 'HB' },
  { slug: 'tommy', name: 'Tommy Hilfiger', initial: 'TH' },
  { slug: 'calvin', name: 'Calvin Klein', initial: 'CK' },
  { slug: 'ralph', name: 'Ralph Lauren', initial: 'RL' },
  { slug: 'michael-kors', name: 'Michael Kors', initial: 'MK' },
];

export default function BrandScroller() {
  const scrollRef = useRef(null);

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
                  <span className="tc-brand-initial">{brand.initial}</span>
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
