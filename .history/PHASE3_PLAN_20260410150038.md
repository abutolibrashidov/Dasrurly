# 🎯 PHASE 3 PLAN: Frontend Integration & Manager Dashboard

## 📋 Overview

We have a professional backend. Now we need to:
1. Add **Login page** to the frontend
2. Add **Role-based routing** 
3. Build **Manager Dashboard**
4. Integrate all 3 roles into a single app

---

## 🏗️ Frontend Architecture (Phase 3)

```
frontend/src/
├── pages/
│   ├── LoginPage.jsx            ← NEW: Login form
│   ├── WaiterPage.jsx           ← Existing WaiterPanel
│   ├── KitchenPage.jsx          ← Existing KitchenPanel
│   └── ManagerPage.jsx          ← NEW: Manager Dashboard
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx        ← NEW: Login UI
│   │   └── ProtectedRoute.jsx   ← NEW: Route guard
│   │
│   ├── manager/                 ← NEW: Manager sub-components
│   │   ├── MenuManager.jsx
│   │   ├── RoomManager.jsx
│   │   ├── TableManager.jsx
│   │   ├── AnalyticsDashboard.jsx
│   │   └── StaffManager.jsx
│   │
│   ├── layouts/                 ← NEW: Role-specific layouts
│   │   ├── ManagerLayout.jsx
│   │   ├── WaiterLayout.jsx
│   │   └── KitchenLayout.jsx
│   │
│   └── common/                  ← NEW: Shared components
│       ├── Header.jsx
│       ├── Sidebar.jsx
│       └── Logout.jsx
│
├── services/                    ← NEW: API calls
│   ├── api.js                   ← Axios with JWT
│   ├── authService.js
│   ├── menuService.js
│   ├── roomService.js
│   ├── tableService.js
│   ├── orderService.js
│   └── analyticsService.js
│
├── hooks/                       ← NEW: Custom hooks
│   ├── useAuth.js               ← Auth state management
│   ├── useMenu.js
│   ├── useOrders.js
│   └── useAnalytics.js
│
├── context/                     ← NEW: Global state
│   └── AuthContext.jsx
│
├── App.jsx                      ← MODIFIED: Add routes
├── App.css                      ← Extend: Add manager styles
└── main.jsx
```

---

## 🔄 Implementation Flow

### Step 1: Create Auth Context & Hooks

**`src/context/AuthContext.jsx`**
```javascript
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if token exists on load
    if (token) {
      validateToken(token);
    }
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Step 2: Create Protected Route

**`src/components/auth/ProtectedRoute.jsx`**
```javascript
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export function ProtectedRoute({ children, requiredRole }) {
  const { user, token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
}
```

### Step 3: Create Login Page

**`src/pages/LoginPage.jsx`**
```javascript
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Login.css';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Noto\'g\'ri foydalanuvchi nomi yoki parol');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🍽️ OSHXONA</h1>
        <h2>Kirish</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Foydalanuvchi nomi</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin / waiter1 / kitchen1"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parolni kiriting"
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Kuting...' : 'Kirish'}
          </button>
        </form>

        <div className="test-users">
          <p>Test foydalanuvchilari:</p>
          <ul>
            <li>Manager: admin / admin123</li>
            <li>Waiter: waiter1 / pass123</li>
            <li>Kitchen: kitchen1 / pass123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Create Manager Dashboard

**`src/pages/ManagerPage.jsx`**
```javascript
import React, { useState } from 'react';
import MenuManager from '../components/manager/MenuManager';
import RoomManager from '../components/manager/RoomManager';
import TableManager from '../components/manager/TableManager';
import AnalyticsDashboard from '../components/manager/AnalyticsDashboard';
import StaffManager from '../components/manager/StaffManager';
import '../styles/Manager.css';

export function ManagerPage() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="manager-page">
      <header className="manager-header">
        <h1>🍽️ Restoran Boshqaruvi</h1>
      </header>

      <nav className="manager-nav">
        <button 
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Statistika
        </button>
        <button 
          className={activeTab === 'menu' ? 'active' : ''}
          onClick={() => setActiveTab('menu')}
        >
          🍜 Menyu
        </button>
        <button 
          className={activeTab === 'rooms' ? 'active' : ''}
          onClick={() => setActiveTab('rooms')}
        >
          🏠 Xonalar
        </button>
        <button 
          className={activeTab === 'tables' ? 'active' : ''}
          onClick={() => setActiveTab('tables')}
        >
          🪑 Stollar
        </button>
        <button 
          className={activeTab === 'staff' ? 'active' : ''}
          onClick={() => setActiveTab('staff')}
        >
          👥 Xodimlar
        </button>
      </nav>

      <main className="manager-content">
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'menu' && <MenuManager />}
        {activeTab === 'rooms' && <RoomManager />}
        {activeTab === 'tables' && <TableManager />}
        {activeTab === 'staff' && <StaffManager />}
      </main>
    </div>
  );
}
```

