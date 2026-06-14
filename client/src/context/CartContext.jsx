import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const CartContext = createContext();
const MAX_QTY_PER_ITEM = 5;

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('vp_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const isLoggedIn = () => !!localStorage.getItem('vp_token');

  useEffect(() => {
    localStorage.setItem('vp_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Check if an ID is a valid MongoDB ObjectId (24 hex chars)
  const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);

  // Sync cart to server (only valid product IDs)
  const syncToServer = useCallback(async (items) => {
    if (!isLoggedIn()) return;
    const validItems = items.filter(i => isValidId(i._id));
    if (validItems.length === 0) return;
    try {
      await api.put('/cart', { items: validItems });
    } catch { /* silent */ }
  }, []);

  // On login, merge local cart with server cart
  const syncFromServer = useCallback(async () => {
    if (!isLoggedIn()) return;
    try {
      const localCart = JSON.parse(localStorage.getItem('vp_cart') || '[]');
      const validLocal = localCart.filter(i => isValidId(i._id));
      if (validLocal.length > 0) {
        await api.put('/cart', { items: validLocal });
      }
      const res = await api.get('/cart');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setCartItems(res.data);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    syncFromServer();
    const handleAuth = () => syncFromServer();
    window.addEventListener('vp-auth-change', handleAuth);
    return () => window.removeEventListener('vp-auth-change', handleAuth);
  }, [syncFromServer]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const key = `${product._id}-${product.size || 'default'}`;
      const existing = prev.find(i => `${i._id}-${i.size || 'default'}` === key);
      let updated;
      if (existing) {
        if ((existing.quantity || 1) >= MAX_QTY_PER_ITEM) {
          toast.warning(`Maximum ${MAX_QTY_PER_ITEM} per item allowed`);
          return prev;
        }
        updated = prev.map(i =>
          `${i._id}-${i.size || 'default'}` === key
            ? { ...i, quantity: (i.quantity || 1) + 1 }
            : i
        );
      } else {
        updated = [...prev, { ...product, quantity: 1 }];
      }
      syncToServer(updated);
      return updated;
    });
  };

  const removeFromCart = (productId, size) => {
    setCartItems(prev => {
      const updated = prev.filter(i => !(i._id === productId && (i.size === size || (!size && !i.size))));
      syncToServer(updated);
      return updated;
    });
  };

  const updateQuantity = (productId, size, newQty) => {
    if (newQty < 1) { removeFromCart(productId, size); return; }
    if (newQty > MAX_QTY_PER_ITEM) { toast.warning(`Maximum ${MAX_QTY_PER_ITEM} per item allowed`); return; }
    setCartItems(prev => {
      const updated = prev.map(i =>
        i._id === productId && (i.size === size || (!size && !i.size))
          ? { ...i, quantity: newQty }
          : i
      );
      syncToServer(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (isLoggedIn()) {
      api.delete('/cart').catch(() => {});
    }
  };

  const cartCount = cartItems.reduce((t, i) => t + (i.quantity || 1), 0);
  const cartTotal = cartItems.reduce((t, i) => t + i.price * (i.quantity || 1), 0);

  // Legacy compat
  const cart = cartItems;

  return (
    <CartContext.Provider value={{ cartItems, cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
