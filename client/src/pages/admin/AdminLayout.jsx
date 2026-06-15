import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ConfirmProvider } from '../../components/ConfirmModal';
import '../../styles/admin.css';

const MenuIcon = ({ name, active, size = 20 }) => {
  const color = active ? '#c9a96e' : 'currentColor';
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    dashboard: <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="11" width="7" height="10" rx="1"/></svg>,
    homepage: <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    products: <svg {...props}><path d="M20.38 3.46L16.17 2 8 5.5 2.62 3.46a1 1 0 0 0-1.34.58l-.12.36L7 7.5v9l-5.84-3.07.12.36a1 1 0 0 0 1.34.58L8 12.5l8.17 3.5 5.21-2.04a1 1 0 0 0 .58-1.34z" stroke="none"/><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    categories: <svg {...props}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    brands: <svg {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    banners: <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    enquiries: <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    reviews: <svg {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={active ? '#c9a96e' : 'none'}/></svg>,
    posts: <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="12" cy="12" r="3"/><path d="M16.5 7.5v.001"/></svg>,
    users: <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    store: <svg {...props}><path d="M3 3h18v4H3z"/><path d="M3 7v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/><path d="M7 7v4a2 2 0 0 0 4 0V7"/><path d="M13 7v4a2 2 0 0 0 4 0V7"/><rect x="9" y="15" width="6" height="6"/></svg>,
    logout: <svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  };
  return icons[name] || null;
};

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { path: '/admin/home-data', label: 'Home Page', icon: 'homepage' },
  { path: '/admin/products', label: 'Products', icon: 'products' },
  { path: '/admin/categories', label: 'Categories', icon: 'categories' },
  { path: '/admin/brands', label: 'Brands', icon: 'brands' },
  { path: '/admin/banners', label: 'Banners', icon: 'banners' },
  { path: '/admin/enquiries', label: 'Enquiries', icon: 'enquiries' },
  { path: '/admin/reviews', label: 'Reviews', icon: 'reviews' },
  { path: '/admin/posts', label: 'Posts', icon: 'posts' },
  { path: '/admin/users', label: 'Users', icon: 'users' },
  { path: '/admin/store', label: 'Store Info', icon: 'store' },
];

// Bottom nav shows 4 main items + More
const bottomNavItems = [
  { path: '/admin', label: 'Home', icon: 'home' },
  { path: '/admin/products', label: 'Products', icon: 'products' },
  { path: '/admin/enquiries', label: 'Enquiries', icon: 'enquiries' },
  { path: '/admin/orders', label: 'Orders', icon: 'orders' },
];

const BottomNavIcon = ({ name, active }) => {
  const color = active ? '#c9a96e' : '#888';
  const icons = {
    home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    products: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    enquiries: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    orders: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    more: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  };
  return icons[name] || null;
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close overlays on route change
  useEffect(() => {
    setSidebarOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('vp_token');
    localStorage.removeItem('vp_user');
    window.location.href = '/admin-login';
  };

  const user = JSON.parse(localStorage.getItem('vp_user') || '{}');
  const isBottomNavActive = (path) => location.pathname === path;
  const isMoreActive = !bottomNavItems.some(item => item.path === location.pathname);

  return (
    <div className="admin-wrapper">
      {/* Mobile Top Bar */}
      <div className="admin-topbar">
        <button className="admin-topbar-menu" onClick={() => setSidebarOpen(true)} aria-label="Menu">
          <span /><span /><span />
        </button>
        <span className="admin-topbar-brand">VOGUE PLAZA</span>
        <button className="admin-topbar-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Desktop Sidebar Overlay (mobile) */}
      {isMobile && sidebarOpen && (
        <div className="admin-overlay open" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-header">
          <span className="admin-sidebar-logo">VOGUE PLAZA</span>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18, marginLeft: 'auto' }}>✕</button>
          )}
        </div>
        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className={`admin-nav-item${location.pathname === item.path ? ' active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <span className="admin-nav-icon"><MenuIcon name={item.icon} active={location.pathname === item.path} /></span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">{user.name || 'Admin'} • {user.role}</div>
          <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <ConfirmProvider>
          <Outlet />
        </ConfirmProvider>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="admin-bottom-nav">
        <div className="admin-bottom-nav-inner">
          {bottomNavItems.map(item => (
            <Link key={item.path} to={item.path} className={`admin-bottom-nav-item${isBottomNavActive(item.path) ? ' active' : ''}`}>
              <span className="admin-bottom-nav-icon">
                <BottomNavIcon name={item.icon} active={isBottomNavActive(item.path)} />
              </span>
              <span className="admin-bottom-nav-label">{item.label}</span>
            </Link>
          ))}
          <button onClick={() => setMoreOpen(true)} className={`admin-bottom-nav-item${isMoreActive ? ' active' : ''}`} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <span className="admin-bottom-nav-icon">
              <BottomNavIcon name="more" active={isMoreActive} />
            </span>
            <span className="admin-bottom-nav-label">More</span>
          </button>
        </div>
      </nav>

      {/* More Bottom Sheet */}
      <div className={`admin-overlay${moreOpen ? ' open' : ''}`} onClick={() => setMoreOpen(false)} />
      <div className={`admin-more-sheet${moreOpen ? ' open' : ''}`}>
        <div className="admin-more-sheet-handle" />
        <div className="admin-more-sheet-grid">
          {menuItems.filter(m => !bottomNavItems.some(b => b.path === m.path)).map(item => (
            <Link key={item.path} to={item.path} className={`admin-more-sheet-item${location.pathname === item.path ? ' active' : ''}`} onClick={() => setMoreOpen(false)}>
              <span className="admin-more-sheet-item-icon"><MenuIcon name={item.icon} active={location.pathname === item.path} size={22} /></span>
              <span className="admin-more-sheet-item-label">{item.label}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="admin-more-sheet-item" style={{ border: 'none', cursor: 'pointer' }}>
            <span className="admin-more-sheet-item-icon"><MenuIcon name="logout" size={22} /></span>
            <span className="admin-more-sheet-item-label">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
