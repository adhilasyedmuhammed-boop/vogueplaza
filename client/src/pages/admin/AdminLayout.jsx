import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ConfirmProvider } from '../../components/ConfirmModal';
import '../../styles/admin.css';

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/home-data', label: 'Home Page', icon: '🏠' },
  { path: '/admin/products', label: 'Products', icon: '👗' },
  { path: '/admin/categories', label: 'Categories', icon: '📂' },
  { path: '/admin/brands', label: 'Brands', icon: '🏷️' },
  { path: '/admin/banners', label: 'Banners', icon: '🖼️' },
  { path: '/admin/enquiries', label: 'Enquiries', icon: '💬' },
  { path: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  { path: '/admin/posts', label: 'Posts', icon: '📸' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/store', label: 'Store Info', icon: '🏪' },
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
              <span className="admin-nav-icon">{item.icon}</span>
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
              <span className="admin-more-sheet-item-icon">{item.icon}</span>
              <span className="admin-more-sheet-item-label">{item.label}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="admin-more-sheet-item" style={{ border: 'none', cursor: 'pointer' }}>
            <span className="admin-more-sheet-item-icon">🚪</span>
            <span className="admin-more-sheet-item-label">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
