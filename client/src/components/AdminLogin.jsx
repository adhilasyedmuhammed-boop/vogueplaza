import { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

export default function AdminLogin({ onSuccess }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/admin-login', credentials);
      localStorage.setItem('vp_token', response.data.token);
      localStorage.setItem('vp_user', JSON.stringify(response.data.user));
      toast.success('Admin login successful.');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#FAF8F5',
        borderRadius: '4px',
        boxShadow: '0 16px 60px rgba(0,0,0,0.3)',
        padding: '48px 40px',
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '12px',
        }}>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '26px',
            fontWeight: 700,
            color: '#111',
            letterSpacing: '2px',
            margin: 0,
          }}>VOGUE PLAZA</h1>
        </div>
        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#C5A880',
          marginBottom: '36px',
        }}>Admin Panel</p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#111',
              marginBottom: '8px',
              fontFamily: "'Inter', sans-serif",
            }}>Email Address</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              placeholder="admin@vogueplaza.com"
              style={{
                width: '100%',
                height: '46px',
                padding: '0 14px',
                border: '1px solid #D4CBB8',
                borderRadius: '2px',
                fontSize: '14px',
                fontFamily: "'Inter', sans-serif",
                color: '#111',
                outline: 'none',
                background: '#fff',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = '#111'}
              onBlur={(e) => e.target.style.borderColor = '#D4CBB8'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#111',
              marginBottom: '8px',
              fontFamily: "'Inter', sans-serif",
            }}>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                height: '46px',
                padding: '0 14px',
                border: '1px solid #D4CBB8',
                borderRadius: '2px',
                fontSize: '14px',
                fontFamily: "'Inter', sans-serif",
                color: '#111',
                outline: 'none',
                background: '#fff',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = '#111'}
              onBlur={(e) => e.target.style.borderColor = '#D4CBB8'}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '48px',
              background: loading ? '#555' : '#111',
              color: '#FAF8F5',
              border: 'none',
              borderRadius: '2px',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Inter', sans-serif",
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { if (!loading) e.target.style.background = '#C5A880'; }}
            onMouseLeave={(e) => { if (!loading) e.target.style.background = '#111'; }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: '11px',
          color: '#A89F8D',
          marginTop: '24px',
          fontFamily: "'Inter', sans-serif",
        }}>Authorized personnel only</p>
      </div>
    </div>
  );
}
