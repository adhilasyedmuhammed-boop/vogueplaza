import { Link } from 'react-router-dom';

const PROMO_DEALS = [
  {
    id: 1,
    title: 'FLASH DEAL',
    subtitle: 'Flat ₹300 Off',
    description: 'On orders above ₹1,999',
    code: 'FLASH300',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A24 100%)',
    link: '/products?sale=true',
    icon: '⚡',
  },
  {
    id: 2,
    title: 'CELEBRITY STYLES',
    subtitle: 'Up to 40% Off',
    description: 'Designer wear collection',
    code: null,
    gradient: 'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)',
    link: '/products?category=womenswear',
    icon: '✨',
  },
  {
    id: 3,
    title: 'BEST SELLERS',
    subtitle: '50% Off',
    description: 'Top picks this season',
    code: null,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    link: '/products?sort=trending',
    icon: '🔥',
  },
  {
    id: 4,
    title: 'NEW SEASON SALE',
    subtitle: 'Up to 60% Off',
    description: 'Premium brands on sale',
    code: 'SEASON60',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    link: '/products?sale=true',
    icon: '🏷️',
  },
];

export default function PromoBanners() {
  return (
    <section style={{ padding: '48px 0', background: '#FAF8F5' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#C5A880',
            display: 'block',
            marginBottom: '8px',
            fontFamily: "'Inter', sans-serif",
          }}>Limited Time</span>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '28px',
            fontWeight: 700,
            color: '#111',
            margin: 0,
          }}>Exclusive Offers</h2>
        </div>

        {/* Promo Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {PROMO_DEALS.map((deal) => (
            <Link
              key={deal.id}
              to={deal.link}
              style={{
                textDecoration: 'none',
                borderRadius: '12px',
                background: deal.gradient,
                padding: '28px 24px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '180px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Background Icon */}
              <span style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                fontSize: '80px',
                opacity: 0.15,
                pointerEvents: 'none',
              }}>{deal.icon}</span>

              <div>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.25)',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  marginBottom: '12px',
                  fontFamily: "'Inter', sans-serif",
                  backdropFilter: 'blur(4px)',
                }}>
                  {deal.icon} {deal.title}
                </div>

                <h3 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '26px',
                  fontWeight: 700,
                  color: '#fff',
                  margin: '0 0 6px 0',
                  lineHeight: 1.2,
                }}>{deal.subtitle}</h3>

                <p style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.9)',
                  margin: 0,
                  fontFamily: "'Inter', sans-serif",
                }}>{deal.description}</p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '16px',
              }}>
                {deal.code ? (
                  <span style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px dashed rgba(255,255,255,0.6)',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#fff',
                    fontFamily: "'Inter', sans-serif",
                  }}>Use: {deal.code}</span>
                ) : <span />}
                <span style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#fff',
                  fontFamily: "'Inter', sans-serif",
                }}>Shop Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
