import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { uz } from '../i18n';
import { Clock, CheckCircle2, Play, AlertCircle } from 'lucide-react';

const KitchenDisplay = ({ socket }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/kitchen');
setOrders(res.data); // already filtered and sorted by the backend
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();

    if (socket) {
      socket.on('order:created', (order) => setOrders(prev => [...prev, order]));
      socket.on('order:statusChanged', (updated) => {
        if (['SERVED', 'PAID'].includes(updated.status)) {
          setOrders(prev => prev.filter(o => o.id !== updated.id));
        } else {
          setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
        }
      });
    }
    return () => {
      socket?.off('order:created');
      socket?.off('order:statusChanged');
    };
  }, [socket]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
    } catch (err) {
      alert('Fail');
    }
  };

  if (loading) return <div className="app-container"><p>{uz.common.loading}</p></div>;

  return (
    <div className="app-container" style={{background: 'var(--bg-dark-950)'}}>
      <header className="header">
        <h1 className="brand">{uz.kitchen.title}</h1>
        <div style={{display: 'flex', gap: 24}}>
          <div className="stat-pill">{uz.status.NEW}: {orders.filter(o => o.status === 'NEW').length}</div>
          <div className="stat-pill active">{uz.status.COOKING}: {orders.filter(o => o.status === 'COOKING').length}</div>
        </div>
      </header>

      <div className="kds-container">
        {orders.map(order => (
          <div key={order.id} className="kds-card animate-fade" style={{
            borderTop: `6px solid ${order.status === 'NEW' ? 'var(--danger)' : order.status === 'COOKING' ? 'var(--warning)' : 'var(--success)'}`
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <h2 style={{fontSize: '2.5rem', fontFamily: 'Inter', fontWeight: 900}}>STOL {order.table.number}</h2>
              <span style={{color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6}}>
                <Clock size={14} /> 
                {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>

            <div style={{flex: 1, padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 8}}>
              {order.items.map((item, i) => (
                <div key={i} className="item">
                  <span style={{color: 'var(--primary)', fontWeight: 800}}>{item.quantity}x</span>
                  <span style={{flex: 1, marginLeft: 12}}>{item.name}</span>
                </div>
              ))}
            </div>

            {order.status === 'NEW' && (
              <button 
                className="btn btn-primary" 
                style={{padding: 20, fontSize: '1.1rem'}} 
                onClick={() => updateStatus(order.id, 'COOKING')}
              >
                <Play size={18} /> {uz.kitchen.startCooking}
              </button>
            )}
            {order.status === 'COOKING' && (
              <button 
                className="btn btn-primary" 
                style={{padding: 20, fontSize: '1.1rem', background: 'var(--success)', color: 'white'}} 
                onClick={() => updateStatus(order.id, 'READY')}
              >
                <CheckCircle2 size={18} /> {uz.kitchen.markReady}
              </button>
            )}
            {order.status === 'READY' && (
              <div style={{textAlign: 'center', padding: 12, borderRadius: 12, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', fontWeight: 700}}>
                {uz.status.READY}
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && <div style={{width: '100%', textAlign: 'center', padding: 100, color: 'var(--text-muted)'}}>{uz.waiter.noOrders}</div>}
      </div>

    </div>
  );
};

export default KitchenDisplay;
