import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('admin');

  const credentials = {
    admin: { username: 'admin', password: 'admin123' },
    waiter: { username: 'waiter1', password: 'pass123' },
    kitchen: { username: 'kitchen1', password: 'pass123' }
  };

  const handleQuickLogin = async (role) => {
    const creds = credentials[role];
    setUsername(creds.username);
    setPassword(creds.password);
    
    setLoading(true);
    setError('');
    
    const result = await login(creds.username, creds.password);
    
    if (!result.success) {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Foydalanuvchi nomi va parolni kiriting');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(username, password);

    if (!result.success) {
      setError(result.error || 'Login muvaffaqiyatsiz');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {process.env.NODE_ENV !== 'production' && (
        <div style={{position: 'fixed', top: 8, right: 8, zIndex: 9999, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '6px 8px', borderRadius: 6, fontSize: 12}}>
          DEV: LoginPage visible
        </div>
      )}
      <div className="login-container">
        {/* Left Side - Branding */}
        <div className="login-branding">
          <div className="branding-content">
            <h1 className="brand-title">OSHXONA</h1>
            <p className="brand-subtitle">Professional Restaurant System</p>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">🍽️</span>
                <span>Buyurtmalarni boshqarish</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👨‍🍳</span>
                <span>Oshpaz bo'limi</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Tahlil va statistika</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-form-container">
          <form onSubmit={handleLogin} className="login-form">
            <h2>Tizimga kirish</h2>
            
            {error && (
              <div className="error-message">
                <span>⚠️</span> {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">Foydalanuvchi nomi</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Foydalanuvchi nomini kiriting"
                disabled={loading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Parol</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Parolni kiriting"
                disabled={loading}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-login"
            >
              {loading ? (
                <span className="loading-spinner">⏳ Yuklanmoqda...</span>
              ) : (
                '🔓 Kirish'
              )}
            </button>
          </form>

          {/* Quick Login Options */}
          <div className="divider">
            <span>TEZKOR KIRISH</span>
          </div>

          <div className="quick-login-tabs">
            <button
              className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              👔 Menejer
            </button>
            <button
              className={`tab-button ${activeTab === 'waiter' ? 'active' : ''}`}
              onClick={() => setActiveTab('waiter')}
            >
              👨‍💼 Ofitsiant
            </button>
            <button
              className={`tab-button ${activeTab === 'kitchen' ? 'active' : ''}`}
              onClick={() => setActiveTab('kitchen')}
            >
              👨‍🍳 Oshpaz
            </button>
          </div>

          <div className="quick-login-cards">
            {activeTab === 'admin' && (
              <div className="credential-card admin-card">
                <div className="credential-header">
                  <span className="role-badge">👔 MENEJER</span>
                </div>
                <div className="credential-body">
                  <p className="credential-label">Foydalanuvchi:</p>
                  <p className="credential-value">admin</p>
                  <p className="credential-label">Parol:</p>
                  <p className="credential-value">admin123</p>
                  <p className="credential-access">📋 To'liq nazorat va konfiguratsiya</p>
                </div>
                <button
                  onClick={() => handleQuickLogin('admin')}
                  disabled={loading}
                  className="btn-quick-login"
                >
                  Menejer sifatida kirish
                </button>
              </div>
            )}

            {activeTab === 'waiter' && (
              <div className="credential-card waiter-card">
                <div className="credential-header">
                  <span className="role-badge">👨‍💼 OFITSIANT</span>
                </div>
                <div className="credential-body">
                  <p className="credential-label">Foydalanuvchi:</p>
                  <p className="credential-value">waiter1</p>
                  <p className="credential-label">Parol:</p>
                  <p className="credential-value">pass123</p>
                  <p className="credential-access">📝 Buyurtmalar va stol boshqarish</p>
                </div>
                <button
                  onClick={() => handleQuickLogin('waiter')}
                  disabled={loading}
                  className="btn-quick-login"
                >
                  Ofitsiant sifatida kirish
                </button>
              </div>
            )}

            {activeTab === 'kitchen' && (
              <div className="credential-card kitchen-card">
                <div className="credential-header">
                  <span className="role-badge">👨‍🍳 OSHPAZ</span>
                </div>
                <div className="credential-body">
                  <p className="credential-label">Foydalanuvchi:</p>
                  <p className="credential-value">kitchen1</p>
                  <p className="credential-label">Parol:</p>
                  <p className="credential-value">pass123</p>
                  <p className="credential-access">🍳 Buyurtmalar va status yangilash</p>
                </div>
                <button
                  onClick={() => handleQuickLogin('kitchen')}
                  disabled={loading}
                  className="btn-quick-login"
                >
                  Oshpaz sifatida kirish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
