import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LoginRegister() {
  const [tab, setTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', loginData);
      localStorage.setItem('vp_token', res.data.token);
      localStorage.setItem('vp_user', JSON.stringify(res.data.user));
      toast.success(`Welcome back, ${res.data.user?.name || 'User'}! 👋`);
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regData.password !== regData.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', { name: regData.name, email: regData.email, password: regData.password });
      localStorage.setItem('vp_token', res.data.token);
      toast.success('Account created successfully! Welcome to Vogue Plaza 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">VOGUE PLAZA</div>

          <div className="auth-tabs">
            <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
            <button className={`auth-tab${tab === 'register' ? ' active' : ''}`} onClick={() => setTab('register')}>Register</button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="form-field">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="your@email.com" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} required />
              </div>
              <div className="form-field">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="Enter your password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} required />
              </div>
              <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', color: '#888', textDecoration: 'underline', cursor: 'pointer' }}>Forgot Password?</span>
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
              <div className="auth-footer-text">
                New to Vogue Plaza? <a onClick={() => setTab('register')} style={{ cursor: 'pointer' }}>Create an account</a>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-field">
                <label className="form-label">Full Name</label>
                <input className="form-input" type="text" placeholder="Your full name" value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} required />
              </div>
              <div className="form-field">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="your@email.com" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} required />
              </div>
              <div className="form-field">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="Create a password" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} required minLength={6} />
              </div>
              <div className="form-field">
                <label className="form-label">Confirm Password</label>
                <input className="form-input" type="password" placeholder="Confirm your password" value={regData.confirm} onChange={e => setRegData({...regData, confirm: e.target.value})} required />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account →'}
              </button>
              <div className="auth-footer-text">
                Already have an account? <a onClick={() => setTab('login')} style={{ cursor: 'pointer' }}>Sign in</a>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
