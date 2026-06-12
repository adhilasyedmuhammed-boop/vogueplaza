import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import LoginRegister from './pages/LoginRegister';
import Brands from './pages/Brands';
import NewArrivals from './pages/NewArrivals';
import Checkout from './pages/Checkout';
import BottomNav from './components/BottomNav';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
        <BottomNav />
        <BackToTop />
        <ToastContainer
          position="top-right"
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
