import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { io } from 'socket.io-client';
import WaiterTablet from './pages/WaiterTablet';
import KitchenDisplay from './pages/KitchenDisplay';
import ManagerDashboard from './pages/ManagerDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import { uz } from './i18n';
import { User, Settings, Lock, Check, LogOut, Menu, Bell } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({ username: user.username, password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await onUpdate(formData);
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 1500);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: 400}}>
        <div className="modal-header">
           <h3 style={{display: 'flex', alignItems: 'center', gap: 10}}><User size={20} /> Profil Sozlamalari</h3>
           <button onClick={onClose} style={{background: 'transparent', fontSize: '1.5rem', color: 'var(--text-muted)'}}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Foydalanuvchi nomi</label>
              <input className="pf-input" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Yangi Parol</label>
              <input className="pf-input" type="password" placeholder="O'zgartirish uchun kiriting" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>
          <div className="modal-footer" style={{background: 'transparent', borderTop: '1px solid var(--glass-border)'}}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Bekor qilish</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{minWidth: 120}}>
              {success ? <Check size={20} /> : loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SystemNotifications = ({ notifications, onDismiss }) => {
  if (!notifications.length) return null;
  return (
    <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 350 }}>
      {notifications.map(n => (
        <div key={n.id} className="animate-fade glass-panel" style={{ 
          padding: '16px 20px', 
          borderLeft: `4px solid var(--${n.type === 'info' ? 'primary' : n.type})`,
          position: 'relative'
        }}>
          <button onClick={() => onDismiss(n.id)} style={{ position: 'absolute', top: 8, right: 8, background: 'transparent', color: 'var(--text-muted)' }}>&times;</button>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={14} /> {n.title}
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', opacity: 0.9 }}>{n.content}</p>
        </div>
      ))}
    </div>
  );
};


const AppContent = () => {
  const { user, token, login, logout, loading, updateProfile } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user && token) {
      console.log('🔌 Connecting to socket with token:', token ? 'Exists' : 'Missing');
      
      const newSocket = io(window.location.origin, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5
      });

      newSocket.on('connect', () => console.log('✅ Socket connected:', newSocket.id));
      newSocket.on('connect_error', (err) => {
        console.error('❌ Socket connection error:', err.message);
        if (err.message === 'Authentication error: Invalid token') {
           logout();
        }
      });

      newSocket.on('system:notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 10000);
      });

      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [user, token]);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Close sidebar on navigation (tab change) is handled by the dashboards, 
    // but we can ensure it closes when the user changes or logs out.
    setSidebarOpen(false);
  }, [user]);

  if (loading) return <div className="app-container"><p>{uz.common.loading}</p></div>;

  if (!user) return <LoginPage onLogin={login} />;

  return (
    <div className="app-container">
      <header className="header" style={{height: 70, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <button 
            className="mobile-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            <Menu size={24} />
          </button>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', padding: '6px 16px', borderRadius: 99, border: '1px solid var(--glass-border)'}}>
            <User size={16} color="var(--primary)" />
            <span style={{fontWeight: 700, fontSize: '0.9rem'}}>{user.username}</span>
            <span style={{fontSize: '0.7rem', opacity: 0.5, borderLeft: '1px solid var(--glass-border)', paddingLeft: 10}}>{uz.roles[user.role]}</span>
          </div>
          <button className="btn btn-ghost" onClick={() => setProfileOpen(true)} style={{padding: 8, borderRadius: '50%'}}>
            <Settings size={18} />
          </button>
        </div>
        <button className="btn btn-ghost" onClick={logout} style={{padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8}}>
          <LogOut size={16} /> {uz.common.logout}
        </button>
      </header>

      <div className="app-main-content" style={{flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
        {user.role === 'superadmin' && (
          <SuperAdminDashboard 
            socket={socket} 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
          />
        )}
        {user.role === 'manager' && (
          <ManagerDashboard 
            socket={socket} 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
          />
        )}
        {user.role === 'waiter' && <WaiterTablet socket={socket} />}
        {user.role === 'kitchen' && <KitchenDisplay socket={socket} />}
      </div>

      <SystemNotifications 
        notifications={notifications} 
        onDismiss={dismissNotification} 
      />

      <ProfileModal 
        isOpen={profileOpen} 
        onClose={() => setProfileOpen(false)} 
        user={user} 
        onUpdate={updateProfile} 
      />
    </div>
  );
};

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(uz.auth.invalid);
    }
  };

  return (
    <div className="app-container" style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
      <div className="login-card animate-float" style={{textAlign: 'center'}}>
        <div style={{marginBottom: 40}}>
           <h1 className="brand" style={{fontSize: '4rem', color: 'var(--primary)', marginBottom: 8, letterSpacing: '4px', filter: 'drop-shadow(0 0 20px rgba(200, 151, 63, 0.3))'}}>Dasturly</h1>
           <p style={{color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', fontWeight: 700}}>
             {uz.auth.loginSubtitle}
           </p>
        </div>

        {error && (
          <div className="animate-fade" style={{background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: 12, marginBottom: 24, fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: 600}}>
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'left'}}>
          <div className="form-group" style={{marginBottom: 0}}>
            <label style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <User size={14} /> {uz.auth.username}
            </label>
            <input 
              className="pf-input"
              type="text" 
              placeholder="Foydalanuvchi nomini kiriting"
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group" style={{marginBottom: 0}}>
            <label style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <Lock size={14} /> {uz.auth.password}
            </label>
            <input 
              className="pf-input"
              type="password" 
              placeholder="Maxfiy parolni kiriting"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button className="btn btn-primary" style={{marginTop: 16, padding: '18px', fontSize: '1.1rem', borderRadius: 16, fontWeight: 800}} type="submit">
            {uz.auth.loginBtn}
          </button>
        </form>
        
        <div style={{marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', justifyContent: 'center', gap: 24, fontWeight: 600}}>
          <span>© 2026 Dasturly</span>
          <span style={{color: 'var(--primary)', opacity: 0.8}}>Premium Experience</span>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
