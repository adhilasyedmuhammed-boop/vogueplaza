import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

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

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('vp_token');
    localStorage.removeItem('vp_user');
    window.location.href = '/admin-login';
  };

  const user = JSON.parse(localStorage.getItem('vp_user') || '{}');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f0' }}>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 240 : (isMobile ? 0 : 60),
          background: '#1a1a1a',
          color: '#fff',
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 100,
          transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 10 }}>
          {sidebarOpen && <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>VOGUE PLAZA</span>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18, marginLeft: 'auto' }}
          >
            {sidebarOpen ? '✕' : '▶'}
          </button>
        </div>
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 20px',
                  color: active ? '#c9a96e' : '#ccc',
                  textDecoration: 'none',
                  background: active ? '#2a2a2a' : 'transparent',
                  borderLeft: active ? '3px solid #c9a96e' : '3px solid transparent',
                  fontSize: 14,
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid #333' }}>
          {sidebarOpen && (
            <div style={{ marginBottom: 8, fontSize: 12, color: '#999' }}>
              {user.name || 'Admin'} • {user.role}
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px',
              background: '#c9a96e',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: isMobile ? 0 : (sidebarOpen ? 240 : 60),
        transition: 'margin-left 0.3s',
        padding: isMobile ? '16px' : '24px 32px',
        minWidth: 0,
      }}>
        {/* Mobile top bar */}
        {isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
            padding: '12px 16px',
            background: '#1a1a1a',
            borderRadius: 8,
            color: '#fff',
          }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}
            >
              ☰
            </button>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>VOGUE PLAZA</span>
            <span style={{ fontSize: 12, color: '#c9a96e' }}>Admin</span>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
