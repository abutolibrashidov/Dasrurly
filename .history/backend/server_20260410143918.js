/**
 * OSHXONA - Professional Restaurant Operating System
 * Backend Server (Express + Socket.io + Role-based Auth)
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// Import services and middleware
import AuthService from './src/services/AuthService.js';
import MenuService from './src/services/MenuService.js';
import RoomService from './src/services/RoomService.js';
import TableService from './src/services/TableService.js';
import OrderService from './src/services/OrderService.js';
import { authenticate, authorize } from './src/middleware/auth.js';

// Setup Express and Socket.io
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// ═══════════════════════════════════════════════════════
// AUTHENTICATION ROUTES
// ═══════════════════════════════════════════════════════

app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const result = AuthService.login(username, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════
// MENU ROUTES
// ═══════════════════════════════════════════════════════

// Get all menu items (public)
app.get('/api/menu', (req, res) => {
  try {
    const items = MenuService.getAllItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all categories (public)
app.get('/api/categories', (req, res) => {
  try {
    const categories = MenuService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create menu item (manager only)
app.post('/api/menu', authenticate, authorize(['manager']), (req, res) => {
  try {
    const item = MenuService.createItem(req.body);
    io.emit('menu:updated', MenuService.getAllItems());
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update menu item (manager only)
app.put('/api/menu/:id', authenticate, authorize(['manager']), (req, res) => {
  try {
    const item = MenuService.updateItem(parseInt(req.params.id), req.body);
    io.emit('menu:updated', MenuService.getAllItems());
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete menu item (manager only)
app.delete('/api/menu/:id', authenticate, authorize(['manager']), (req, res) => {
  try {
    const item = MenuService.deleteItem(parseInt(req.params.id));
    io.emit('menu:updated', MenuService.getAllItems());
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════
// ROOMS ROUTES
// ═══════════════════════════════════════════════════════

// Get all rooms (manager only)
app.get('/api/rooms', authenticate, authorize(['manager']), (req, res) => {
  try {
    const rooms = RoomService.getAllRooms();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create room (manager only)
app.post('/api/rooms', authenticate, authorize(['manager']), (req, res) => {
  try {
    const room = RoomService.createRoom(req.body);
    io.emit('room:updated', RoomService.getAllRooms());
    res.json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update room (manager only)
app.put('/api/rooms/:id', authenticate, authorize(['manager']), (req, res) => {
  try {
    const room = RoomService.updateRoom(parseInt(req.params.id), req.body);
    io.emit('room:updated', RoomService.getAllRooms());
    res.json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete room (manager only)
app.delete('/api/rooms/:id', authenticate, authorize(['manager']), (req, res) => {
  try {
    const room = RoomService.deleteRoom(parseInt(req.params.id));
    io.emit('room:updated', RoomService.getAllRooms());
    res.json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════
// TABLES ROUTES
// ═══════════════════════════════════════════════════════

// Get all tables (manager only)
app.get('/api/tables', authenticate, authorize(['manager']), (req, res) => {
  try {
    const tables = TableService.getAllTables();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tables by room (waiter can access)
app.get('/api/tables/room/:roomId', authenticate, (req, res) => {
  try {
    const tables = TableService.getTablesByRoom(parseInt(req.params.roomId));
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create table (manager only)
app.post('/api/tables', authenticate, authorize(['manager']), (req, res) => {
  try {
    const table = TableService.createTable(req.body);
    io.emit('table:updated', TableService.getAllTables());
    res.json(table);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update table (manager only)
app.put('/api/tables/:id', authenticate, authorize(['manager']), (req, res) => {
  try {
    const table = TableService.updateTable(parseInt(req.params.id), req.body);
    io.emit('table:updated', TableService.getAllTables());
    res.json(table);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update table status (waiter can update)
app.put('/api/tables/:id/status', authenticate, authorize(['waiter', 'manager']), (req, res) => {
  try {
    const { status } = req.body;
    const table = TableService.updateTableStatus(parseInt(req.params.id), status);
    io.emit('table:statusChanged', table);
    res.json(table);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete table (manager only)
app.delete('/api/tables/:id', authenticate, authorize(['manager']), (req, res) => {
  try {
    const table = TableService.deleteTable(parseInt(req.params.id));
    io.emit('table:updated', TableService.getAllTables());
    res.json(table);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════
// ORDERS ROUTES
// ═══════════════════════════════════════════════════════

// Get all orders (kitchen/manager)
app.get('/api/orders', authenticate, authorize(['kitchen', 'manager']), (req, res) => {
  try {
    const orders = OrderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get active orders (kitchen/manager)
app.get('/api/orders/active', authenticate, authorize(['kitchen', 'manager']), (req, res) => {
  try {
    const orders = OrderService.getActiveOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order (waiter only)
app.post('/api/orders', authenticate, authorize(['waiter']), (req, res) => {
  try {
    const order = OrderService.createOrder(req.body, req.user.id);
    io.emit('order:created', order);
    io.emit('orders:updated', OrderService.getAllOrders());
    res.json({ success: true, orderId: order.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update order status (kitchen only)
app.put('/api/orders/:id/status', authenticate, authorize(['kitchen']), (req, res) => {
  try {
    const { status } = req.body;
    const order = OrderService.updateOrderStatus(parseInt(req.params.id), status);
    io.emit('order:statusChanged', order);
    io.emit('orders:updated', OrderService.getAllOrders());

    // Notify if ready
    if (status === 'READY') {
      io.emit('notification:ready', {
        orderId: order.id,
        table: order.table
      });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Complete order (waiter marks as delivered)
app.post('/api/orders/:id/complete', authenticate, authorize(['waiter', 'manager']), (req, res) => {
  try {
    const order = OrderService.completeOrder(parseInt(req.params.id));
    io.emit('order:completed', order);
    io.emit('orders:updated', OrderService.getAllOrders());
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════
// ANALYTICS ROUTES
// ═══════════════════════════════════════════════════════

app.get('/api/analytics', authenticate, authorize(['manager']), (req, res) => {
  try {
    const analytics = OrderService.getAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════
// SOCKET.IO EVENTS
// ═══════════════════════════════════════════════════════

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Request orders for kitchen
  socket.on('kitchen:requestOrders', () => {
    const orders = OrderService.getAllOrders();
    socket.emit('orders:initial', orders);
  });

  // Waiter requesting order status
  socket.on('waiter:requestStatus', (tableId) => {
    const orders = OrderService.getOrdersByTable(tableId);
    socket.emit('waiter:orderStatus', orders);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ═══════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ═══════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🍽️  OSHXONA SERVER RUNNING            ║
║  🚀 http://localhost:${PORT}                 ║
║  🔌 WebSocket: ws://localhost:${PORT}       ║
║  📡 Role-based: Manager/Waiter/Kitchen ║
╚════════════════════════════════════════╝
  `);
});

export { app, httpServer, io };
