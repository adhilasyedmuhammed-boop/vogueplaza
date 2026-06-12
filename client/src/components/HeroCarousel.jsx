import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const fallbackSlides = [
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1800&auto=format&fit=crop',
    label: 'New Season',
    title: 'Summer\nCollection 2026',
    subtitle: 'Discover our curated edit of the finest luxury fashion from around the world.',
    cta: 'Explore Now',
    link: '/new-arrivals',
  },
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1800&auto=format&fit=crop',
    label: 'Women\'s Edit',
    title: 'Effortless\nElegance',
    subtitle: 'Premium womenswear crafted to perfection by the world\'s finest designers.',
    cta: 'Shop Women',
    link: '/products?category=womenswear',
  },
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1800&auto=format&fit=crop',
    label: 'Men\'s Collection',
    title: 'Modern\nMasculinity',
    subtitle: 'Sophisticated menswear for the discerning gentleman who demands excellence.',
    cta: 'Shop Men',
    link: '/products?category=menswear',
  },
];

export default function HeroCarousel() {
  const [slides, setSlides] = useState(fallbackSlides);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get('/banners');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setSlides(res.data);
        }
      } catch (err) {
        // fallback stays
      }
    };
    fetchBanners();
  }, []);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (!paused) {
      timerRef.current = setInterval(next, 5000);
    }
    return () => clearInterval(timerRef.current);
  }, [paused, next]);

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide, i) => (
          <div key={i} className="carousel-slide">
            <img src={slide.image} alt={slide.title} loading={i === 0 ? 'eager' : 'lazy'} />
            <div className="carousel-overlay">
              <span className="carousel-label">{slide.label}</span>
              <h1 className="carousel-title" style={{ whiteSpace: 'pre-line' }}>{slide.title}</h1>
              <p className="carousel-subtitle">{slide.subtitle}</p>
              <Link to={slide.link} className="carousel-cta">
                {slide.cta} <span>→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-arrow prev" onClick={prev} aria-label="Previous slide">‹</button>
      <button className="carousel-arrow next" onClick={next} aria-label="Next slide">›</button>

      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot${i === current ? ' active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
