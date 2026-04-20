import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line
} from 'recharts';
import { 
  Users, Store, TrendingUp, AlertTriangle, MessageSquare, 
  Settings, Power, Edit3, Plus, Bell, RefreshCw, DollarSign
} from 'lucide-react';

const SuperAdminDashboard = ({ socket, sidebarOpen, setSidebarOpen }) => {
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    activeRestaurants: 0,
    totalUsers: 0,
    totalTurnover: 0
  });
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [broadcastMessage, setBroadcastMessage] = useState({ title: '', content: '', type: 'info' });
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({ name: '', managerUsername: '', password: '' });
  const [creating, setCreating] = useState(false);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, restNames] = await Promise.all([
        fetch('/api/superadmin/stats', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/superadmin/restaurants', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);
      
      const statsData = await statsRes.json();
      const restData = await restNames.json();
      
      setStats(statsData);
      setRestaurants(restData);
    } catch (error) {
      console.error('Error fetching superadmin data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleStatus = async (id) => {
    try {
      await fetch(`/api/superadmin/restaurants/${id}/toggle-status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchData();
    } catch (error) {
      alert('Xatolik yuz berdi');
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await fetch('/api/superadmin/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newRestaurant)
      });

      if (!res.ok) throw new Error('Yaratishda xatolik');

      setNewRestaurant({ name: '', managerUsername: '', password: '' });
      setShowCreateModal(false);
      fetchData();
      alert('Restoran va menejer muvaffaqiyatli yaratildi');
    } catch (error) {
      alert(error.message);
    } finally {
      setCreating(false);
    }
  };

  const sendBroadcast = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/superadmin/notifications/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(broadcastMessage)
      });
      setBroadcastMessage({ title: '', content: '', type: 'info' });
      alert('Xabar muvaffaqiyatli yuborildi');
    } catch (error) {
      alert('Yuborishda xatolik');
    }
  };

  const fmt = (num) => new Intl.NumberFormat('uz-UZ').format(num);

  if (loading) return <div className="loading-overlay">Yuklanmoqda...</div>;

  const tabs = [
    { id: 'overview', label: 'Restoranlar', icon: <Store size={20} /> },
    { id: 'broadcast', label: 'Xabarnoma', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="app-container" style={{ flexDirection: 'row' }}>
      {/* Sidebar Backdrop (Mobile only) */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={sidebarOpen ? 'sidebar-open' : ''} style={{
        width: 280,
        background: 'var(--bg-dark)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 0',
        flexShrink: 0,
      }}>
        <div style={{ padding: '0 32px 32px', borderBottom: '1px solid var(--glass-border)' }}>
          <h1 className="brand" style={{ color: 'var(--primary)', fontSize: '1.8rem', letterSpacing: '2px' }}>
            Dasturly
          </h1>
          <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: 4 }}>
            SaaS Control Panel
          </p>
        </div>

        <nav style={{ flex: 1, padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 20px',
                background: activeTab === tab.id ? 'rgba(200, 151, 63, 0.12)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                textAlign: 'left',
                borderRadius: 10,
                border: activeTab === tab.id ? '1px solid rgba(200,151,63,0.2)' : '1px solid transparent',
                transition: 'all 0.15s',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <span style={{ opacity: activeTab === tab.id ? 1 : 0.6, flexShrink: 0 }}>{tab.icon}</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '40px 56px', background: 'var(--bg-dark-950)' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: 8 }}>SAAS Boshqaruv Paneli</h1>
            <p style={{ color: 'var(--text-muted)' }}>Butun tizim holati va restoranlarni boshqarish</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)} style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={18} /> Yangi Restoran
            </button>
            <button className="btn btn-secondary" onClick={fetchData} style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', color: 'white' }}>
              <RefreshCw size={18} /> Yangilash
            </button>
          </div>
        </header>

        {/* Global Stats */}
        <div className="stats-grid" style={{ marginBottom: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          <StatCard title="Jami Restoranlar" value={stats.totalRestaurants} icon={<Store color="var(--primary)" />} />
          <StatCard title="Faol Restoranlar" value={stats.activeRestaurants} icon={<TrendingUp color="var(--success)" />} />
          <StatCard title="Jami Foydalanuvchilar" value={stats.totalUsers} icon={<Users color="var(--primary)" />} />
          <StatCard title="Umumiy Oborot" value={`${fmt(stats.totalTurnover)} so'm`} icon={<DollarSign color="var(--warning)" />} />
        </div>

      {/* Main Content Tabs */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, borderBottom: '1px solid var(--glass-border)' }}>
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Restoranlar" />
        <TabButton active={activeTab === 'broadcast'} onClick={() => setActiveTab('broadcast')} label="Xabarnoma yuborish" />
      </div>

      {activeTab === 'overview' && (
        <div className="glass-panel animate-fade" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
              <tr>
                <th style={{ padding: 20, color: 'var(--text-muted)' }}>Restoran Nomi</th>
                <th style={{ padding: 20, color: 'var(--text-muted)' }}>Ro'yxatdan o'tgan</th>
                <th style={{ padding: 20, color: 'var(--text-muted)' }}>Obuna Holati</th>
                <th style={{ padding: 20, color: 'var(--text-muted)' }}>Buyurtmalar</th>
                <th style={{ padding: 20, color: 'var(--text-muted)' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                  <td style={{ padding: 20, fontWeight: 700 }}>{r.name}</td>
                  <td style={{ padding: 20, fontSize: '0.9rem' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: 20 }}>
                    <span className={`status-badge ${r.isActive ? 'READY' : 'NEW'}`}>
                      {r.isActive ? 'Faol' : 'To\'xtatilgan'}
                    </span>
                  </td>
                  <td style={{ padding: 20 }}>{r._count.orders} ta</td>
                  <td style={{ padding: 20 }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={() => toggleStatus(r.id)} style={{ 
                        padding: '8px 16px', 
                        borderRadius: 8, 
                        background: r.isActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: r.isActive ? 'var(--danger)' : 'var(--success)',
                        fontSize: '0.8rem',
                        fontWeight: 700
                      }}>
                        {r.isActive ? 'To\'xtatish' : 'Tiklash'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'broadcast' && (
        <div className="glass-panel animate-fade" style={{ maxWidth: 600, padding: 32 }}>
          <h3 style={{ marginBottom: 24, fontSize: '1.25rem' }}>Tizim bo'ylab xabar yuborish</h3>
          <form onSubmit={sendBroadcast}>
            <div className="form-group">
              <label>Sarlavha</label>
              <input 
                className="pf-input" 
                value={broadcastMessage.title} 
                onChange={e => setBroadcastMessage({...broadcastMessage, title: e.target.value})}
                placeholder="Masalan: Tizim yangilanishi"
                required
              />
            </div>
            <div className="form-group">
              <label>Xabar Matni</label>
              <textarea 
                className="pf-input" 
                style={{ height: 120, resize: 'none' }}
                value={broadcastMessage.content} 
                onChange={e => setBroadcastMessage({...broadcastMessage, content: e.target.value})}
                placeholder="Xabar tafsilotlarini yozing..."
                required
              />
            </div>
            <div className="form-group">
              <label>Xabar Turi</label>
              <select 
                className="pf-input"
                value={broadcastMessage.type}
                onChange={e => setBroadcastMessage({...broadcastMessage, type: e.target.value})}
              >
                <option value="info">Ma'lumot (Info)</option>
                <option value="warning">Ogohlantirish (Warning)</option>
                <option value="success">Muvaffaqiyat (Success)</option>
                <option value="error">Muhim/Xato (Error)</option>
              </select>
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: 16 }}>
              Barchaga yuborish
            </button>
          </form>
        </div>
      )}
      </main>

      {/* ── Create Restaurant Modal ── */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
          padding: 20
        }}>
          <div className="glass-panel animate-float" style={{ maxWidth: 440, width: '100%', padding: 40, position: 'relative' }}>
            <h2 style={{ color: 'var(--primary)', marginBottom: 8 }}>Yangi Restoran</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 32 }}>Tizimga yangi mijozni qo'shish</p>
            
            <form onSubmit={handleCreateRestaurant}>
              <div className="form-group">
                <label>Restoran Nomi</label>
                <input 
                  className="pf-input" 
                  required
                  value={newRestaurant.name}
                  onChange={e => setNewRestaurant({...newRestaurant, name: e.target.value})}
                  placeholder="Masalan: Rayhon City"
                />
              </div>

              <div style={{ height: 1, background: 'var(--glass-border)', margin: '24px 0' }} />
              <p style={{ fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16, fontWeight: 700 }}>
                Bosh Menejer Akkaunti
              </p>

              <div className="form-group">
                <label>Login (Username)</label>
                <input 
                  className="pf-input" 
                  required
                  value={newRestaurant.managerUsername}
                  onChange={e => setNewRestaurant({...newRestaurant, managerUsername: e.target.value})}
                  placeholder="manager123"
                />
              </div>
              <div className="form-group">
                <label>Parol</label>
                <input 
                  type="password"
                  className="pf-input" 
                  required
                  value={newRestaurant.password}
                  onChange={e => setNewRestaurant({...newRestaurant, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={() => setShowCreateModal(false)}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white' }}
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={creating}
                  style={{ flex: 2 }}
                >
                  {creating ? 'Yaratilmoqda...' : 'Restoranni Ochish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="glass-panel" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>{title}</p>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{value}</h3>
    </div>
  </div>
);

const TabButton = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    style={{
      padding: '12px 24px',
      background: 'transparent',
      color: active ? 'var(--primary)' : 'var(--text-muted)',
      borderBottom: `2px solid ${active ? 'var(--primary)' : 'transparent'}`,
      borderRadius: 0,
      fontWeight: 700
    }}
  >
    {label}
  </button>
);

export default SuperAdminDashboard;
