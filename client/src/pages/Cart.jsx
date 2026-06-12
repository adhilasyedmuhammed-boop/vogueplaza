import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shipping = subtotal >= 500000 ? 0 : 49900;
  const total = subtotal + shipping;

  const fmtPrice = (p) => `₹${(p / 100).toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="vp-container">
          <div className="cart-page">
            <h1 className="cart-page-title">Shopping Bag</h1>
            <div className="cart-empty">
              <div className="cart-empty-icon">🛍️</div>
              <div className="cart-empty-title">Your bag is empty</div>
              <p className="cart-empty-text">Looks like you haven't added anything to your bag yet. Start exploring our luxury collections.</p>
              <Link to="/products" className="btn-primary" style={{ width: 'auto', padding: '0 36px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '50px' }}>
                Continue Shopping →
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="vp-container">
        <div className="cart-page">
          <div className="flex-between" style={{ marginBottom: '32px' }}>
            <h1 className="cart-page-title" style={{ marginBottom: 0 }}>Shopping Bag ({cartItems.length})</h1>
            <button onClick={clearCart} style={{ fontSize: '12px', color: '#888', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
              Clear All
            </button>
          </div>

          <div className="cart-layout">
            {/* Cart Items */}
            <div>
              {cartItems.map((item) => (
                <div key={`${item._id}-${item.size}`} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <div className="cart-item-brand">{item.brand}</div>
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-meta">
                      {item.size && <span>Size: {item.size}</span>}
                    </div>
                    <div className="cart-item-bottom">
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => item.quantity > 1 ? updateQuantity(item._id, item.size, item.quantity - 1) : removeFromCart(item._id, item.size)}>−</button>
                        <span className="qty-value">{item.quantity || 1}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item._id, item.size, (item.quantity || 1) + 1)}>+</button>
                      </div>
                      <span className="cart-item-price">{fmtPrice(item.price * (item.quantity || 1))}</span>
                    </div>
                    <button className="cart-item-remove" style={{ marginTop: '10px' }} onClick={() => removeFromCart(item._id, item.size)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="cart-summary">
              <div className="cart-summary-title">Order Summary</div>

              <div className="cart-promo-row">
                <input type="text" className="cart-promo-input" placeholder="Promo / Gift Code" />
                <button className="cart-promo-btn">Apply</button>
              </div>

              <div className="cart-summary-row"><span>Subtotal</span><span>{fmtPrice(subtotal)}</span></div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span style={{ color: '#27AE60' }}>Free</span> : fmtPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>
                  Add {fmtPrice(500000 - subtotal)} more for free shipping
                </div>
              )}
              <div className="cart-summary-row"><span>Tax (GST 18%)</span><span>{fmtPrice(Math.round(subtotal * 0.18))}</span></div>
              <div className="cart-summary-row total"><span>Total</span><span>{fmtPrice(total + Math.round(subtotal * 0.18))}</span></div>

              <button className="cart-checkout-btn" onClick={() => navigate('/checkout')}>
                Proceed to Checkout →
              </button>

              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <Link to="/products" style={{ fontSize: '12px', color: '#888', textDecoration: 'underline' }}>Continue Shopping</Link>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {['💳 Cards', '📱 UPI', '🏦 NetBanking', '💰 EMI'].map(m => (
                  <span key={m} style={{ fontSize: '11px', padding: '4px 10px', background: '#F5F5F5', borderRadius: '4px', color: '#555' }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
