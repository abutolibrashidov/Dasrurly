import React, { useState, useEffect, useCallback } from 'react';
import AnalyticsDashboard from './AnalyticsDashboard';
import { useAuth } from '../AuthContext';
import api from '../api/axios';
import { uz } from '../i18n';
import {
  LayoutDashboard,
  ChefHat,
  Home,
  Armchair,
  Users,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  ClipboardList,
  TrendingUp,
  UserCheck,
  X,
  Check,
  AlertCircle,
  RefreshCw,
  CreditCard,
} from 'lucide-react';

// ─── Reusable Modal ───────────────────────────────────────────────────────────
const Modal = ({ isOpen, onClose, title, children, onConfirm, confirmLabel, loading }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ zIndex: 1000 }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 480, width: '90%' }}
      >
        <div className="modal-header">
          <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: 'var(--text-muted)', lineHeight: 1 }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: '10px 20px' }}>
            {uz.common.cancel}
          </button>
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={loading}
            style={{ padding: '10px 28px', minWidth: 100 }}
          >
            {loading ? <RefreshCw size={16} className="spin" /> : (confirmLabel || uz.common.save)}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Toast notification ───────────────────────────────────────────────────────
const Toast = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const colors = {
    success: 'var(--success)',
    error: 'var(--danger)',
    info: 'var(--primary)',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        background: 'var(--bg-card)',
        border: `1px solid ${colors[type] || colors.info}`,
        borderLeft: `4px solid ${colors[type] || colors.info}`,
        borderRadius: 12,
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        zIndex: 9999,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.2s ease',
        maxWidth: 320,
      }}
    >
      {type === 'error' ? <AlertCircle size={18} color={colors.error} /> : <Check size={18} color={colors.success} />}
      <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', flex: 1 }}>{message}</span>
      <button onClick={onDismiss} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
        <X size={14} />
      </button>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const ManagerDashboard = ({ socket, sidebarOpen, setSidebarOpen }) => {
  const { logout, impersonate, stopImpersonation, isImpersonating } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  };

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const tabs = [
    { id: 'dashboard', label: uz.manager.dashboard, icon: <LayoutDashboard size={20} /> },
    { id: 'menu',      label: uz.manager.menu,      icon: <ChefHat size={20} /> },
    { id: 'rooms',     label: uz.manager.rooms,      icon: <Home size={20} /> },
    { id: 'tables',    label: uz.manager.tables,     icon: <Armchair size={20} /> },
    { id: 'users',     label: uz.manager.users,      icon: <Users size={20} /> },
    { id: 'finance',   label: uz.manager.finance,    icon: <CreditCard size={20} /> },
  ];

  return (
    <div className="app-container" style={{ flexDirection: 'row' }}>
      {/* Mobile Toggle Button (Visible on mobile via CSS) */}
      <div className="mobile-header-addons" style={{ display: 'none' }}> {/* This will be handled by the global header usually, but if not, we add it back */}
      </div>

      {/* ── Sidebar Backdrop (Mobile only) ── */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
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
            {uz.auth?.loginSubtitle || 'Restaurant OS'}
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

        <div style={{ padding: '24px 12px', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {isImpersonating && (
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', background: 'var(--warning)', color: '#000', borderRadius: 10 }}
              onClick={stopImpersonation}
            >
              ← Admin ga qaytish
            </button>
          )}
          <button
            className="btn btn-ghost"
            style={{ width: '100%', padding: '12px', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onClick={logout}
          >
            <LogOut size={16} /> {uz.common.logout}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '40px 56px', background: 'var(--bg-dark-950)' }}>
        {activeTab === 'dashboard' && <AnalyticsDashboard socket={socket} />}
        {activeTab === 'menu'   && <MenuManagement showToast={showToast} />}
        {activeTab === 'rooms'  && <RoomManagement showToast={showToast} />}
        {activeTab === 'tables' && <TableManagement showToast={showToast} />}
        {activeTab === 'users'  && <UserManagement impersonate={impersonate} showToast={showToast} />}
        {activeTab === 'finance' && <ExpenseManagement showToast={showToast} />}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
};


// ─── User Management ──────────────────────────────────────────────────────────
const UserManagement = ({ impersonate, showToast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState({ open: false, user: null });
  const [formData, setFormData] = useState({ username: '', password: '', role: 'waiter' });
  const [formError, setFormError] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data);
    } catch {
      showToast("Foydalanuvchilarni yuklashda xatolik", 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openForm = (user = null) => {
    setFormError('');
    setModal({ open: true, user });
    setFormData(user
      ? { username: user.username, role: user.role, password: '' }
      : { username: '', password: '', role: 'waiter' }
    );
  };

  const handleSave = async () => {
    setFormError('');
    if (!formData.username.trim()) { setFormError("Foydalanuvchi nomi kiritilishi shart"); return; }
    if (!modal.user && !formData.password) { setFormError("Yangi foydalanuvchi uchun parol kiritilishi shart"); return; }

    setSaving(true);
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password; // Don't send empty password on edit

      if (modal.user) {
        await api.put(`/users/${modal.user.id}`, payload);
        showToast("Foydalanuvchi yangilandi");
      } else {
        await api.post('/users', payload);
        showToast("Foydalanuvchi qo'shildi");
      }
      setModal({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Xatolik yuz berdi';
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`"${username}" ni o'chirmoqchimisiz?`)) return;
    try {
      await api.delete(`/users/${id}`);
      showToast("Foydalanuvchi o'chirildi");
      fetchUsers();
    } catch {
      showToast("O'chirishda xatolik", 'error');
    }
  };

  const roleEmoji = { manager: '👑', waiter: '🏃', kitchen: '👨‍🍳' };
  const roleColor = { manager: 'var(--primary)', waiter: 'var(--success)', kitchen: 'var(--warning)' };

  return (
    <div className="animate-fade">
      <div className="mgmt-header">
        <h2 style={{ fontSize: '2rem', fontFamily: 'Playfair Display' }}>{uz.manager.users}</h2>
        <button className="btn btn-primary" onClick={() => openForm()} style={{ padding: '10px 24px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> {uz.manager.addUser}
        </button>
      </div>

      {loading ? <LoadingGrid /> : (
        <div className="mgmt-grid">
          {users.map(u => (
            <div
              key={u.id}
              className="table-card"
              style={{
                flexDirection: 'row',
                padding: '24px 28px',
                gap: 20,
                justifyContent: 'flex-start',
                height: 'auto',
                borderLeft: `3px solid ${roleColor[u.role] || 'var(--primary)'}`,
                borderBottom: 'none',
              }}
            >
              <div style={{
                width: 48, height: 48,
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem', flexShrink: 0,
              }}>
                {roleEmoji[u.role] || '👤'}
              </div>
              <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.username}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 2 }}>
                  {uz.roles?.[u.role] || u.role}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {u.role !== 'manager' && (
                  <button
                    className="btn btn-ghost"
                    onClick={() => impersonate(u.id)}
                    style={{ padding: 8 }}
                    title="Impersonate"
                  >
                    <UserCheck size={16} />
                  </button>
                )}
                <button className="btn btn-ghost" onClick={() => openForm(u)} style={{ padding: 8 }} title={uz.common.edit}>
                  <Pencil size={16} />
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleDelete(u.id, u.username)}
                  style={{ padding: 8, color: 'var(--danger)' }}
                  title={uz.common.delete}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, user: null })}
        title={modal.user ? "Foydalanuvchini tahrirlash" : uz.manager.addUser}
        onConfirm={handleSave}
        loading={saving}
      >
        {formError && <ErrorBanner message={formError} />}
        <div className="form-group">
          <label>{uz.auth.username}</label>
          <input
            className="pf-input"
            value={formData.username}
            onChange={e => setFormData({ ...formData, username: e.target.value })}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label>{uz.auth.password}</label>
          <input
            className="pf-input"
            type="password"
            placeholder={modal.user ? "(O'zgartirmaslik uchun bo'sh qoldiring)" : ''}
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>{uz.manager.role}</label>
          <select
            className="pf-input"
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="waiter">{uz.roles?.waiter || 'Ofitsiant'}</option>
            <option value="kitchen">{uz.roles?.kitchen || 'Oshpaz'}</option>
            <option value="manager">{uz.roles?.manager || 'Menejer'}</option>
          </select>
        </div>
      </Modal>
    </div>
  );
};

// ─── Room Management ──────────────────────────────────────────────────────────
const RoomManagement = ({ showToast }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState({ open: false, room: null });
  const [formData, setFormData] = useState({ name: '' });
  const [formError, setFormError] = useState('');

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/rooms');
      setRooms(res.data);
    } catch {
      showToast("Xonalarni yuklashda xatolik", 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleSave = async () => {
    setFormError('');
    if (!formData.name.trim()) { setFormError("Xona nomi kiritilishi shart"); return; }
    setSaving(true);
    try {
      if (modal.room) {
        await api.put(`/rooms/${modal.room.id}`, formData);
        showToast("Xona yangilandi");
      } else {
        await api.post('/rooms', formData);
        showToast("Xona qo'shildi");
      }
      setModal({ open: false, room: null });
      fetchRooms();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`"${name}" xonasini o'chirmoqchimisiz?`)) return;
    try {
      await api.delete(`/rooms/${id}`);
      showToast("Xona o'chirildi");
      fetchRooms();
    } catch (err) {
      showToast(err.response?.data?.error || "O'chirishda xatolik", 'error');
    }
  };

  return (
    <div className="animate-fade">
      <div className="mgmt-header">
        <h2 style={{ fontSize: '2rem', fontFamily: 'Playfair Display' }}>{uz.manager.rooms}</h2>
        <button
          className="btn btn-primary"
          onClick={() => { setFormError(''); setModal({ open: true, room: null }); setFormData({ name: '' }); }}
          style={{ padding: '10px 24px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Plus size={18} /> {uz.manager.addRoom}
        </button>
      </div>

      {loading ? <LoadingGrid /> : (
        <div className="mgmt-grid">
          {rooms.length === 0 && <EmptyState message="Hali xonalar yo'q" />}
          {rooms.map(room => (
            <div
              key={room.id}
              className="table-card"
              style={{ padding: 28, textAlign: 'left', alignItems: 'flex-start', justifyContent: 'space-between', height: 'auto' }}
            >
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, marginBottom: 8 }}>
                  xona
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: 6, color: 'var(--text-main)' }}>{room.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {room.tables?.length || 0} ta {uz.manager.tables?.toLowerCase() || 'stol'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 20, width: '100%' }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => { setFormError(''); setModal({ open: true, room }); setFormData({ name: room.name }); }}
                  style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Pencil size={15} /> {uz.common.edit}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleDelete(room.id, room.name)}
                  style={{ flex: 1, padding: '10px', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Trash2 size={15} /> {uz.common.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, room: null })}
        title={modal.room ? "Xonani tahrirlash" : uz.manager.addRoom}
        onConfirm={handleSave}
        loading={saving}
      >
        {formError && <ErrorBanner message={formError} />}
        <div className="form-group">
          <label>{uz.common.name}</label>
          <input
            className="pf-input"
            value={formData.name}
            onChange={e => setFormData({ name: e.target.value })}
            autoFocus
          />
        </div>
      </Modal>
    </div>
  );
};

// ─── Table Management ─────────────────────────────────────────────────────────
const TableManagement = ({ showToast }) => {
  const [tables, setTables] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState({ open: false, table: null });
  const [formData, setFormData] = useState({ number: '', capacity: 4, roomId: '' });
  const [formError, setFormError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tRes, rRes] = await Promise.all([api.get('/rooms/tables'), api.get('/rooms')]);
      setTables(tRes.data);
      setRooms(rRes.data);
    } catch {
      showToast("Ma'lumotlarni yuklashda xatolik", 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openForm = (table = null) => {
    setFormError('');
    setModal({ open: true, table });
    setFormData(table
      ? { number: table.number, capacity: table.capacity, roomId: table.roomId }
      : { number: '', capacity: 4, roomId: rooms[0]?.id || '' }
    );
  };

  const handleSave = async () => {
    setFormError('');
    const num = parseInt(formData.number);
    if (!formData.number || isNaN(num) || num < 1) { setFormError("Stol raqami noto'g'ri"); return; }
    if (!formData.roomId) { setFormError("Xona tanlanishi shart"); return; }

    setSaving(true);
    try {
      const data = { ...formData, number: num, capacity: parseInt(formData.capacity) || 4 };
      if (modal.table) {
        await api.put(`/rooms/tables/${modal.table.id}`, data);
        showToast("Stol yangilandi");
      } else {
        await api.post('/rooms/tables', data);
        showToast("Stol qo'shildi");
      }
      setModal({ open: false, table: null });
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Stolni o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/rooms/tables/${id}`);
      showToast("Stol o'chirildi");
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || "O'chirishda xatolik", 'error');
    }
  };

  const statusColor = { FREE: 'var(--success)', OCCUPIED: 'var(--danger)' };

  return (
    <div className="animate-fade">
      <div className="mgmt-header">
        <h2 style={{ fontSize: '2rem', fontFamily: 'Playfair Display' }}>{uz.manager.tables}</h2>
        <button
          className="btn btn-primary"
          onClick={() => openForm()}
          style={{ padding: '10px 24px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Plus size={18} /> {uz.manager.addTable}
        </button>
      </div>

      {loading ? <LoadingGrid /> : (
        <div className="mgmt-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          {tables.length === 0 && <EmptyState message="Hali stollar yo'q" />}
          {tables.map(table => (
            <div
              key={table.id}
              className="table-card"
              style={{
                padding: 20,
                position: 'relative',
                borderTop: `3px solid ${statusColor[table.status] || 'var(--glass-border)'}`,
              }}
            >
              <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 2 }}>
                <button onClick={() => openForm(table)} style={{ background: 'transparent', padding: 4, color: 'var(--text-muted)' }}>
                  <Pencil size={13} />
                </button>
                <button onClick={() => handleDelete(table.id)} style={{ background: 'transparent', padding: 4, color: 'var(--danger)' }}>
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="table-number" style={{ fontSize: '2.2rem', marginBottom: 4 }}>{table.number}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 6 }}>{table.room?.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>👥 {table.capacity}</div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, table: null })}
        title={modal.table ? "Stolni tahrirlash" : uz.manager.addTable}
        onConfirm={handleSave}
        loading={saving}
      >
        {formError && <ErrorBanner message={formError} />}
        <div className="form-group">
          <label>{uz.manager.tableNumber}</label>
          <input
            className="pf-input"
            type="number"
            min="1"
            value={formData.number}
            onChange={e => setFormData({ ...formData, number: e.target.value })}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label>{uz.manager.capacity}</label>
          <input
            className="pf-input"
            type="number"
            min="1"
            max="20"
            value={formData.capacity}
            onChange={e => setFormData({ ...formData, capacity: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>{uz.manager.rooms}</label>
          <select
            className="pf-input"
            value={formData.roomId}
            onChange={e => setFormData({ ...formData, roomId: e.target.value })}
          >
            {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </Modal>
    </div>
  );
};

// ─── Menu Management ──────────────────────────────────────────────────────────
const MenuManagement = ({ showToast }) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState({ open: false, item: null });
  const [formData, setFormData] = useState({ name: '', price: '', categoryId: '', isAvailable: true });
  const [formError, setFormError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [iRes, cRes] = await Promise.all([api.get('/menu/items'), api.get('/menu/categories')]);
      setItems(iRes.data);
      setCategories(cRes.data);
    } catch {
      showToast("Menyu yuklashda xatolik", 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openForm = (item = null) => {
    setFormError('');
    setModal({ open: true, item });
    setFormData(item
      ? { name: item.name, price: item.price, categoryId: item.categoryId, isAvailable: item.isAvailable }
      : { name: '', price: '', categoryId: categories[0]?.id || '', isAvailable: true }
    );
  };

  const handleSave = async () => {
    setFormError('');
    if (!formData.name.trim()) { setFormError("Taom nomi kiritilishi shart"); return; }
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) { setFormError("Narx to'g'ri kiritilishi shart"); return; }

    setSaving(true);
    try {
      const data = { ...formData, price };
      if (modal.item) {
        await api.put(`/menu/items/${modal.item.id}`, data);
        showToast("Taom yangilandi");
      } else {
        await api.post('/menu/items', data);
        showToast("Taom qo'shildi");
      }
      setModal({ open: false, item: null });
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`"${name}" ni menyudan o'chirmoqchimisiz?`)) return;
    try {
      await api.delete(`/menu/items/${id}`);
      showToast("Taom o'chirildi");
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || "O'chirishda xatolik. Faol buyurtmalarda ishlatilgan bo'lishi mumkin.", 'error');
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await api.patch(`/menu/items/${item.id}`, { isAvailable: !item.isAvailable });
      showToast(item.isAvailable ? "Taom mavjud emas deb belgilandi" : "Taom mavjud deb belgilandi");
      fetchData();
    } catch {
      showToast("Holat o'zgartirishda xatolik", 'error');
    }
  };

  // Group items by category
  const grouped = categories.map(cat => ({
    ...cat,
    items: items.filter(i => i.categoryId === cat.id),
  })).filter(cat => cat.items.length > 0);

  const uncategorized = items.filter(i => !categories.find(c => c.id === i.categoryId));

  return (
    <div className="animate-fade">
      <div className="mgmt-header">
        <h2 style={{ fontSize: '2rem', fontFamily: 'Playfair Display' }}>{uz.manager.menu}</h2>
        <button
          className="btn btn-primary"
          onClick={() => openForm()}
          style={{ padding: '10px 24px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Plus size={18} /> {uz.manager.addMenuItem}
        </button>
      </div>

      {loading ? <LoadingList /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {items.length === 0 && <EmptyState message="Hali taomlar yo'q" />}
          {grouped.map(cat => (
            <div key={cat.id}>
              <div style={{
                fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase',
                letterSpacing: '0.15em', fontWeight: 700, marginBottom: 12,
                paddingBottom: 8, borderBottom: '1px solid var(--glass-border)',
              }}>
                {cat.name}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cat.items.map(item => <MenuItem key={item.id} item={item} onEdit={() => openForm(item)} onDelete={() => handleDelete(item.id, item.name)} onToggle={() => toggleAvailability(item)} />)}
              </div>
            </div>
          ))}
          {uncategorized.length > 0 && (
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, marginBottom: 12 }}>
                Kategoriyasiz
              </div>
              {uncategorized.map(item => <MenuItem key={item.id} item={item} onEdit={() => openForm(item)} onDelete={() => handleDelete(item.id, item.name)} onToggle={() => toggleAvailability(item)} />)}
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, item: null })}
        title={modal.item ? "Taomni tahrirlash" : uz.manager.addMenuItem}
        onConfirm={handleSave}
        loading={saving}
      >
        {formError && <ErrorBanner message={formError} />}
        <div className="form-group">
          <label>Taom nomi</label>
          <input className="pf-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} autoFocus />
        </div>
        <div className="form-group">
          <label>Narx (so'm)</label>
          <input className="pf-input" type="number" min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Kategoriya</label>
          <select className="pf-input" value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <input
            type="checkbox"
            id="isAvailable"
            checked={formData.isAvailable}
            onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <label htmlFor="isAvailable" style={{ marginBottom: 0, cursor: 'pointer' }}>Mavjud (buyurtma qilish mumkin)</label>
        </div>
      </Modal>
    </div>
  );
};

// Single menu item row
const MenuItem = ({ item, onEdit, onDelete, onToggle }) => (
  <div
    className="table-card"
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      height: 'auto',
      padding: '16px 24px',
      gap: 20,
      textAlign: 'left',
      justifyContent: 'flex-start',
      opacity: item.isAvailable ? 1 : 0.5,
      borderLeft: `3px solid ${item.isAvailable ? 'var(--success)' : 'var(--glass-border)'}`,
      borderBottom: 'none',
    }}
  >
    <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.03)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
      🥘
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.name}
      </div>
      {!item.isAvailable && (
        <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 2 }}>Mavjud emas</div>
      )}
    </div>
    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', flexShrink: 0 }}>
      {Number(item.price).toLocaleString()} so'm
    </div>
    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
      <button
        className="btn btn-ghost"
        onClick={onToggle}
        style={{ padding: 8, color: item.isAvailable ? 'var(--success)' : 'var(--text-muted)' }}
        title={item.isAvailable ? "Mavjud emas deb belgilash" : "Mavjud deb belgilash"}
      >
        <Check size={15} />
      </button>
      <button className="btn btn-ghost" onClick={onEdit} style={{ padding: 8 }} title="Tahrirlash">
        <Pencil size={15} />
      </button>
      <button className="btn btn-ghost" onClick={onDelete} style={{ padding: 8, color: 'var(--danger)' }} title="O'chirish">
        <Trash2 size={15} />
      </button>
    </div>
  </div>
);

// ─── Shared small components ──────────────────────────────────────────────────
const ErrorBanner = ({ message }) => (
  <div style={{
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    borderRadius: 8,
    padding: '10px 14px',
    color: 'var(--danger)',
    fontSize: '0.875rem',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  }}>
    <AlertCircle size={15} style={{ flexShrink: 0 }} />
    {message}
  </div>
);

const LoadingGrid = () => (
  <div className="mgmt-grid">
    {[1, 2, 3].map(i => (
      <div key={i} className="table-card" style={{ height: 120, opacity: 0.3, animation: 'pulse 1.5s ease-in-out infinite' }} />
    ))}
  </div>
);

const LoadingList = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    {[1, 2, 3, 4].map(i => (
      <div key={i} style={{ height: 72, borderRadius: 12, background: 'var(--glass-border)', opacity: 0.3, animation: 'pulse 1.5s ease-in-out infinite' }} />
    ))}
  </div>
);

