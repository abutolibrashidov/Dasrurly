import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('🔒 401 Unauthorized - Clearing tokens');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Force reload to trigger AuthContext update/redirect
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
