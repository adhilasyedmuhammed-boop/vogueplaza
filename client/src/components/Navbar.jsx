import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import AnnouncementBar from './AnnouncementBar';

/* ── nav data ──────────────────────────────────────────────── */
const NAV = [
  {
    label: 'New Arrivals', link: '/new-arrivals',
    cols: [
      { title: 'New In', links: ['All New Arrivals', "This Week's Picks", "Editor's Choice", 'Trending Now'] },
      { title: "Women's New", links: ['Dresses', 'Tops & Blouses', 'Trousers', 'Outerwear'] },
      { title: "Men's New",   links: ['Suits', 'Shirts', 'Trousers', 'Jackets'] },
      { title: 'Accessories', links: ['Bags', 'Shoes', 'Watches', 'Jewellery'] },
    ],
  },
  {
    label: 'Women', link: '/products?category=womenswear',
    cols: [
      { title: 'Clothing',    links: ['Dresses', 'Tops & Blouses', 'Skirts', 'Trousers', 'Knitwear', 'Outerwear'] },
      { title: 'Accessories', links: ['Handbags', 'Shoes & Heels', 'Jewellery', 'Sunglasses', 'Scarves'] },
      { title: 'Brands',      links: ['Gucci', 'Prada', 'Burberry', 'Chanel', 'Versace', 'Armani'] },
      { title: 'Collections', links: ['Summer Edit', 'Resort Wear', 'Occasionwear', 'Workwear'] },
    ],
  },
  {
    label: 'Men', link: '/products?category=menswear',
    cols: [
      { title: 'Clothing',    links: ['Suits & Blazers', 'Shirts', 'T-Shirts', 'Trousers', 'Knitwear', 'Outerwear'] },
      { title: 'Accessories', links: ['Shoes & Boots', 'Bags & Wallets', 'Belts', 'Watches', 'Ties'] },
      { title: 'Brands',      links: ['Hugo Boss', 'Tommy Hilfiger', 'Calvin Klein', 'Ralph Lauren', 'Armani'] },
      { title: 'Collections', links: ['Business Wear', 'Smart Casual', 'Weekend Edit', 'Formal'] },
    ],
  },
  {
    label: 'Kids', link: '/products?category=kids',
    cols: [
      { title: 'Girls', links: ['Dresses', 'Tops', 'Bottoms', 'Outerwear'] },
      { title: 'Boys',  links: ['Shirts', 'Trousers', 'Jackets', 'Sportswear'] },
    ],
  },
  { label: 'Brands', link: '/brands' },
  { label: 'Sale',   link: '/products?sale=true', isSale: true },
];