const EmptyState = ({ message }) => (
  <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontSize: '0.95rem', gridColumn: '1 / -1' }}>
    {message}
  </div>
);

// ─── Expense Management ───────────────────────────────────────────────────────
const ExpenseManagement = ({ showToast }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState({ open: false, expense: null });
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'other', description: '', date: '' });
  const [formError, setFormError] = useState('');

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/expenses');
      setExpenses(res.data);
    } catch {
      showToast("Xarajatlarni yuklashda xatolik", 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const openForm = (expense = null) => {
    setFormError('');
    setModal({ open: true, expense });
    setFormData(expense
      ? { 
          title: expense.title, 
          amount: expense.amount, 
          category: expense.category, 
          description: expense.description || '', 
          date: expense.date.split('T')[0] 
        }
      : { title: '', amount: '', category: 'other', description: '', date: new Date().toISOString().split('T')[0] }
    );
  };

  const handleSave = async () => {
    setFormError('');
    if (!formData.title.trim()) { setFormError("Nomi kiritilishi shart"); return; }
    if (!formData.amount || isNaN(parseFloat(formData.amount))) { setFormError("Summa noto'g'ri"); return; }

    setSaving(true);
    try {
      const data = { ...formData, amount: parseFloat(formData.amount) };
      if (modal.expense) {
        await api.put(`/expenses/${modal.expense.id}`, data);
        showToast("Xarajat yangilandi");
      } else {
        await api.post('/expenses', data);
        showToast("Xarajat qo'shildi");
      }
      setModal({ open: false, expense: null });
      fetchExpenses();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}" xarajatini o'chirmoqchimisiz?`)) return;
    try {
      await api.delete(`/expenses/${id}`);
      showToast("Xarajat o'chirildi");
      fetchExpenses();
    } catch {
      showToast("O'chirishda xatolik", 'error');
    }
  };

  const catEmoji = { payroll: '💰', ingredients: '🥦', utilities: '⚡', rent: '🏠', other: '📦' };

  return (
    <div className="animate-fade">
      <div className="mgmt-header">
        <h2 style={{ fontSize: '2rem', fontFamily: 'Playfair Display' }}>{uz.manager.expenses}</h2>
        <button className="btn btn-primary" onClick={() => openForm()} style={{ padding: '10px 24px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> {uz.manager.addExpense}
        </button>
      </div>

      {loading ? <LoadingList /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {expenses.length === 0 && <EmptyState message="Hali xarajatlar yo'q" />}
          {expenses.map(ex => (
            <div key={ex.id} className="table-card" style={{ flexDirection: 'row', padding: '16px 24px', gap: 20, justifyContent: 'flex-start', height: 'auto', borderBottom: 'none' }}>
              <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                {catEmoji[ex.category] || '📦'}
              </div>
              <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ex.title}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 2 }}>
                  {uz.expenses[ex.category]} • {new Date(ex.date).toLocaleDateString()}
                </div>
              </div>
              <div style={{ fontWeight: 800, color: 'var(--danger)', fontSize: '1.1rem' }}>
                -{ex.amount.toLocaleString()} so'm
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn btn-ghost" onClick={() => openForm(ex)} style={{ padding: 8 }}>
                  <Pencil size={15} />
                </button>
                <button className="btn btn-ghost" onClick={() => handleDelete(ex.id, ex.title)} style={{ padding: 8, color: 'var(--danger)' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, expense: null })}
        title={modal.expense ? "Xarajatni tahrirlash" : uz.manager.addExpense}
        onConfirm={handleSave}
        loading={saving}
      >
        {formError && <ErrorBanner message={formError} />}
        <div className="form-group">
          <label>Nomi</label>
          <input className="pf-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} autoFocus />
        </div>
        <div className="form-group">
          <label>Summa (so'm)</label>
          <input className="pf-input" type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Kategoriya</label>
          <select className="pf-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
            {Object.keys(uz.expenses).map(cat => (
              <option key={cat} value={cat}>{uz.expenses[cat]}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Sana</label>
          <input className="pf-input" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Izoh</label>
          <textarea className="pf-input" style={{ height: 80, resize: 'none' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
};

export default ManagerDashboard;