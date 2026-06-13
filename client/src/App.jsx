import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';
import BottomNav from './components/BottomNav';
import BackToTop from './components/BackToTop';

// Lazy loaded pages for code splitting
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const LoginRegister = lazy(() => import('./pages/LoginRegister'));
const Brands = lazy(() => import('./pages/Brands'));
const NewArrivals = lazy(() => import('./pages/NewArrivals'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Account = lazy(() => import('./pages/Account'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback
function PageLoader() {
  return (
    <div className="loading-screen">
      <div className="spinner" />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Account />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <BottomNav />
        <BackToTop />
        <ToastContainer
          position={window.innerWidth < 768 ? 'top-center' : 'top-right'}
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          style={{ fontSize: '13px' }}
        />
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
