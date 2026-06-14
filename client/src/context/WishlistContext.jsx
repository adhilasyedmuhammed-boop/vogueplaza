import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('vp_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const isLoggedIn = () => !!localStorage.getItem('vp_token');

  // Sync wishlist from server when user logs in
  const syncFromServer = useCallback(async () => {
    if (!isLoggedIn()) return;
    try {
      const res = await api.get('/wishlist');
      if (Array.isArray(res.data)) {
        setWishlist(res.data);
        localStorage.setItem('vp_wishlist', JSON.stringify(res.data));
      }
    } catch { /* silent — fallback to localStorage */ }
  }, []);

  useEffect(() => {
    syncFromServer();
    const handleAuth = () => syncFromServer();
    window.addEventListener('vp-auth-change', handleAuth);
    return () => window.removeEventListener('vp-auth-change', handleAuth);
  }, [syncFromServer]);

  useEffect(() => {
    localStorage.setItem('vp_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = async (product) => {
    if (wishlist.find(p => p._id === product._id)) {
      toast.info('This item is already in your wishlist');
      return;
    }
    setWishlist(prev => [...prev, product]);
    toast.success('Added to your wishlist');
    if (isLoggedIn()) {
      try { await api.post('/wishlist', { productId: product._id }); } catch { /* synced locally */ }
    }
  };

  const removeFromWishlist = async (id) => {
    setWishlist(prev => prev.filter(p => p._id !== id));
    toast.info('Removed from wishlist');
    if (isLoggedIn()) {
      try { await api.delete(`/wishlist/${id}`); } catch { /* synced locally */ }
    }
  };

  const toggleWishlist = (product) => {
    if (wishlist.find(p => p._id === product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (id) => wishlist.some(p => p._id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, count: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
