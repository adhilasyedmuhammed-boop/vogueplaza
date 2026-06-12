import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [step, setStep] = useState(0); // 0=login check, 1=address, 2=payment, 3=confirmation
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const stored = localStorage.getItem('vp_user');
    if (stored) {
      setUser(JSON.parse(stored));
      setStep(1);
    } else {
      setStep(0);
    }
  }, []);

  const [address, setAddress] = useState({
    fullName: '', phone: '', email: '',
    street: '', city: '', state: '', pincode: '', landmark: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shipping = subtotal >= 500000 ? 0 : 49900;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;
  const fmtPrice = (p) => `₹${(p / 100).toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;

  // Handle login from checkout
  const handleCheckoutLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoginLoading(true);
    try {
      const res = await axios.post('/auth/login', loginData);
      localStorage.setItem('vp_token', res.data.token);
      localStorage.setItem('vp_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setStep(1);
      toast.success(`Welcome, ${res.data.user?.name || 'valued customer'}. Please continue with your order.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    }
    setLoginLoading(false);
  };

  if (cartItems.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!/^\d{10}$/.test(address.phone)) {
      toast.error('Enter a valid 10-digit phone number');
      return;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error('Enter a valid 6-digit pincode');
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    setLoading(true);
    // Place order in database
    const orderData = {
      items: cartItems.map(item => ({
        product: item._id,
        name: item.name,
        brand: item.brand,
        image: item.image,
        price: item.price,
        size: item.size,
        quantity: item.quantity || 1,
      })),
      shippingAddress: address,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
    };

    axios.post('/orders', orderData)
      .then(() => {
        setLoading(false);
        setStep(3);
        clearCart();
        window.scrollTo(0, 0);
        toast.success('Order placed successfully!');
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message || 'Failed to place order. Please try again.');
      });
  };

  // Step 0: Login Required
  if (step === 0) {
    return (
      <>
        <Navbar />
        <div className="vp-container">
          <div className="checkout-page">
            <div className="checkout-login-required">
              <div className="checkout-login-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h1 className="checkout-login-title">Sign In to Continue</h1>
              <p className="checkout-login-text">
                Please sign in to your account to proceed with checkout. This helps us track your orders and provide a better shopping experience.
              </p>

              <form onSubmit={handleCheckoutLogin} className="checkout-login-form">
                <div className="checkout-field">
                  <label>Email Address</label>
                  <input type="email" placeholder="your@email.com" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} required />
                </div>
                <div className="checkout-field">
                  <label>Password</label>
                  <input type="password" placeholder="Enter your password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} required />
                </div>
                <button type="submit" className="btn-primary" disabled={loginLoading} style={{ width: '100%', marginTop: '8px' }}>
                  {loginLoading ? 'Signing in...' : 'Sign In & Continue →'}
                </button>
              </form>

              <div className="checkout-login-divider">
                <span>or</span>
              </div>

              <div className="checkout-login-options">
                <Link to="/login" className="checkout-login-register-link">
                  New to Vogue Plaza? <strong>Create an account</strong>
                </Link>
                <button className="checkout-login-back" onClick={() => navigate('/cart')}>
                  ← Back to Cart
                </button>
              </div>

              {/* Cart summary preview */}
              <div className="checkout-login-cart-preview">
                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: '#666' }}>Your Cart ({cartItems.length} items)</div>
                {cartItems.slice(0, 3).map(item => (
                  <div key={`${item._id}-${item.size}`} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <img src={item.image} alt="" style={{ width: 32, height: 40, objectFit: 'cover', borderRadius: 3 }} />
                    <span style={{ fontSize: '12px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{fmtPrice(item.price)}</span>
                  </div>
                ))}
                {cartItems.length > 3 && <div style={{ fontSize: '11px', color: '#888' }}>+{cartItems.length - 3} more items</div>}
                <div style={{ borderTop: '1px solid #f0f0f0', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '13px' }}>
                  <span>Total</span>
                  <span>{fmtPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Step 3: Order Confirmation
  if (step === 3) {
    return (
      <>
        <Navbar />
        <div className="vp-container">
          <div className="checkout-page">
            <div className="checkout-success">
              <div className="checkout-success-icon">✓</div>
              <h1 className="checkout-success-title">Order Confirmed!</h1>
              <p className="checkout-success-text">
                Thank you for your purchase! Your order has been placed successfully.
              </p>
              <div className="checkout-success-details">
                <div className="checkout-success-row">
                  <span>Order Number</span>
                  <span>#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
                <div className="checkout-success-row">
                  <span>Payment Method</span>
                  <span>{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'netbanking' ? 'Net Banking' : 'EMI'}</span>
                </div>
                <div className="checkout-success-row">
                  <span>Delivery To</span>
                  <span>{address.fullName}</span>
                </div>
                <div className="checkout-success-row">
                  <span>Total Paid</span>
                  <span style={{ fontWeight: 700 }}>{fmtPrice(total)}</span>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '20px' }}>
                A confirmation email will be sent to {address.email || 'your registered email'}.
              </p>
              <button className="btn-primary" style={{ marginTop: '24px', width: 'auto', padding: '0 40px' }} onClick={() => navigate('/')}>
                Continue Shopping →
              </button>
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
      <div className="vp-container page-enter">
        <div className="checkout-page">
          <h1 className="checkout-title">Checkout</h1>

          {/* Progress Steps */}
          <div className="checkout-steps">
            <div className={`checkout-step ${step >= 1 ? 'active' : ''}`}>
              <div className="checkout-step-num">{step > 1 ? '✓' : '1'}</div>
              <span>Delivery</span>
            </div>
            <div className="checkout-step-line" />
            <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
              <div className="checkout-step-num">{step > 2 ? '✓' : '2'}</div>
              <span>Payment</span>
            </div>
            <div className="checkout-step-line" />
            <div className={`checkout-step ${step >= 3 ? 'active' : ''}`}>
              <div className="checkout-step-num">3</div>
              <span>Confirmation</span>
            </div>
          </div>

          <div className="checkout-layout">
            {/* Left: Form */}
            <div className="checkout-form-section">
              {step === 1 && (
                <form onSubmit={handleAddressSubmit}>
                  <h2 className="checkout-section-title">Delivery Address</h2>
                  <div className="checkout-form-grid">
                    <div className="checkout-field full">
                      <label>Full Name *</label>
                      <input type="text" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} placeholder="Enter your full name" required />
                    </div>
                    <div className="checkout-field">
                      <label>Phone Number *</label>
                      <input type="tel" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} placeholder="10-digit mobile number" required />
                    </div>
                    <div className="checkout-field">
                      <label>Email</label>
                      <input type="email" value={address.email} onChange={e => setAddress({...address, email: e.target.value})} placeholder="your@email.com" />
                    </div>
                    <div className="checkout-field full">
                      <label>Street Address *</label>
                      <input type="text" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="House no., Building, Street" required />
                    </div>
                    <div className="checkout-field">
                      <label>City *</label>
                      <input type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} placeholder="City" required />
                    </div>
                    <div className="checkout-field">
                      <label>State *</label>
                      <input type="text" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} placeholder="State" required />
                    </div>
                    <div className="checkout-field">
                      <label>Pincode *</label>
                      <input type="text" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} placeholder="6-digit pincode" required />
                    </div>
                    <div className="checkout-field">
                      <label>Landmark</label>
                      <input type="text" value={address.landmark} onChange={e => setAddress({...address, landmark: e.target.value})} placeholder="Nearby landmark (optional)" />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '24px' }}>
                    Continue to Payment →
                  </button>
                </form>
              )}

              {step === 2 && (
                <div>
                  <h2 className="checkout-section-title">Payment Method</h2>
                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '24px' }}>All transactions are secure and encrypted.</p>

                  <div className="payment-options">
                    {/* UPI */}
                    <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                      <div className="payment-option-content">
                        <div className="payment-option-header">
                          <span className="payment-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></span>
                          <div>
                            <div className="payment-option-title">UPI</div>
                            <div className="payment-option-desc">Google Pay, PhonePe, Paytm, BHIM UPI</div>
                          </div>
                        </div>
                        {paymentMethod === 'upi' && (
                          <div className="payment-expand">
                            <input type="text" className="payment-input" placeholder="Enter UPI ID (e.g., name@upi)" />
                            <div className="payment-upi-apps">
                              <span className="upi-app">GPay</span>
                              <span className="upi-app">PhonePe</span>
                              <span className="upi-app">Paytm</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Card */}
                    <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                      <div className="payment-option-content">
                        <div className="payment-option-header">
                          <span className="payment-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span>
                          <div>
                            <div className="payment-option-title">Credit / Debit Card</div>
                            <div className="payment-option-desc">Visa, Mastercard, Rupay, Amex</div>
                          </div>
                        </div>
                        {paymentMethod === 'card' && (
                          <div className="payment-expand">
                            <input type="text" className="payment-input" placeholder="Card Number" maxLength="19" />
                            <div className="payment-card-row">
                              <input type="text" className="payment-input" placeholder="MM/YY" maxLength="5" />
                              <input type="text" className="payment-input" placeholder="CVV" maxLength="4" />
                            </div>
                            <input type="text" className="payment-input" placeholder="Cardholder Name" />
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Net Banking */}
                    <label className={`payment-option ${paymentMethod === 'netbanking' ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} />
                      <div className="payment-option-content">
                        <div className="payment-option-header">
                          <span className="payment-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
                          <div>
                            <div className="payment-option-title">Net Banking</div>
                            <div className="payment-option-desc">All major banks supported</div>
                          </div>
                        </div>
                        {paymentMethod === 'netbanking' && (
                          <div className="payment-expand">
                            <div className="payment-banks">
                              {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map(bank => (
                                <span key={bank} className="bank-chip">{bank}</span>
                              ))}
                            </div>
                            <select className="payment-input" style={{ marginTop: '12px' }}>
                              <option value="">Select Other Bank</option>
                              <option>Bank of Baroda</option>
                              <option>Canara Bank</option>
                              <option>Union Bank</option>
                              <option>Indian Bank</option>
                              <option>Federal Bank</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </label>

                    {/* EMI */}
                    <label className={`payment-option ${paymentMethod === 'emi' ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value="emi" checked={paymentMethod === 'emi'} onChange={() => setPaymentMethod('emi')} />
                      <div className="payment-option-content">
                        <div className="payment-option-header">
                          <span className="payment-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
                          <div>
                            <div className="payment-option-title">EMI</div>
                            <div className="payment-option-desc">No-cost & low-cost EMI available</div>
                          </div>
                        </div>
                        {paymentMethod === 'emi' && (
                          <div className="payment-expand">
                            <div className="emi-options">
                              <label className="emi-option">
                                <input type="radio" name="emi" defaultChecked />
                                <span>3 Months — {fmtPrice(Math.round(total / 3))}/mo <em style={{color:'#27AE60'}}>No Cost</em></span>
                              </label>
                              <label className="emi-option">
                                <input type="radio" name="emi" />
                                <span>6 Months — {fmtPrice(Math.round(total / 6))}/mo <em style={{color:'#27AE60'}}>No Cost</em></span>
                              </label>
                              <label className="emi-option">
                                <input type="radio" name="emi" />
                                <span>12 Months — {fmtPrice(Math.round(total / 12))}/mo</span>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                      <div className="payment-option-content">
                        <div className="payment-option-header">
                          <span className="payment-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></span>
                          <div>
                            <div className="payment-option-title">Cash on Delivery</div>
                            <div className="payment-option-desc">Pay when you receive your order</div>
                          </div>
                        </div>
                        {paymentMethod === 'cod' && (
                          <div className="payment-expand">
                            <p style={{ fontSize: '12px', color: '#888' }}>₹50 COD fee will be added to your total.</p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="checkout-actions">
                    <button className="btn-secondary" onClick={() => { setStep(1); window.scrollTo(0, 0); }}>
                      ← Back to Address
                    </button>
                    <button className="btn-primary" onClick={handlePayment} disabled={loading} style={{ minWidth: '200px' }}>
                      {loading ? (
                        <span className="payment-loading">Processing...</span>
                      ) : (
                        `Pay ${fmtPrice(total + (paymentMethod === 'cod' ? 5000 : 0))}`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="checkout-summary">
              <h3 className="checkout-summary-title">Order Summary</h3>
              <div className="checkout-summary-items">
                {cartItems.map((item) => (
                  <div key={`${item._id}-${item.size}`} className="checkout-summary-item">
                    <img src={item.image} alt={item.name} className="checkout-summary-img" />
                    <div className="checkout-summary-item-info">
                      <div className="checkout-summary-item-name">{item.name}</div>
                      <div className="checkout-summary-item-meta">{item.brand} {item.size && `• Size: ${item.size}`} • Qty: {item.quantity || 1}</div>
                      <div className="checkout-summary-item-price">{fmtPrice(item.price * (item.quantity || 1))}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="checkout-summary-divider" />
              <div className="checkout-summary-row"><span>Subtotal</span><span>{fmtPrice(subtotal)}</span></div>
              <div className="checkout-summary-row"><span>Shipping</span><span>{shipping === 0 ? <span style={{ color: '#27AE60' }}>Free</span> : fmtPrice(shipping)}</span></div>
              <div className="checkout-summary-row"><span>Tax (GST 18%)</span><span>{fmtPrice(tax)}</span></div>
              {paymentMethod === 'cod' && <div className="checkout-summary-row"><span>COD Fee</span><span>{fmtPrice(5000)}</span></div>}
              <div className="checkout-summary-divider" />
              <div className="checkout-summary-row total"><span>Total</span><span>{fmtPrice(total + (paymentMethod === 'cod' ? 5000 : 0))}</span></div>

              {/* Delivery info */}
              {step === 2 && (
                <div className="checkout-delivery-preview">
                  <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Delivering to:</div>
                  <div style={{ fontSize: '12px', color: '#555' }}>{address.fullName}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>{address.street}, {address.city}, {address.state} - {address.pincode}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>📞 {address.phone}</div>
                </div>
              )}

              <div className="checkout-secure">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>Secure checkout — SSL encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
