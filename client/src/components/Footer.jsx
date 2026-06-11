import { Link } from 'react-router-dom';

const quickLinks = ['New Arrivals', 'Women', 'Men', 'Kids', 'Home Décor', 'Brands', 'Sale'];
const helpLinks = ['Track Order', 'Returns & Exchanges', 'Size Guide', 'Contact Us', 'Store Locator', 'FAQs'];
const policyLinks = ['Privacy Policy', 'Terms & Conditions', 'Shipping Policy', 'Cookie Policy'];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-v2">
      <div className="footer-grid-4">
        {/* Brand Col */}
        <div>
          <div className="footer-brand-logo">VOGUE PLAZA</div>
          <p className="footer-brand-desc">
            India's premium destination for luxury fashion. Curating world-class brands across womenswear, menswear, kids, and lifestyle since 1991.
          </p>
          <div className="footer-socials">
            <a href="https://instagram.com/vogueplaza" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Instagram">IG</a>
            <a href="https://facebook.com/vogueplaza" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Facebook">FB</a>
            <a href="https://twitter.com/vogueplaza" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Twitter">TW</a>
            <a href="https://pinterest.com/vogueplaza" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Pinterest">PT</a>
            <a href="https://youtube.com/vogueplaza" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="YouTube">YT</a>
          </div>
          <div className="footer-social-handles" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', fontFamily: 'Inter, sans-serif', opacity: 0.85 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#B8914E' }}>●</span>
              <span>Instagram: <a href="https://instagram.com/vogueplaza" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>@vogueplaza</a></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#B8914E' }}>●</span>
              <span>Facebook: <a href="https://facebook.com/vogueplaza" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Vogue Plaza</a></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#B8914E' }}>●</span>
              <span>Twitter: <a href="https://twitter.com/vogueplaza" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>@vogueplaza</a></span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div className="footer-col-title">Shop</div>
          <div className="footer-links-list">
            {quickLinks.map(link => (
              <Link
                key={link}
                to={link === 'New Arrivals' ? '/new-arrivals' : link === 'Brands' ? '/brands' : `/products?category=${link.toLowerCase().replace(' ', '')}`}
                className="footer-link-v2"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>

        {/* Help */}
        <div>
          <div className="footer-col-title">Customer Care</div>
          <div className="footer-links-list">
            {helpLinks.map(link => (
              <span key={link} className="footer-link-v2" style={{ cursor: 'pointer' }}>{link}</span>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <div className="footer-col-title">Stay Connected</div>
          <p className="footer-newsletter-text">
            Subscribe to our newsletter for exclusive offers, new arrivals, and style inspiration delivered to your inbox.
          </p>
          <div className="footer-newsletter-form">
            <input
              type="email"
              placeholder="Your email address"
              className="footer-email-input"
            />
            <button className="footer-email-btn">Join</button>
          </div>
          <div style={{ marginTop: '24px' }}>
            <div className="footer-col-title" style={{ marginBottom: '12px' }}>Download App</div>
            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', cursor: 'pointer' }}>
                <span style={{ fontSize: '20px' }}>📱</span>
                <div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Download on the</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>App Store</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', cursor: 'pointer' }}>
                <span style={{ fontSize: '20px' }}>🤖</span>
                <div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Get it on</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom-bar">
        <p className="footer-copy">© {year} Vogue Plaza Pvt. Ltd. All rights reserved.</p>
        <div className="footer-legal-links">
          {policyLinks.map(link => (
            <span key={link} className="footer-legal-link" style={{ cursor: 'pointer' }}>{link}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
