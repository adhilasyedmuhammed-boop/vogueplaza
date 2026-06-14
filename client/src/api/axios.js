import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses (token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      // Don't redirect for login/register pages or already-cleared state
      if (!path.includes('/login') && !path.includes('/register')) {
        localStorage.removeItem('vp_token');
        localStorage.removeItem('vp_user');
        window.dispatchEvent(new Event('vp-auth-change'));
        // Only redirect if user was on a protected page
        if (path.includes('/account') || path.includes('/checkout')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
