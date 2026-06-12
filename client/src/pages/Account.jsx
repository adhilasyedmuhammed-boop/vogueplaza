import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import axios from '../api/axios';

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [tab, setTab] = useState('profile'); // profile, orders, addresses, password
  const [loading, setLoading] = useState(true);

  // Profile edit state
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });

  // Password change state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);

  // Address form
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '', landmark: '', isDefault: false });
  const [editingAddr, setEditingAddr] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('vp_user');
    if (!stored) { navigate('/login'); return; }
    fetchProfile();
    fetchOrders();
    fetchAddresses();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/user/profile');
      setUser(res.data);
      setProfileForm({ name: res.data.name || '', phone: res.data.phone || '' });
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/orders');
      setOrders(res.data);
    } catch { /* ignore */ }
  };

  const fetchAddresses = async () => {
    try {
      const res = await axios.get('/user/addresses');
      setAddresses(res.data);
    } catch { /* ignore */ }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/user/profile', profileForm);
      setUser(prev => ({ ...prev, ...res.data }));
      localStorage.setItem('vp_user', JSON.stringify(res.data));
      window.dispatchEvent(new Event('vp-auth-change'));
      setEditProfile(false);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    setPwLoading(true);
    try {
      await axios.put('/user/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Password change failed');
    }
    setPwLoading(false);
  };

  const handleAddrSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddr) {
        const res = await axios.put(`/user/addresses/${editingAddr}`, addrForm);
        setAddresses(res.data);
        toast.success('Address updated');
      } else {
        const res = await axios.post('/user/addresses', addrForm);
        setAddresses(res.data);
        toast.success('Address added');
      }
      resetAddrForm();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDeleteAddr = async (id) => {
    try {
      const res = await axios.delete(`/user/addresses/${id}`);
      setAddresses(res.data);
      toast.success('Address removed');
    } catch { toast.error('Failed to delete'); }
  };

  const resetAddrForm = () => {
    setShowAddrForm(false);
    setEditingAddr(null);
    setAddrForm({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '', landmark: '', isDefault: false });
  };

  const startEditAddr = (addr) => {
    setAddrForm({ fullName: addr.fullName || '', phone: addr.phone || '', street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode, landmark: addr.landmark || '', isDefault: addr.isDefault });
    setEditingAddr(addr._id);
    setShowAddrForm(true);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(`/orders/${orderId}/cancel`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cannot cancel order');
    }
  };

  const fmtPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const statusColor = (s) => {
    const map = { placed: '#c9a96e', confirmed: '#2563eb', shipped: '#7c3aed', delivered: '#16a34a', cancelled: '#dc2626' };
    return map[s] || '#666';
  };

  if (loading) return <><Navbar /><div className="loading-screen"><div className="spinner" /><span className="loading-text">Loading</span></div><Footer /></>;

  return (
    <>
      <Navbar />
      <div className="vp-container">
        <div className="account-page">
          {/* Sidebar */}
          <aside className="account-sidebar">
            <div className="account-avatar">{(user?.name || 'U').charAt(0).toUpperCase()}</div>
            <div className="account-name">{user?.name}</div>
            <div className="account-email">{user?.email}</div>

            <nav className="account-nav">
              <button className={`account-nav-item${tab === 'profile' ? ' active' : ''}`} onClick={() => setTab('profile')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                My Profile
              </button>
              <button className={`account-nav-item${tab === 'orders' ? ' active' : ''}`} onClick={() => setTab('orders')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                My Orders
                {orders.length > 0 && <span className="account-badge">{orders.length}</span>}
              </button>
              <button className={`account-nav-item${tab === 'addresses' ? ' active' : ''}`} onClick={() => setTab('addresses')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Addresses
              </button>
              <button className={`account-nav-item${tab === 'password' ? ' active' : ''}`} onClick={() => setTab('password')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Change Password
              </button>
            </nav>
          </aside>

          {/* Content */}
          <main className="account-content">
            {/* PROFILE TAB */}
            {tab === 'profile' && (
              <div className="account-section">
                <h2 className="account-section-title">Personal Information</h2>
                {!editProfile ? (
                  <div className="profile-info-grid">
                    <div className="profile-info-item">
                      <label>Full Name</label>
                      <span>{user?.name}</span>
                    </div>
                    <div className="profile-info-item">
                      <label>Email</label>
                      <span>{user?.email}</span>
                    </div>
                    <div className="profile-info-item">
                      <label>Phone</label>
                      <span>{user?.phone || 'Not set'}</span>
                    </div>
                    <div className="profile-info-item">
                      <label>Member Since</label>
                      <span>{fmtDate(user?.createdAt)}</span>
                    </div>
                    <button className="btn-outline" onClick={() => setEditProfile(true)}>Edit Profile</button>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="profile-edit-form">
                    <div className="checkout-field">
                      <label>Full Name</label>
                      <input type="text" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} required />
                    </div>
                    <div className="checkout-field">
                      <label>Phone Number</label>
                      <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="10-digit mobile number" />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                      <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
                      <button type="button" className="btn-outline" onClick={() => setEditProfile(false)} style={{ flex: 1 }}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ORDERS TAB */}
            {tab === 'orders' && (
              <div className="account-section">
                <h2 className="account-section-title">Order History</h2>
                {orders.length === 0 ? (
                  <div className="account-empty">
                    <p>No orders yet. Start shopping!</p>
                    <Link to="/products" className="btn-primary" style={{ width: 'auto', padding: '0 32px', display: 'inline-flex', alignItems: 'center', height: '44px', textDecoration: 'none' }}>Shop Now →</Link>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order._id} className="order-card">
                        <div className="order-card-header">
                          <div>
                            <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                            <span className="order-date">{fmtDate(order.createdAt)}</span>
                          </div>
                          <span className="order-status" style={{ color: statusColor(order.status) }}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="order-items-preview">
                          {order.items.slice(0, 3).map((item, i) => (
                            <img key={i} src={item.image} alt={item.name} className="order-item-thumb" />
                          ))}
                          {order.items.length > 3 && <span className="order-items-more">+{order.items.length - 3}</span>}
                        </div>
                        <div className="order-card-footer">
                          <span className="order-total">{fmtPrice(order.total)}</span>
                          <div className="order-actions">
                            {['placed', 'confirmed'].includes(order.status) && (
                              <button className="btn-outline btn-sm" onClick={() => handleCancelOrder(order._id)}>Cancel</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADDRESSES TAB */}
            {tab === 'addresses' && (
              <div className="account-section">
                <div className="flex-between" style={{ marginBottom: '20px' }}>
                  <h2 className="account-section-title" style={{ margin: 0 }}>Saved Addresses</h2>
                  {!showAddrForm && (
                    <button className="btn-outline btn-sm" onClick={() => setShowAddrForm(true)}>+ Add New</button>
                  )}
                </div>

                {showAddrForm && (
                  <form onSubmit={handleAddrSubmit} className="address-form">
                    <div className="checkout-form-grid">
                      <div className="checkout-field">
                        <label>Full Name</label>
                        <input type="text" value={addrForm.fullName} onChange={e => setAddrForm({ ...addrForm, fullName: e.target.value })} />
                      </div>
                      <div className="checkout-field">
                        <label>Phone</label>
                        <input type="tel" value={addrForm.phone} onChange={e => setAddrForm({ ...addrForm, phone: e.target.value })} />
                      </div>
                      <div className="checkout-field full">
                        <label>Street Address *</label>
                        <input type="text" value={addrForm.street} onChange={e => setAddrForm({ ...addrForm, street: e.target.value })} required />
                      </div>
                      <div className="checkout-field">
                        <label>City *</label>
                        <input type="text" value={addrForm.city} onChange={e => setAddrForm({ ...addrForm, city: e.target.value })} required />
                      </div>
                      <div className="checkout-field">
                        <label>State *</label>
                        <input type="text" value={addrForm.state} onChange={e => setAddrForm({ ...addrForm, state: e.target.value })} required />
                      </div>
                      <div className="checkout-field">
                        <label>Pincode *</label>
                        <input type="text" value={addrForm.pincode} onChange={e => setAddrForm({ ...addrForm, pincode: e.target.value })} required maxLength={6} />
                      </div>
                      <div className="checkout-field">
                        <label>Landmark</label>
                        <input type="text" value={addrForm.landmark} onChange={e => setAddrForm({ ...addrForm, landmark: e.target.value })} />
                      </div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0', fontSize: '13px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm({ ...addrForm, isDefault: e.target.checked })} />
                      Set as default address
                    </label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                      <button type="submit" className="btn-primary" style={{ flex: 1 }}>{editingAddr ? 'Update' : 'Save'} Address</button>
                      <button type="button" className="btn-outline" onClick={resetAddrForm} style={{ flex: 1 }}>Cancel</button>
                    </div>
                  </form>
                )}

                {addresses.length === 0 && !showAddrForm ? (
                  <div className="account-empty"><p>No saved addresses yet.</p></div>
                ) : (
                  <div className="address-grid">
                    {addresses.map(addr => (
                      <div key={addr._id} className={`address-card${addr.isDefault ? ' default' : ''}`}>
                        {addr.isDefault && <span className="address-default-badge">Default</span>}
                        <div className="address-card-name">{addr.fullName || user?.name}</div>
                        <div className="address-card-line">{addr.street}</div>
                        <div className="address-card-line">{addr.city}, {addr.state} - {addr.pincode}</div>
                        {addr.landmark && <div className="address-card-line">{addr.landmark}</div>}
                        {addr.phone && <div className="address-card-phone">{addr.phone}</div>}
                        <div className="address-card-actions">
                          <button onClick={() => startEditAddr(addr)}>Edit</button>
                          <button onClick={() => handleDeleteAddr(addr._id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PASSWORD TAB */}
            {tab === 'password' && (
              <div className="account-section">
                <h2 className="account-section-title">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="profile-edit-form" style={{ maxWidth: '400px' }}>
                  <div className="checkout-field">
                    <label>Current Password</label>
                    <input type="password" value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
                  </div>
                  <div className="checkout-field">
                    <label>New Password</label>
                    <input type="password" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} required minLength={6} />
                  </div>
                  <div className="checkout-field">
                    <label>Confirm New Password</label>
                    <input type="password" value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn-primary" disabled={pwLoading} style={{ marginTop: '16px' }}>
                    {pwLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
