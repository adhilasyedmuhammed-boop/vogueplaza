import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

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

  useEffect(() => {
    localStorage.setItem('vp_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const key = `${product._id}-${product.size || 'default'}`;
      const existing = prev.find(i => `${i._id}-${i.size || 'default'}` === key);
      if (existing) {
        if ((existing.quantity || 1) >= MAX_QTY_PER_ITEM) {
          toast.warning(`Maximum ${MAX_QTY_PER_ITEM} per item allowed`);
          return prev;
        }
        return prev.map(i =>
          `${i._id}-${i.size || 'default'}` === key
            ? { ...i, quantity: (i.quantity || 1) + 1 }
            : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId, size) => {
    setCartItems(prev => prev.filter(i => !(i._id === productId && (i.size === size || (!size && !i.size)))));
  };

  const updateQuantity = (productId, size, newQty) => {
    if (newQty < 1) { removeFromCart(productId, size); return; }
    if (newQty > MAX_QTY_PER_ITEM) { toast.warning(`Maximum ${MAX_QTY_PER_ITEM} per item allowed`); return; }
    setCartItems(prev =>
      prev.map(i =>
        i._id === productId && (i.size === size || (!size && !i.size))
          ? { ...i, quantity: newQty }
          : i
      )
    );
  };

  const clearCart = () => setCartItems([]);

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
