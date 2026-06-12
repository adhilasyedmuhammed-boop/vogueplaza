import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ── Countdown Timer Hook ─────────────────────────────── */
function useCountdown(hours = 5) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('vp_flash_end');
    if (saved && Date.now() < Number(saved)) return Number(saved) - Date.now();
    const end = Date.now() + hours * 60 * 60 * 1000;
    localStorage.setItem('vp_flash_end', String(end));
    return end - Date.now();
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const saved = Number(localStorage.getItem('vp_flash_end') || 0);
      const diff = saved - Date.now();
      if (diff <= 0) {
        const newEnd = Date.now() + hours * 60 * 60 * 1000;
        localStorage.setItem('vp_flash_end', String(newEnd));
        setTimeLeft(newEnd - Date.now());
      } else {
        setTimeLeft(diff);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [hours]);

  const h = String(Math.floor(timeLeft / 3600000)).padStart(2, '0');
  const m = String(Math.floor((timeLeft % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, '0');
  return `${h}h ${m}m ${s}s`;
}

/* ── Brand Deal Cards ─────────────────────────────────── */
const BRAND_DEALS = [
  { brand: 'GUCCI', discount: 'UP TO 40%', gradient: 'linear-gradient(135deg, #FF512F 0%, #F09819 100%)', link: '/products?brand=gucci' },
  { brand: 'VERSACE', discount: 'UP TO 50%', gradient: 'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)', link: '/products?brand=versace' },
  { brand: 'ARMANI', discount: 'UP TO 35%', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', link: '/products?brand=armani' },
  { brand: 'PRADA', discount: 'UP TO 45%', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', link: '/products?brand=prada' },
];

/* ── Coupon Banners (scrollable strip) ────────────────── */
const COUPON_BANNERS = [
  { text: 'Extra 15% Off', sub: 'On 1st Order', code: 'NEW15', bg: 'linear-gradient(90deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)' },
  { text: 'Flat ₹500 Off', sub: 'Orders above ₹2,999', code: 'VP500', bg: 'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)' },
  { text: 'Buy 2 Get 1 Free', sub: 'On accessories', code: 'B2G1', bg: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #fde68a 100%)' },
];

export default function PromoBanners() {
  const countdown = useCountdown(5);
  const [couponIdx, setCouponIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCouponIdx(prev => (prev + 1) % COUPON_BANNERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const coupon = COUPON_BANNERS[couponIdx];

  return (
    <section style={{ background: '#FAF8F5' }}>

      {/* ── 1. FULL-WIDTH TOP BANNER — Flat ₹300 Off ─────── */}
      <Link to="/products?sale=true" style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #f43f5e 40%, #ec4899 100%)',
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -30, left: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ position: 'absolute', bottom: -20, right: 100, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

          <h3 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(22px, 4vw, 36px)',
            fontWeight: 800,
            color: '#fff',
            margin: 0,
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>FLAT ₹300 OFF</h3>

          <span style={{
            fontSize: 'clamp(14px, 2vw, 18px)',
            color: 'rgba(255,255,255,0.95)',
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
          }}>ON ORDERS ABOVE ₹2,000+</span>

          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#666', fontFamily: "'Inter', sans-serif", letterSpacing: '0.05em' }}>COUPON CODE</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#dc2626', fontFamily: "'Inter', sans-serif", letterSpacing: '0.05em' }}>GRABIT300</span>
          </div>
        </div>
      </Link>

      {/* ── 2. COUPON STRIP — Auto-scrolling ──────────────── */}
      <div style={{
        background: coupon.bg,
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        transition: 'background 0.5s ease',
        position: 'relative',
      }}>
        <button
          onClick={() => setCouponIdx((couponIdx - 1 + COUPON_BANNERS.length) % COUPON_BANNERS.length)}
          style={{ position: 'absolute', left: 16, background: 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#fff', fontWeight: 700 }}
        >‹</button>

        <span style={{ fontSize: '11px', fontWeight: 600, color: '#fff', opacity: 0.8, fontFamily: "'Inter', sans-serif" }}>%</span>
        <h4 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(18px, 3vw, 26px)',
          fontWeight: 700,
          color: '#fff',
          margin: 0,
        }}>{coupon.text}</h4>
        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontFamily: "'Inter', sans-serif" }}>{coupon.sub}</span>
        <div style={{
          background: '#c3f73a',
          borderRadius: '20px',
          padding: '6px 16px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#1a1a1a',
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '0.05em',
        }}>USE CODE <strong>{coupon.code}</strong></div>

        <button
          onClick={() => setCouponIdx((couponIdx + 1) % COUPON_BANNERS.length)}
          style={{ position: 'absolute', right: 16, background: 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#fff', fontWeight: 700 }}
        >›</button>
      </div>

      {/* ── 3. FLASH DEALS with Countdown ─────────────────── */}
      <div style={{ padding: '40px 24px 20px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '28px',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '32px' }}>🔥</span>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 800,
            fontStyle: 'italic',
            color: '#111',
            margin: 0,
          }}>Flash Deals</h2>
          <span style={{ fontSize: '32px' }}>🔥</span>
          <div style={{
            marginLeft: '20px',
            background: '#111',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '0.05em',
          }}>Ends In: <span style={{ color: '#f59e0b' }}>{countdown}</span></div>
        </div>

        {/* ── 4. BRAND DEAL CARDS ─────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}>
          {BRAND_DEALS.map((deal) => (
            <Link
              key={deal.brand}
              to={deal.link}
              style={{
                textDecoration: 'none',
                borderRadius: '16px',
                background: deal.gradient,
                padding: '32px 28px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '140px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <p style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.8)',
                  margin: '0 0 4px 0',
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '0.1em',
                }}>UP TO</p>
                <h3 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '48px',
                  fontWeight: 800,
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1,
                }}>{deal.discount.replace('UP TO ', '')}</h3>
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.9)',
                  margin: '4px 0 0 0',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                }}>OFF</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#fff',
                  margin: 0,
                  letterSpacing: '0.1em',
                }}>{deal.brand}</h4>
                <span style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.7)',
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
