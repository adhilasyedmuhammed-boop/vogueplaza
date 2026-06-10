import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const brands = [
  { slug: 'armani', name: 'Giorgio Armani', initial: 'GA', desc: 'Italian luxury fashion house', count: 48 },
  { slug: 'gucci', name: 'Gucci', initial: 'GU', desc: 'Florentine luxury brand', count: 62 },
  { slug: 'versace', name: 'Versace', initial: 'VS', desc: 'Italian fashion house', count: 35 },
  { slug: 'burberry', name: 'Burberry', initial: 'BB', desc: 'British luxury fashion', count: 54 },
  { slug: 'prada', name: 'Prada', initial: 'PR', desc: 'Italian luxury fashion', count: 41 },
  { slug: 'rolex', name: 'Rolex', initial: 'RX', desc: 'Swiss luxury watches', count: 28 },
  { slug: 'chanel', name: 'Chanel', initial: 'CH', desc: 'French fashion house', count: 33 },
  { slug: 'dior', name: 'Christian Dior', initial: 'CD', desc: 'Parisian luxury house', count: 45 },
  { slug: 'hugo-boss', name: 'Hugo Boss', initial: 'HB', desc: 'German luxury fashion', count: 72 },
  { slug: 'tommy', name: 'Tommy Hilfiger', initial: 'TH', desc: 'American fashion brand', count: 88 },
  { slug: 'calvin', name: 'Calvin Klein', initial: 'CK', desc: 'American fashion house', count: 65 },
  { slug: 'ralph', name: 'Ralph Lauren', initial: 'RL', desc: 'American luxury brand', count: 79 },
  { slug: 'mcm', name: 'MCM', initial: 'MC', desc: 'German luxury goods', count: 22 },
  { slug: 'coach', name: 'Coach', initial: 'CO', desc: 'American luxury house', count: 37 },
  { slug: 'michael-kors', name: 'Michael Kors', initial: 'MK', desc: 'American luxury fashion', count: 58 },
  { slug: 'longchamp', name: 'Longchamp', initial: 'LC', desc: 'French luxury goods', count: 19 },
  { slug: 'salvatore', name: 'Salvatore Ferragamo', initial: 'SF', desc: 'Italian luxury brand', count: 31 },
  { slug: 'ted-baker', name: 'Ted Baker', initial: 'TB', desc: 'British fashion brand', count: 44 },
];

export default function Brands() {
  const navigate = useNavigate();

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
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '10px', lineHeight: 1 }}>{brand.initial}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', color: '#111', marginBottom: '4px' }}>{brand.name}</div>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '10px' }}>{brand.desc}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: '#B8914E', textTransform: 'uppercase' }}>{brand.count} Products</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
