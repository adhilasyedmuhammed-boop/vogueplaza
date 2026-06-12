import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const tabs = [
  { path: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/products', label: 'Shop', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  { path: '/cart', label: 'Cart', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z' },
  { path: '/wishlist', label: 'Wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { path: '/login', label: 'Account', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();

  // Don't show on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  const cartCount = cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const wishCount = wishlist.length;

  return (
    <nav className="vp-bottom-nav">
      {tabs.map((tab) => {
        const isActive = tab.path === '/' ? location.pathname === '/' : location.pathname.startsWith(tab.path);
        const badge = tab.path === '/cart' ? cartCount : tab.path === '/wishlist' ? wishCount : 0;

        return (
          <button
            key={tab.path}
            className={`vp-bottom-tab${isActive ? ' active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="vp-bottom-icon-wrap">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d={tab.icon} />
              </svg>
              {badge > 0 && <span className="vp-bottom-badge">{badge}</span>}
            </span>
            <span className="vp-bottom-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