/* ─────────────────────────────────────────────────────────── */
export default function Navbar() {
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [drawerSub,   setDrawerSub]   = useState(null);
  const [scrolled,    setScrolled]    = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const { cartItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const cartCount = cartItems?.reduce((s, i) => s + (i.quantity || 1), 0) || 0;

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('vp_user');
    return stored ? JSON.parse(stored) : null;
  });

  // Re-sync user state when localStorage changes (e.g. after login on another component)
  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem('vp_user');
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener('storage', syncUser);
    window.addEventListener('focus', syncUser);
    // Listen for custom event from same-tab login
    window.addEventListener('vp-auth-change', syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('focus', syncUser);
      window.removeEventListener('vp-auth-change', syncUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('vp_token');
    localStorage.removeItem('vp_user');
    setUser(null);
    navigate('/');
  };

  /* close user menu on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* sticky shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* focus search input when overlay opens */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 80);
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  /* ── render ─────────────────────────────────────────────── */
  return (
    <>
      <AnnouncementBar />

      <header className={`tc-header${scrolled ? ' scrolled' : ''}`}>
        {/* ── MAIN BAR ─────────────────────────────────────── */}
        <div className="tc-header-bar">
          {/* Left: store + phone */}
          <div className="tc-header-left">
            <button className="hamburger-tc" onClick={() => setDrawerOpen(true)} aria-label="Menu">
              <span /><span /><span />
            </button>
            <Link to="/" className="tc-util-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Stores
            </Link>
            <span className="tc-util-divider"/>
            <a href="tel:+918001234567" className="tc-util-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.5 2 2 0 0 1 3.6 2.32h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.77-1.77a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              1800-123-4567
            </a>
          </div>

          {/* Centre: logo */}
          <Link to="/" className="tc-logo">VOGUE PLAZA</Link>

          {/* Right: icons */}
          <div className="tc-header-right">
            <button className="tc-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>

            {user ? (
              <div className="tc-user-menu" ref={userMenuRef}>
                <button className="tc-icon-btn tc-login-text" onClick={() => setUserMenuOpen(!userMenuOpen)} aria-label="Account">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>{user.name?.split(' ')[0] || 'Account'}</span>
                </button>
                {userMenuOpen && (
                  <div className="tc-user-dropdown">
                    <div className="tc-user-dropdown-header">
                      <div className="tc-user-avatar">{(user.name || 'U').charAt(0).toUpperCase()}</div>
                      <div className="tc-user-info">
                        <div className="tc-user-name">{user.name || 'User'}</div>
                        <div className="tc-user-email">{user.email || ''}</div>
                      </div>
                    </div>
                    <div className="tc-user-dropdown-divider" />
                    <Link to="/wishlist" className="tc-user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      My Wishlist
                    </Link>
                    <Link to="/cart" className="tc-user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                      My Cart
                    </Link>
                    <div className="tc-user-dropdown-divider" />
                    <button className="tc-user-dropdown-item tc-logout-btn" onClick={() => { handleLogout(); setUserMenuOpen(false); }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="tc-icon-btn tc-login-text" aria-label="Login">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Login</span>
              </Link>
            )}

            <Link to="/wishlist" className="tc-icon-btn" aria-label="Wishlist" style={{ position: 'relative' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {wishlistCount > 0 && <span className="tc-badge-count">{wishlistCount}</span>}
            </Link>

            <Link to="/cart" className="tc-icon-btn" aria-label="Cart" style={{ position: 'relative' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {cartCount > 0 && <span className="tc-badge-count">{cartCount}</span>}
            </Link>
          </div>
        </div>

        {/* ── MEGA MENU BAR ────────────────────────────────── */}
        <nav className="tc-nav-bar">
          <div className="tc-nav-inner">
            {NAV.map((item) => (
              <div key={item.label} className="tc-nav-item">
                <Link
                  to={item.link}
                  className={`tc-nav-link${item.isSale ? ' sale' : ''}`}
                >
                  {item.label}
                </Link>

                {item.cols && (
                  <div className="tc-mega-drop">
                    <div className="tc-mega-grid" style={{ gridTemplateColumns: `repeat(${item.cols.length}, 1fr)` }}>
                      {item.cols.map((col) => (
                        <div key={col.title}>
                          <div className="tc-mega-col-title">{col.title}</div>
                          {col.links.map((lnk) => (
                            <Link key={lnk} to={`/products?search=${encodeURIComponent(lnk)}`} className="tc-mega-link">
                              {lnk}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </header>

      {/* ── SEARCH OVERLAY ──────────────────────────────────── */}
      {searchOpen && (
        <div className="tc-search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="tc-search-box" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="tc-search-form">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for products, brands…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="tc-search-input"
              />
              <button type="submit" className="tc-search-submit">Search</button>
              <button type="button" className="tc-search-close" onClick={() => setSearchOpen(false)}>✕</button>
            </form>
            <div className="tc-search-hints">
              <span className="tc-search-hint-label">Popular:</span>
              {['Dresses', 'Suits', 'Handbags', 'Sneakers', 'Watches'].map((h) => (
                <button key={h} className="tc-search-hint" onClick={() => { navigate(`/products?search=${h}`); setSearchOpen(false); setSearchQuery(''); }}>
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE DRAWER ───────────────────────────────────── */}
      <div className={`tc-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="tc-drawer-overlay" onClick={() => { setDrawerOpen(false); setDrawerSub(null); }} />
        <div className="tc-drawer-panel">
          <div className="tc-drawer-head">
            <Link to="/" className="tc-drawer-logo" onClick={() => setDrawerOpen(false)}>VOGUE PLAZA</Link>
            <button className="tc-drawer-close" onClick={() => { setDrawerOpen(false); setDrawerSub(null); }}>✕</button>
          </div>

          {/* Auth row */}
          <div className="tc-drawer-auth">
            {user ? (
              <>
                <div className="tc-drawer-user-info">
                  <div className="tc-user-avatar">{(user.name || 'U').charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{user.name || 'User'}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{user.email || ''}</div>
                  </div>
                </div>
                <button className="tc-drawer-auth-btn" onClick={() => { handleLogout(); setDrawerOpen(false); }}>Sign Out</button>
              </>
            ) : (
              <Link to="/login" className="tc-drawer-auth-btn" onClick={() => setDrawerOpen(false)}>Log In / Register</Link>
            )}
          </div>

          <nav className="tc-drawer-nav">
            {NAV.map((item) => (
              <div key={item.label}>
                <div
                  className={`tc-drawer-row${item.isSale ? ' sale' : ''}`}
                  onClick={() => {
                    if (!item.cols) { navigate(item.link); setDrawerOpen(false); }
                    else setDrawerSub(drawerSub === item.label ? null : item.label);
                  }}
                >
                  <span>{item.label}</span>
                  {item.cols && <span className="tc-drawer-chevron">{drawerSub === item.label ? '−' : '+'}</span>}
                </div>
                {item.cols && drawerSub === item.label && (
                  <div className="tc-drawer-sub">
                    {item.cols.flatMap(c => c.links).slice(0, 8).map((lnk) => (
                      <Link key={lnk} to={`/products?search=${encodeURIComponent(lnk)}`} className="tc-drawer-sub-link" onClick={() => setDrawerOpen(false)}>
                        {lnk}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="tc-drawer-bottom">
            <Link to="/wishlist" className="tc-drawer-bottom-link" onClick={() => setDrawerOpen(false)}>Wishlist ({wishlistCount})</Link>
            <Link to="/" className="tc-drawer-bottom-link" onClick={() => setDrawerOpen(false)}>Find a Store</Link>
            <a href="tel:+918001234567" className="tc-drawer-bottom-link">1800-123-4567</a>
          </div>
        </div>
      </div>
    </>
  );
}
