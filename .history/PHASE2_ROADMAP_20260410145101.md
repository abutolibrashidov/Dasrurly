# 🚀 PHASE 2: FRONTEND INTEGRATION ROADMAP

## Current Status
- ✅ Backend: Running on http://localhost:3000
- ✅ Frontend: Running on http://localhost:5173
- ✅ Database: Configured with test data
- ✅ APIs: 40+ endpoints ready
- ✅ Auth: JWT system ready
- 🟡 Frontend integration: READY TO START

---

## What Frontend Needs

### 1. Login System
```javascript
// API Call
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Admin",
    "role": "manager"
  }
}

// Store in localStorage
localStorage.setItem('token', response.token);
localStorage.setItem('user', JSON.stringify(response.user));
```

### 2. Role-Based Routing
```javascript
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ role, children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to="/unauthorized" />;
  
  return children;
};

// Routes
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/manager" element={<ProtectedRoute role="manager"><ManagerPanel /></ProtectedRoute>} />
  <Route path="/waiter" element={<ProtectedRoute role="waiter"><WaiterPanel /></ProtectedRoute>} />
  <Route path="/kitchen" element={<ProtectedRoute role="kitchen"><KitchenPanel /></ProtectedRoute>} />
</Routes>
```

### 3. API Integration Pattern
```javascript
// Add token to all API calls
const API_BASE = 'http://localhost:3000/api';
const getToken = () => localStorage.getItem('token');

const apiCall = async (endpoint, method = 'GET', body = null) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
  
  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);
  
  const response = await fetch(`${API_BASE}${endpoint}`, config);
  if (!response.ok) throw new Error('API error');
  return response.json();
};

// Usage
const rooms = await apiCall('/rooms');
const orders = await apiCall('/orders', 'GET');
await apiCall('/orders', 'POST', { tableId: 1, items: [...] });
```

---

## 3-Part Implementation Plan

### PART 1: Login Page (30 minutes)
Files to create/update:
```
frontend/src/
├── pages/
│   └── LoginPage.jsx         ← NEW
├── App.jsx                   ← Update with routing
├── App.css                   ← Add login styles
└── i18n.js                   ← Add login translations
```

**What it does:**
- Username/password input
- Role selection (for dev testing)
- Call `/api/auth/login`
- Store JWT token
- Redirect to appropriate panel

**Test credentials:**
```
admin / admin123 (manager)
waiter1 / pass123 (waiter)
kitchen1 / pass123 (kitchen)
```

### PART 2: Role-Based Routing (20 minutes)
Update:
```
frontend/src/App.jsx
  ├─ Add React Router
  ├─ Create ProtectedRoute component
  ├─ Add route guards
  └─ Redirect logic
```

**Routes:**
```
/ or /login              → LoginPage
/manager                 → ManagerPanel (manager only)
/waiter                  → WaiterPanel (waiter only)
/kitchen                 → KitchenPanel (kitchen only)
/logout                  → Clear localStorage, redirect to login
```

### PART 3: API Integration (1-2 hours)
Update existing components:
```
WaiterPanel.jsx
  ├─ Use /api/tables (instead of hardcoded)
  ├─ Use /api/menu (instead of hardcoded)
  ├─ POST /api/orders (instead of mock)
  └─ Get JWT token from localStorage

KitchenPanel.jsx
  ├─ Use /api/orders (instead of mock)
  ├─ PUT /api/orders/:id/status (instead of mock)
  └─ Listen for Socket.io events with auth

ManagerPanel.jsx (NEW)
  ├─ Menu Manager (CRUD)
  ├─ Room Manager (CRUD)
  ├─ Table Manager (CRUD)
  └─ Analytics Dashboard
```

---

## PART 1: Login Page Code

Create `frontend/src/pages/LoginPage.jsx`:

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('waiter'); // for dev
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const { token, user } = await response.json();
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🍽️ OSHXONA</h1>
        <h2>Tizimga kirish</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Foydalanuvchi nomi"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Yuklanmoqda...' : 'Kirish'}
          </button>
        </form>

        <div className="test-credentials">
          <p><strong>Test hisoblar:</strong></p>
          <p>📋 Manager: admin / admin123</p>
          <p>🧑‍💼 Ofitsiant: waiter1 / pass123</p>
          <p>👨‍🍳 Oshxona: kitchen1 / pass123</p>
        </div>
      </div>
    </div>
  );
}
```

Create `frontend/src/styles/LoginPage.css`:

```css
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
}

