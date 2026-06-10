import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('vp_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('vp_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist(prev => {
      if (prev.find(p => p._id === product._id)) {
        toast.info('Already in wishlist');
        return prev;
      }
      toast.success('Added to wishlist ♥');
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(p => p._id !== id));
    toast.info('Removed from wishlist');
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
