import { useState, useEffect } from 'react';
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
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState(1); // 1=email, 2=token+password
  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  useEffect(() => {
    const token = localStorage.getItem('vp_token');
    const user = localStorage.getItem('vp_user');
    if (token && user) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', {
        email: loginData.email.trim().toLowerCase(),
        password: loginData.password,
      });
      localStorage.setItem('vp_token', res.data.token);
      localStorage.setItem('vp_user', JSON.stringify(res.data.user));
      window.dispatchEvent(new Event('vp-auth-change'));
      toast.success(`Welcome back, ${res.data.user?.name || 'valued customer'}!`);
      navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regData.name || !regData.email || !regData.password) {
      toast.error('Please fill all fields');
      return;
    }
    if (regData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (regData.password !== regData.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await axios.post('/auth/register', {
        name: regData.name.trim(),
        email: regData.email.trim().toLowerCase(),
        password: regData.password,
      });
      localStorage.setItem('vp_token', res.data.token);
      localStorage.setItem('vp_user', JSON.stringify(res.data.user));
      window.dispatchEvent(new Event('vp-auth-change'));
      toast.success('Your account has been created. Welcome to Vogue Plaza!');
      navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      const res = await axios.post('/auth/forgot-password', { email: forgotEmail.trim().toLowerCase() });
      toast.success('Reset link sent! Check your email.');
      // In dev mode, token may be returned directly
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
      setResetStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send reset email');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetToken || !newPassword) { toast.error('Please fill all fields'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await axios.post('/auth/reset-password', { token: resetToken, password: newPassword });
      toast.success('Password reset successfully! Please sign in.');
      setForgotMode(false);
      setResetStep(1);
      setForgotEmail('');
      setResetToken('');
      setNewPassword('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Reset failed. Token may be expired.');
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
            forgotMode ? (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', textAlign: 'center' }}>
                  {resetStep === 1 ? 'Reset Your Password' : 'Enter New Password'}
                </h3>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px', textAlign: 'center' }}>
                  {resetStep === 1
                    ? 'Enter your email and we\'ll send you a reset link.'
                    : 'Enter the reset token from your email and your new password.'}
                </p>
                {resetStep === 1 ? (
                  <form onSubmit={handleForgotPassword}>
                    <div className="form-field">
                      <label className="form-label">Email Address</label>
                      <input className="form-input" type="email" placeholder="your@email.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Reset Link →'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword}>
                    <div className="form-field">
                      <label className="form-label">Reset Token</label>
                      <input className="form-input" type="text" placeholder="Paste token from email" value={resetToken} onChange={e => setResetToken(e.target.value)} required />
                    </div>
                    <div className="form-field">
                      <label className="form-label">New Password</label>
                      <input className="form-input" type="password" placeholder="At least 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                      {loading ? 'Resetting...' : 'Reset Password →'}
                    </button>
                  </form>
                )}
                <div className="auth-footer-text">
                  <a onClick={() => { setForgotMode(false); setResetStep(1); }} style={{ cursor: 'pointer' }}>← Back to Sign In</a>
                </div>
              </div>
            ) : (
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
                <span onClick={() => { setForgotMode(true); setForgotEmail(loginData.email); }} style={{ fontSize: '12px', color: '#888', textDecoration: 'underline', cursor: 'pointer' }}>Forgot Password?</span>
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
              <div className="auth-footer-text">
                New to Vogue Plaza? <a onClick={() => setTab('register')} style={{ cursor: 'pointer' }}>Create an account</a>
              </div>
            </form>
            )
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
