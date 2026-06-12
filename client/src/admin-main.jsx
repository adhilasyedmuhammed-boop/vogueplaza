import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import './index.css';

function ProtectedAdmin({ children }) {
  const [authed, setAuthed] = useState(() => {
    const user = JSON.parse(localStorage.getItem('vp_user') || '{}');
    const token = localStorage.getItem('vp_token');
    return !!(token && user.role === 'admin');
  });

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }
  return children;
}

function AdminApp() {
  return (
    <BrowserRouter>
      <Routes>
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
        <Route path="*" element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>} />
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
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('admin-root')).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
