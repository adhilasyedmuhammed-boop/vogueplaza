import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    id: 1,
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    eyebrow: 'EXCLUSIVE',
    title: 'Grand Fashion Sale',
    subtitle: 'Up to 70% Off on Premium Brands',
    cta: 'Shop Now',
    link: '/products?sale=true',
    accent: '#C5A880',
  },
  {
    id: 2,
    gradient: 'linear-gradient(135deg, #2d1b69 0%, #6b21a8 50%, #a855f7 100%)',
    eyebrow: 'NEW SEASON',
    title: 'Summer Collection 2026',
    subtitle: 'Discover curated luxury styles for the season',
    cta: 'Explore Now',
    link: '/new-arrivals',
    accent: '#fbbf24',
  },
  {
    id: 3,
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #ef4444 100%)',
    eyebrow: 'LIMITED TIME',
    title: 'Flat ₹500 Off',
    subtitle: 'On your first order • Use code WELCOME500',
    cta: 'Grab Deal',
    link: '/products',
    accent: '#fff',
  },
  {
    id: 4,
    gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)',
    eyebrow: 'BRANDS YOU LOVE',
    title: 'Gucci • Prada • Versace',
    subtitle: 'Authentic luxury at unbeatable prices',
    cta: 'Shop Brands',
    link: '/brands',
    accent: '#C5A880',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent(prev => (prev + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent(prev => (prev - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slide = SLIDES[current];

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Link to={slide.link} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          style={{
            background: slide.gradient,
            padding: 'clamp(40px, 8vw, 80px) 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'background 0.6s ease',
            minHeight: '280px',
          }}
        >
          {/* Decorative elements */}
          <div style={{ position: 'absolute', top: '10%', left: '5%', width: 120, height: 120, borderRadius: '50%', border: `2px solid ${slide.accent}33`, opacity: 0.4 }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '8%', width: 80, height: 80, borderRadius: '50%', background: `${slide.accent}15` }} />
          <div style={{ position: 'absolute', top: '50%', left: '2%', width: 40, height: 40, transform: 'rotate(45deg)', border: `1px solid ${slide.accent}44` }} />
          <div style={{ position: 'absolute', top: '20%', right: '3%', width: 24, height: 24, transform: 'rotate(45deg)', background: `${slide.accent}22` }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 700 }}>
            <span style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: slide.accent,
              marginBottom: '12px',
              fontFamily: "'Inter', sans-serif",
              background: `${slide.accent}20`,
              padding: '4px 14px',
              borderRadius: '20px',
            }}>{slide.eyebrow}</span>

            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(30px, 6vw, 52px)',
              fontWeight: 800,
              color: '#fff',
              margin: '0 0 12px 0',
              lineHeight: 1.1,
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}>{slide.title}</h2>

            <p style={{
              fontSize: 'clamp(14px, 2vw, 18px)',
              color: 'rgba(255,255,255,0.85)',
              margin: '0 0 24px 0',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
            }}>{slide.subtitle}</p>

            <span style={{
              display: 'inline-block',
              background: slide.accent,
              color: slide.accent === '#fff' ? '#111' : '#111',
              padding: '12px 32px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}>{slide.cta}</span>
          </div>
        </div>
      </Link>

      {/* Arrows */}
      <button
        onClick={(e) => { e.preventDefault(); prev(); }}
        style={{
          position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%',
          width: 44, height: 44, cursor: 'pointer', color: '#fff', fontSize: 20, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        aria-label="Previous"
      >‹</button>
      <button
        onClick={(e) => { e.preventDefault(); next(); }}
        style={{
          position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%',
          width: 44, height: 44, cursor: 'pointer', color: '#fff', fontSize: 20, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        aria-label="Next"
      >›</button>

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8,
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); setCurrent(i); }}
            style={{
              width: current === i ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: current === i ? '#fff' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
