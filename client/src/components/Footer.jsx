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
            India's premier destination for luxury fashion. Curating world-class brands across womenswear, menswear, kids, and lifestyle since 1991.
          </p>
          <div className="footer-socials">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
            </a>
            <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Pinterest">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.992 3.995-.282 1.193.599 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.118.112.222.084.345-.091.375-.293 1.199-.334 1.363-.053.225-.174.271-.402.163-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            </a>
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
            <Link to="/products" className="footer-link-v2">Track Order</Link>
            <Link to="/products" className="footer-link-v2">Returns & Exchanges</Link>
            <Link to="/products" className="footer-link-v2">Size Guide</Link>
            <Link to="/" className="footer-link-v2">Contact Us</Link>
            <Link to="/" className="footer-link-v2">Store Locator</Link>
            <Link to="/" className="footer-link-v2">FAQs</Link>
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                <div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Download on the</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>App Store</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
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
