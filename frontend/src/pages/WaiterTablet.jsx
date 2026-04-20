import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { uz } from '../i18n';
import {
  PlusCircle,
  MinusCircle,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

const WaiterTablet = ({ socket }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [roomsRes, menuRes, ordersRes] = await Promise.all([
        api.get('/rooms'),
        api.get('/menu/items'),
        api.get('/orders/my')
      ]);
      setRooms(roomsRes.data);
      if (roomsRes.data.length > 0) setSelectedRoom(roomsRes.data[0]);
      setMenu(menuRes.data.filter(item => item.isAvailable));
      setMyOrders(ordersRes.data);
    } catch (err) {
      console.error('Failed to load waiter data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!socket) return;

    const onOrderReady = (order) => {
      // Use a non-blocking notification instead of alert
      const tableNum = order.table?.number;
      setMyOrders(prev => prev.map(o => o.id === order.id ? order : o));
      // You can replace this with a proper toast in future
      const msg = `${uz.notifications?.orderReady || 'Tayyor!'} — Stol ${tableNum}`;
      console.info(msg);
    };

    const onOrderStatusChanged = (updated) => {
      setMyOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    };

    socket.on('order:ready', onOrderReady);
    socket.on('order:statusChanged', onOrderStatusChanged);

    return () => {
      socket.off('order:ready', onOrderReady);
      socket.off('order:statusChanged', onOrderStatusChanged);
    };
  }, [socket]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing?.quantity === 1) return prev.filter(i => i.id !== itemId);
      return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const submitOrder = async () => {
    if (!selectedTable || cart.length === 0 || submitting) return;
    setOrderError('');
    setSubmitting(true);
    try {
      const res = await api.post('/orders', {
        tableId: selectedTable.id,
        items: cart.map(i => ({ menuItemId: i.id, quantity: i.quantity }))
      });
      setMyOrders(prev => [res.data, ...prev]);
      setCart([]);
      setSelectedTable(null);
      // Update table status locally so it shows occupied immediately
      setRooms(prev => prev.map(room => ({
        ...room,
        tables: room.tables?.map(t =>
          t.id === selectedTable.id ? { ...t, status: 'occupied' } : t
        )
      })));
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Buyurtma yuborishda xatolik';
      setOrderError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = {
    NEW: 'var(--danger)',
    COOKING: 'var(--warning)',
    READY: 'var(--success)',
    SERVED: 'var(--primary)',
    PAID: 'var(--text-muted)',
  };

  if (loading) return <div className="app-container"><p>{uz.common.loading}</p></div>;

  return (
    <div className="app-container waiter-tablet-layout" style={{ flexDirection: 'row' }}>

      {/* ── Left: Rooms & Tables ── */}
      <section style={{ flex: 1, borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--glass-border)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 16 }}>{uz.waiter?.title || 'Stollar'}</h2>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`btn ${selectedRoom?.id === room.id ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '8px 20px', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                {room.name}
              </button>
            ))}
          </div>
        </div>

        <div className="table-grid" style={{ padding: 24, overflowY: 'auto' }}>
          {selectedRoom?.tables?.map(table => (
            <button
              key={table.id}
              onClick={() => { setSelectedTable(table); setCart([]); setOrderError(''); }}
              className={`table-card ${table.status}`}
              style={{
                border: selectedTable?.id === table.id
                  ? '2px solid var(--primary)'
                  : '1px solid var(--glass-border)',
              }}
            >
              <div className="table-number">{table.number}</div>
              <div className="table-status" style={{ fontSize: '0.75rem' }}>
                {uz.status?.[table.status] || table.status}
              </div>
              {table.status === 'occupied' && (
                <div style={{ fontSize: '0.65rem', color: 'var(--success)', marginTop: 6, fontWeight: 700 }}>
                  ● FAOL
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── Right: Menu/Cart or Orders ── */}
      <section style={{ width: 440, display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
        {selectedTable ? (
          <div className="animate-fade" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                className="btn btn-ghost"
                onClick={() => { setSelectedTable(null); setCart([]); setOrderError(''); }}
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                ← Orqaga
              </button>
              <h3 style={{ flex: 1 }}>Stol {selectedTable.number}</h3>
            </div>

            {/* Menu items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {menu.map(item => {
                const cartItem = cart.find(i => i.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="kds-card"
                    style={{ flexDirection: 'row', alignItems: 'center', minWidth: 'auto', padding: '14px 16px', gap: 12 }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</div>
                      <div style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: 2 }}>
                        {item.price.toLocaleString()} so'm
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {cartItem && (
                        <>
                          <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                            <MinusCircle size={20} />
                          </button>
                          <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 700 }}>{cartItem.quantity}</span>
                        </>
                      )}
                      <button onClick={() => addToCart(item)} style={{ background: 'transparent', color: 'var(--primary)' }}>
                        <PlusCircle size={22} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart summary */}
            <div style={{ padding: 20, background: 'var(--bg-card)', borderTop: '2px solid var(--primary)' }}>
              {cart.length > 0 && (
                <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{item.quantity}× {item.name}</span>
                      <span style={{ fontWeight: 700 }}>{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', paddingTop: 8, borderTop: '1px solid var(--glass-border)', marginTop: 4 }}>
                    <span>Jami</span>
                    <span style={{ color: 'var(--primary)' }}>{cartTotal.toLocaleString()} so'm</span>
                  </div>
                </div>
              )}

              {orderError && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '10px 14px', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <AlertCircle size={15} /> {orderError}
                </div>
              )}

              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: 18, fontSize: '1.1rem', borderRadius: 12 }}
                onClick={submitOrder}
                disabled={cart.length === 0 || submitting}
              >
                {submitting ? 'Yuborilmoqda...' : uz.waiter?.sendOrder || 'Buyurtma yuborish'}
              </button>
            </div>
          </div>
        ) : (
          // My orders view
          <div style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
            <h3 style={{ marginBottom: 20 }}>{uz.waiter?.yourOrders || 'Mening buyurtmalarim'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {myOrders.slice(0, 15).map(order => (
                <div
                  key={order.id}
                  className="kds-card"
                  style={{
                    minWidth: 'auto',
                    borderLeft: `4px solid ${statusColor[order.status] || 'var(--glass-border)'}`,
                    padding: '16px 20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Stol {order.table?.number}</span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: statusColor[order.status],
                      background: `${statusColor[order.status]}18`,
                      padding: '3px 10px',
                      borderRadius: 99,
                    }}>
                      {uz.status?.[order.status] || order.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span>{order.items?.length} ta taom</span>
                    <span>•</span>
                    {/* ✅ FIXED: was order.totalAmount — now order.totalPrice */}
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      {order.totalPrice?.toLocaleString()} so'm
                    </span>
                    <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} />
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {myOrders.length === 0 && (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: 40 }}>
                  {uz.waiter?.noOrders || 'Buyurtmalar yo\'q'}
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default WaiterTablet;