.login-box h1 {
  text-align: center;
  font-size: 48px;
  margin-bottom: 10px;
}

.login-box h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.login-box form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.login-box input {
  padding: 12px;
  border: 2px solid #eee;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.login-box input:focus {
  outline: none;
  border-color: #667eea;
}

.login-box button {
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.login-box button:hover:not(:disabled) {
  background: #5568d3;
}

.login-box button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
  text-align: center;
}

.test-credentials {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.8;
}

.test-credentials p {
  margin: 5px 0;
}

.test-credentials strong {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
}
```

---

## PART 2: Update App.jsx with Routing

Update `frontend/src/App.jsx`:

```javascript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import WaiterPanel from './WaiterPanel';
import KitchenPanel from './KitchenPanel';
import ManagerPanel from './ManagerPanel';

// Protected Route Component
function ProtectedRoute({ role, children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== role) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route 
          path="/manager/*" 
          element={
            <ProtectedRoute role="manager">
              <ManagerPanel />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/waiter/*" 
          element={
            <ProtectedRoute role="waiter">
              <WaiterPanel />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/kitchen/*" 
          element={
            <ProtectedRoute role="kitchen">
              <KitchenPanel />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
```

---

## PART 3: Update WaiterPanel to Use APIs

Key changes needed:

```javascript
// Before: hardcoded menu
const [menuItems, setMenuItems] = useState([...]);

// After: fetch from API
useEffect(() => {
  const fetchMenu = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/menu', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const menu = await response.json();
    setMenuItems(menu);
  };
  fetchMenu();
}, []);

// Before: create order locally
const handleSubmit = () => {
  setOrders([...orders, newOrder]);
};

// After: POST to API
const handleSubmit = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      tableId: selectedTable,
      items: selectedItems
    })
  });
  const result = await response.json();
  // Show success message
};
```

---

## Installation Steps

### Step 1: Install React Router
```bash
cd frontend
npm install react-router-dom
```

### Step 2: Create LoginPage files
Create the files shown above

### Step 3: Update App.jsx
Replace current App.jsx with the Router version

### Step 4: Update API calls
Modify WaiterPanel, KitchenPanel, etc.

### Step 5: Test
```bash
npm run dev
# Visit http://localhost:5173/login
# Login with: admin / admin123
```

---

## Testing Checklist

- [ ] Login works with correct credentials
- [ ] Login fails with wrong credentials
- [ ] JWT token stored in localStorage
- [ ] Waiter can see waiter panel
- [ ] Kitchen can see kitchen panel
- [ ] Manager can see manager panel
- [ ] Other roles see "Unauthorized"
- [ ] Logout clears token and redirects to login
- [ ] Menu loads from API (not hardcoded)
- [ ] Orders POST to /api/orders (not local)
- [ ] Kitchen receives orders in real-time
- [ ] Status updates work (kitchen → waiter)
- [ ] Notifications work (waiter gets alerts)

---

## Expected Timeline

| Task | Time |
|------|------|
| Install dependencies | 2 min |
| Create LoginPage | 15 min |
| Update App.jsx routing | 15 min |
| Update WaiterPanel APIs | 30 min |
| Update KitchenPanel APIs | 30 min |
| Create ManagerPanel (basic) | 60 min |
| Testing & debugging | 30 min |
| **TOTAL** | **3 hours** |

---

## Decision Needed

**Which parts should I implement now?**

```
Option A: Just Login + Routing (safest, fastest)
  ✅ 30-40 minutes
  ✅ Keep existing panels working
  ✅ Add APIs incrementally later
  
Option B: Login + Full API Integration (complete)
  ✅ 2-3 hours
  ✅ Professional system immediately
  ✅ Ready for manager to use
  
Option C: Login + Routing + Manager Dashboard (most)
  ✅ 4-5 hours
  ✅ Full SaaS-ready system
  ✅ Managers can configure everything
  
Option D: You tell me what you want
  👂 Just let me know!
```

---

**Status**: Ready for Phase 2 implementation
**Recommendation**: Go with Option B or C (complete integration)
**Your Call**: What should I build first?

Let me know! 🚀
