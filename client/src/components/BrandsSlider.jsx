import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';

const fallbackBrands = [
  { name: 'Armani', slug: 'armani', initials: 'AR' },
  { name: 'Gucci', slug: 'gucci', initials: 'GU' },
  { name: 'Versace', slug: 'versace', initials: 'VE' },
  { name: 'Burberry', slug: 'burberry', initials: 'BU' },
  { name: 'Prada', slug: 'prada', initials: 'PR' },
  { name: 'Rolex', slug: 'rolex', initials: 'RO' },
  { name: 'Chanel', slug: 'chanel', initials: 'CH' },
  { name: 'Dior', slug: 'dior', initials: 'DI' },
];

export default function BrandsSlider() {
  const [brands, setBrands] = useState(fallbackBrands);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get('/brands');
        if (Array.isArray(response.data) && response.data.length > 0) {
          setBrands(response.data);
        }
      } catch (error) {
        setBrands(fallbackBrands);
      }
    };
    fetchBrands();
  }, []);

  const scrollBy = (distance) => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  return (
    <section id="brands">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">CURATED BRANDS</h2>
        </div>
        <div className="brands-slider-container">
          <button type="button" className="brand-arrow brand-arrow-left" onClick={() => scrollBy(-300)}>
            ◀
          </button>
          <div className="brands-wrapper" ref={wrapperRef}>
            {brands.map((brand) => (
              <a key={brand.slug} href={`brand.html?slug=${brand.slug}`} className="brand-card">
                <div className="brand-logo-placeholder">{brand.initials}</div>
                <span className="brand-name">{brand.name}</span>
              </a>
            ))}
          </div>
          <button type="button" className="brand-arrow brand-arrow-right" onClick={() => scrollBy(300)}>
            ▶
          </button>
        </div>
      </div>
    </section>
  );
}
