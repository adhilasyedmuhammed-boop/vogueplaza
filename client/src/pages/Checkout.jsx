import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=confirmation
  const [loading, setLoading] = useState(false);

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
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      clearCart();
      window.scrollTo(0, 0);
      toast.success('Order placed successfully! 🎉');
    }, 2000);
  };

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
      <div className="vp-container">
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
                          <span className="payment-icon">📱</span>
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
                          <span className="payment-icon">💳</span>
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
                          <span className="payment-icon">🏦</span>
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
                          <span className="payment-icon">📅</span>
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
                          <span className="payment-icon">💰</span>
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
