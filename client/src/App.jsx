import { Routes, Route, Navigate } from 'react-router-dom';
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

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBrands from './pages/admin/AdminBrands';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminReviews from './pages/admin/AdminReviews';
import AdminPosts from './pages/admin/AdminPosts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStore from './pages/admin/AdminStore';
import AdminBanners from './pages/admin/AdminBanners';
import AdminHome from './pages/admin/AdminHome';
import AdminLogin from './components/AdminLogin';

function ProtectedAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem('vp_user') || '{}');
  const token = localStorage.getItem('vp_token');
  if (!token || user.role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
}

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin Panel */}
          <Route path="/admin" element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="store" element={<AdminStore />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="home-data" element={<AdminHome />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
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