### Step 5: Update App.jsx with Routing

**`src/App.jsx` (Updated)**
```javascript
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ManagerPage from './pages/ManagerPage';
import WaiterPage from './pages/WaiterPage';
import KitchenPage from './pages/KitchenPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/manager"
            element={
              <ProtectedRoute requiredRole="manager">
                <ManagerPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/waiter"
            element={
              <ProtectedRoute requiredRole="waiter">
                <WaiterPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/kitchen"
            element={
              <ProtectedRoute requiredRole="kitchen">
                <KitchenPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

---

## 🧩 Manager Dashboard Sub-Components

### 1. MenuManager Component
```
- List all menu items
- Add new item (form)
- Edit price/details
- Delete item
- Disable/enable items
```

### 2. RoomManager Component
```
- List all rooms
- Add new room
- Edit room details
- Delete room
- Show table count + occupancy
```

### 3. TableManager Component
```
- List all tables by room
- Add new table
- Edit table capacity
- Delete table
- Show current status
```

### 4. AnalyticsDashboard Component
```
- Total orders today
- Active orders count
- Ready orders count
- Occupied tables
- Average order value
- Real-time charts
```

### 5. StaffManager Component
```
- List all staff
- Add new staff member
- Assign role
- Show activity status
```

---

## 📦 Required npm Packages

```bash
npm install react-router-dom axios
```

---

## 🎨 Styling Approach

1. **Keep existing**: `App.css` (for Waiter/Kitchen panels)
2. **Add new**: `Manager.css` for manager dashboard
3. **Add new**: `Login.css` for login page
4. **Theme**: Keep Uzbek color scheme + professional UI

---

## 🔄 Data Flow

```
User Login
    ↓
AuthContext stores token + user
    ↓
Route validation (ProtectedRoute)
    ↓
Role-specific page loads
    ↓
Component fetches data via API with JWT
    ↓
Display data
    ↓
Real-time updates via Socket.io
```

---

## ✅ Completion Checklist

- [ ] Install react-router-dom + axios
- [ ] Create AuthContext
- [ ] Create ProtectedRoute
- [ ] Create LoginPage
- [ ] Create ManagerPage wrapper
- [ ] Create MenuManager component
- [ ] Create RoomManager component
- [ ] Create TableManager component
- [ ] Create AnalyticsDashboard component
- [ ] Create StaffManager component
- [ ] Update App.jsx with routing
- [ ] Add API service layer
- [ ] Add styling for all new pages
- [ ] Test full workflow
- [ ] Ensure Socket.io still works
- [ ] Verify existing waiter/kitchen panels unchanged

---

## 🎯 Success Criteria

```
✅ User can login with any role
✅ Routes are protected by role
✅ Manager can configure menu/rooms/tables
✅ Manager can see analytics
✅ Waiter can create orders
✅ Kitchen can see orders and update status
✅ All panels communicate via Socket.io
✅ Logout clears token
✅ 100% Uzbek UI
✅ Professional appearance
```

---

## 📊 Timeline Estimate

- **MenuManager**: 30 min
- **RoomManager**: 30 min
- **TableManager**: 30 min
- **AnalyticsDashboard**: 30 min
- **StaffManager**: 20 min
- **Login + Auth**: 30 min
- **Routing + Integration**: 30 min
- **Styling + Polish**: 30 min
- **Testing**: 30 min

**Total**: ~4 hours for complete Phase 3

---

## 🚀 Ready?

Once you approve, I'll implement all of Phase 3 systematically!
