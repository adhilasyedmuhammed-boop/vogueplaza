import { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('vp_token', response.data.token);
      localStorage.setItem('vp_user', JSON.stringify(response.data.user));
      toast.success('Admin login successful.');
      navigate('/admin');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="container admin-login-card">
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <label>
            Email
            <input type="email" name="email" value={credentials.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
          </label>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  );
}
