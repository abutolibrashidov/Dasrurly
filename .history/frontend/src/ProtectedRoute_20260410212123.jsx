import React from 'react';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.5em'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3em', marginBottom: '20px' }}>⏳</div>
          <div>Yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowed.includes(user.role)) {
    return null; // Will redirect to login in App
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f56565 0%, #c53030 100%)',
        color: 'white',
        fontSize: '1.2em'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3em', marginBottom: '20px' }}>🚫</div>
          <div>Kirishga ruxsat yo'q</div>
        </div>
      </div>
    );
  }

  return children;
}
