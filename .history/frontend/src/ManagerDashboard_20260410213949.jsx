import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './ManagerDashboard.css';

export default function ManagerDashboard({ onLogout }) {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [tables, setTables] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [analyticsRes, menuRes, roomsRes, tablesRes, usersRes] = await Promise.all([
        fetch('http://localhost:3000/api/analytics', { headers }),
        fetch('http://localhost:3000/api/menu', { headers }),
        fetch('http://localhost:3000/api/rooms', { headers }),
        fetch('http://localhost:3000/api/tables', { headers }),
        fetch('http://localhost:3000/api/users', { headers }).catch(() => ({ ok: false }))
      ]);

      if (analyticsRes.ok) {
        setAnalytics(await analyticsRes.json());
      } else {
        setErrorMsg('Failed to load analytics');
      }
      if (menuRes.ok) {
        setMenuItems(await menuRes.json());
      }
      if (roomsRes.ok) {
        setRooms(await roomsRes.json());
      }
      if (tablesRes.ok) {
        setTables(await tablesRes.json());
      }
      if (usersRes && usersRes.ok) {
        setUsers(await usersRes.json());
      } else {
        // users endpoint missing or unauthorized; show empty and set message
        setUsers([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMsg('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="manager-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">🍽️ OSHXONA</h1>
          <p className="dashboard-subtitle">Restaurant Management System</p>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-role-badge">{user?.role?.toUpperCase()}</span>
            <span className="user-name">{user?.name || user?.username}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Chiqish
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-label">Bosh sahifa</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              <span className="nav-icon">🍳</span>
              <span className="nav-label">Menyu</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('rooms')}
            >
              <span className="nav-icon">🏠</span>
              <span className="nav-label">Xonalar</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'tables' ? 'active' : ''}`}
              onClick={() => setActiveTab('tables')}
            >
              <span className="nav-icon">🪑</span>
              <span className="nav-label">Stollar</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-label">Xodimlar</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Yuklanmoqda...</p>
            </div>
          )}

          {!loading && activeTab === 'dashboard' && (
            <div className="dashboard-view">
              <h2>Dashboard</h2>
              <div className="stats-grid">
                {analytics && (
                  <>
                    <div className="stat-card stat-total-orders">
                      <div className="stat-icon">📋</div>
                      <div className="stat-content">
                        <div className="stat-label">Umumiy buyurtmalar</div>
                        <div className="stat-value">{analytics.totalOrders || 0}</div>
                      </div>
                    </div>
                    <div className="stat-card stat-today-orders">
                      <div className="stat-icon">📅</div>
                      <div className="stat-content">
                        <div className="stat-label">Bugun</div>
                        <div className="stat-value">{analytics.ordersToday || 0}</div>
                      </div>
                    </div>
                    <div className="stat-card stat-active-orders">
                      <div className="stat-icon">⏳</div>
                      <div className="stat-content">
                        <div className="stat-label">Faol buyurtmalar</div>
                        <div className="stat-value">{analytics.activeOrders || 0}</div>
                      </div>
                    </div>
                    <div className="stat-card stat-ready-orders">
                      <div className="stat-icon">✅</div>
                      <div className="stat-content">
                        <div className="stat-label">Tayyor</div>
                        <div className="stat-value">{analytics.readyOrders || 0}</div>
                      </div>
                    </div>
                    <div className="stat-card stat-occupied-tables">
                      <div className="stat-icon">🪑</div>
                      <div className="stat-content">
                        <div className="stat-label">Band stollar</div>
                        <div className="stat-value">{analytics.occupiedTables || 0}</div>
                      </div>
                    </div>
                    <div className="stat-card stat-average-price">
                      <div className="stat-icon">💰</div>
                      <div className="stat-content">
                        <div className="stat-label">O'rtacha qiymat</div>
                        <div className="stat-value">{(analytics.averageOrderValue || 0).toFixed(0)} so'm</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {!loading && activeTab === 'menu' && (
            <div className="content-view">
              <div className="view-header">
                <h2>🍳 Menyu boshqarish</h2>
                <button className="btn-add-new">➕ Yangi taom</button>
              </div>
              <div className="items-table">
                <table>
                  <thead>
                    <tr>
                      <th>Taom nomi</th>
                      <th>Kategoriya</th>
                      <th>Narx</th>
                      <th>Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td><span className="category-badge">{item.categoryName}</span></td>
                        <td>{item.price} so'm</td>
                        <td>
                          <button className="btn-action btn-edit">✏️</button>
                          <button className="btn-action btn-delete">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && activeTab === 'rooms' && (
            <div className="content-view">
              <div className="view-header">
                <h2>🏠 Xonalar boshqarish</h2>
                <button className="btn-add-new">➕ Yangi xona</button>
              </div>
              <div className="rooms-grid">
                {rooms.map(room => (
                  <div key={room.id} className="room-card">
                    <div className="room-header">
                      <h3>{room.name}</h3>
                      <span className="room-badge">{room.type}</span>
                    </div>
                    <div className="room-info">
                      <p>📍 Sig'imi: {room.capacity} kishi</p>
                      <p>🪑 Stollar: {room.tableCount || 0}</p>
                      <p>✨ Band: {room.occupiedCount || 0}</p>
                    </div>
                    <div className="room-actions">
                      <button className="btn-action btn-small btn-edit">✏️ Tahrir</button>
                      <button className="btn-action btn-small btn-delete">🗑️ O'chirish</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && activeTab === 'tables' && (
            <div className="content-view">
              <div className="view-header">
                <h2>🪑 Stollar boshqarish</h2>
                <button className="btn-add-new">➕ Yangi stol</button>
              </div>
              <div className="tables-grid">
                {tables.map(table => (
                  <div key={table.id} className={`table-card table-${table.status}`}>
                    <div className="table-number">{table.number}</div>
                    <div className="table-room">{table.roomName}</div>
                    <div className={`table-status status-${table.status}`}>
                      {table.status === 'free' && '🟢 Bo\'sh'}
                      {table.status === 'occupied' && '🔴 Band'}
                      {table.status === 'reserved' && '🟡 Bronlangan'}
                      {table.status === 'cleaning' && '🟣 Tozalash'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && activeTab === 'users' && (
            <div className="content-view">
              <div className="view-header">
                <h2>👥 Xodimlar boshqarish</h2>
                <button className="btn-add-new">➕ Yangi xodim</button>
              </div>
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Ism</th>
                      <th>Login</th>
                      <th>Role</th>
                      <th>Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.username}</td>
                        <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                        <td>
                          <button className="btn-action btn-edit">✏️</button>
                          <button className="btn-action btn-delete">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
