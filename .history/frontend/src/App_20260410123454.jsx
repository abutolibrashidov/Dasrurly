import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { uz } from './i18n';
import './App.css';

const socket = io('http://localhost:3000');

export default function App() {
  const [panel, setPanel] = useState(null);

  return (
    <div className="container">
      {!panel ? (
        <div className="panel-selector">
          <h1 style={{ fontSize: '2.5em', marginBottom: '2em' }}>OSHXONA</h1>
          <div className="button-group">
            <button 
              className="btn btn-waiter"
              onClick={() => setPanel('waiter')}
            >
              {uz.waiter.title}
            </button>
            <button 
              className="btn btn-kitchen"
              onClick={() => setPanel('kitchen')}
            >
              {uz.kitchen.title}
            </button>
          </div>
        </div>
      ) : panel === 'waiter' ? (
        <WaiterPanel onBack={() => setPanel(null)} />
      ) : (
        <KitchenPanel onBack={() => setPanel(null)} />
      )}
    </div>
  );
}

function WaiterPanel({ onBack }) {
  const [tableNumber, setTableNumber] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [menu, setMenu] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
    socket.emit('kitchen:requestOrders');
    socket.on('orders:initial', (orders) => {
      setMyOrders(orders);
    });
    socket.on('orders:updated', (orders) => {
      setMyOrders(orders);
    });
    socket.on('order:updated', (order) => {
      setMyOrders(prev => prev.map(o => o.id === order.id ? order : o));
    });
    socket.on('notification:ready', (data) => {
      if (data.tableNumber === parseInt(tableNumber)) {
        setMessage(`🎉 Stol ${data.tableNumber} tayyor!`);
        playNotificationSound();
        setTimeout(() => setMessage(''), 3000);
      }
    });

    return () => {
      socket.off('orders:initial');
      socket.off('orders:updated');
      socket.off('order:updated');
      socket.off('notification:ready');
    };
  }, [tableNumber]);

  const fetchMenu = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/menu');
      const data = await res.json();
      setMenu(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (!tableNumber.trim()) {
      setMessage('Stol raqamini kiriting');
      return;
    }
    if (selectedItems.length === 0) {
      setMessage('Kamida bitta taom tanlang');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber: parseInt(tableNumber),
          items: selectedItems.map(id => menu.find(m => m.id === id)),
          waiterName: 'Ofitsiant'
        })
      });

      if (response.ok) {
        setMessage('✅ Zakaz yuborildi');
        setSelectedItems([]);
        setTableNumber('');
        playSuccessSound();
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Xatolik yuz berdi');
    }
  };

  const toggleItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h1>{uz.waiter.title}</h1>
        <button className="btn-back" onClick={onBack}>← Orqaga</button>
      </div>

      <div className="waiter-content">
        <div className="order-section">
          <div className="form-group">
            <label>{uz.waiter.tableNumber}</label>
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="1-10"
              min="1"
            />
          </div>

          <div className="form-group">
            <label>{uz.waiter.selectItems}</label>
            <div className="menu-grid">
              {menu.map(item => (
                <label key={item.id} className="menu-item">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                  />
                  <span className="menu-name">{item.name}</span>
                  <span className="menu-price">{item.price.toLocaleString()}</span>
                </label>
              ))}
            </div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={handleSubmitOrder}
          >
            {uz.waiter.sendOrder}
          </button>

          {message && <div className="message">{message}</div>}
        </div>

        <div className="orders-section">
          <h2>{uz.waiter.yourOrders}</h2>
          {myOrders.length === 0 ? (
            <p className="no-orders">{uz.waiter.noOrders}</p>
          ) : (
            <div className="orders-list">
              {myOrders.map(order => (
                <div key={order.id} className={`order-card status-${order.status}`}>
                  <div className="order-header">
                    <span className="order-table">{uz.waiter.table}: {order.tableNumber}</span>
                    <span className="order-status">{uz.status[order.status]}</span>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="item-badge">{item.name}</span>
                    ))}
                  </div>
                  <div className="order-time">
                    {new Date(order.createdAt).toLocaleTimeString('uz-UZ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KitchenPanel({ onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.emit('kitchen:requestOrders');
    socket.on('orders:initial', (data) => {
      setOrders(sortOrders(data));
      setLoading(false);
    });
    socket.on('orders:updated', (data) => {
      setOrders(sortOrders(data));
    });
    socket.on('order:created', (order) => {
      playNewOrderSound();
    });
    socket.on('order:updated', (order) => {
      setOrders(prev => sortOrders([...prev.filter(o => o.id !== order.id), order]));
    });

    return () => {
      socket.off('orders:initial');
      socket.off('orders:updated');
      socket.off('order:created');
      socket.off('order:updated');
    };
  }, []);

  const sortOrders = (ordersList) => {
    return ordersList.sort((a, b) => {
      const statusOrder = { NEW: 0, COOKING: 1, READY: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const newOrdersCount = orders.filter(o => o.status === 'NEW').length;
  const cookingCount = orders.filter(o => o.status === 'COOKING').length;

  return (
    <div className="panel kitchen-panel">
      <div className="panel-header">
        <h1>{uz.kitchen.title}</h1>
        <div className="counters">
          <div className="counter new-counter">
            <span className="count">{newOrdersCount}</span>
            <span className="label">Yangi</span>
          </div>
          <div className="counter cooking-counter">
            <span className="count">{cookingCount}</span>
            <span className="label">Tayyorlanmoqda</span>
          </div>
        </div>
        <button className="btn-back" onClick={onBack}>← Orqaga</button>
      </div>

      <div className="kitchen-content">
        {loading ? (
          <p>{uz.ui.loading}</p>
        ) : orders.length === 0 ? (
          <p className="no-orders">{uz.kitchen.noNewOrders}</p>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order.id} className={`kitchen-order status-${order.status}`}>
                <div className="order-header">
                  <div className="table-badge">Stol {order.tableNumber}</div>
                  <div className="status-badge">{uz.status[order.status]}</div>
                </div>

                <div className="order-items-list">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="item">
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>

                <div className="order-time">
                  {new Date(order.createdAt).toLocaleTimeString('uz-UZ')}
                </div>

                <div className="order-actions">
                  {order.status === 'NEW' && (
                    <button
                      className="btn btn-cooking"
                      onClick={() => handleStatusChange(order.id, 'COOKING')}
                    >
                      {uz.kitchen.startCooking}
                    </button>
                  )}
                  {order.status === 'COOKING' && (
                    <button
                      className="btn btn-ready"
                      onClick={() => handleStatusChange(order.id, 'READY')}
                    >
                      {uz.kitchen.markReady}
                    </button>
                  )}
                  {order.status === 'READY' && (
                    <div className="ready-badge">✅ {uz.status.READY}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Sound utilities
function playNotificationSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

function playSuccessSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}

function playNewOrderSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  for (let i = 0; i < 2; i++) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = i === 0 ? 1000 : 1200;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.2);
    
    oscillator.start(audioContext.currentTime + i * 0.15);
    oscillator.stop(audioContext.currentTime + i * 0.15 + 0.2);
  }
}
