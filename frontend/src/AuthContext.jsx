import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from './config';

const AuthContext = createContext();

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        // Check expiry before trusting the stored token
        const payload = parseJwt(storedToken);
        if (!payload || payload.exp * 1000 < Date.now()) {
          // Token expired — clear everything
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setLoading(false);
          return;
        }
        const userObj = JSON.parse(storedUser);
        if (userObj.id && userObj.restaurantId) {
          setToken(storedToken);
          setUser(userObj);
        } else {
          throw new Error('Invalid user structure');
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('originalToken');
    localStorage.removeItem('originalUser');
  };

  const impersonate = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/users/impersonate/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Impersonation failed');

      const data = await response.json();

      const decoded = parseJwt(data.token);
      if (!decoded) throw new Error('Invalid impersonation token');

      const impersonatedUser = {
        id: decoded.userId,
        role: decoded.role,
        restaurantId: decoded.restaurantId,
        username: decoded.username || 'Impersonated User'
      };

      localStorage.setItem('originalToken', token);
      localStorage.setItem('originalUser', JSON.stringify(user));
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(impersonatedUser));
      setToken(data.token);
      setUser(impersonatedUser);

    } catch (err) {
      alert(err.message);
    }
  };

  const stopImpersonation = () => {
    const originalToken = localStorage.getItem('originalToken');
    const originalUser = localStorage.getItem('originalUser');

    if (originalToken && originalUser) {
      const userObj = JSON.parse(originalUser);
      localStorage.setItem('token', originalToken);
      localStorage.setItem('user', originalUser);
      localStorage.removeItem('originalToken');
      localStorage.removeItem('originalUser');
      setToken(originalToken);
      setUser(userObj);
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Update failed');
      const updatedUser = await response.json();
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const isImpersonating = !!localStorage.getItem('originalToken');

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      impersonate,
      stopImpersonation,
      updateProfile,
      isImpersonating
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}