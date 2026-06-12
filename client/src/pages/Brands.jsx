import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from '../api/axios';

const fallbackBrands = [
  { slug: 'armani', name: 'Giorgio Armani', initials: 'AR', logo: '' },
  { slug: 'gucci', name: 'Gucci', initials: 'GU', logo: '' },
  { slug: 'versace', name: 'Versace', initials: 'VE', logo: '' },
  { slug: 'burberry', name: 'Burberry', initials: 'BU', logo: '' },
  { slug: 'prada', name: 'Prada', initials: 'PR', logo: '' },
  { slug: 'rolex', name: 'Rolex', initials: 'RO', logo: '' },
  { slug: 'chanel', name: 'Chanel', initials: 'CH', logo: '' },
  { slug: 'dior', name: 'Dior', initials: 'DI', logo: '' },
];

export default function Brands() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState(fallbackBrands);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get('/brands');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setBrands(res.data);
        }
      } catch {}
    };
    fetchBrands();
  }, []);

  return (
    <>
      <Navbar />
      <div className="page-banner">
        <h1 className="page-banner-title">Our Brands</h1>
        <p className="page-banner-sub">{brands.length} premium labels curated for you</p>
      </div>

      <section className="vp-section">
        <div className="vp-container">
          <div className="section-header-center">
            <span className="section-eyebrow">World-Class Labels</span>
            <h2 className="section-heading">Curated Brand Portfolio</h2>
            <p className="section-subheading">Discover our handpicked selection of the world's finest fashion houses, each chosen for their exceptional craftsmanship and timeless style.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '40px' }}>
            {brands.map((brand) => (
              <div
                key={brand.slug}
                onClick={() => navigate(`/products?brand=${brand.slug}`)}
                style={{ padding: '28px 20px', border: '1px solid #E8E8E8', borderRadius: '4px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s ease', background: '#fff' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#000'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#E8E8E8'; }}
              >
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} style={{ height: '40px', objectFit: 'contain', marginBottom: '10px' }} />
                ) : (
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '10px', lineHeight: 1 }}>{brand.initials}</div>
                )}
                <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', color: '#111', marginBottom: '4px' }}>{brand.name}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: '#B8914E', textTransform: 'uppercase' }}>Shop Now →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
