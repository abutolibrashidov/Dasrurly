import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

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

// In-memory storage
let orders = [];
let orderIdCounter = 1;
const menuItems = [
  { id: 1, name: 'Plov', price: 25000 },
  { id: 2, name: 'Manti', price: 18000 },
  { id: 3, name: 'Shashlik', price: 22000 },
  { id: 4, name: 'Lagman', price: 20000 },
  { id: 5, name: 'Dimlama', price: 24000 },
  { id: 6, name: 'Samsa', price: 12000 },
  { id: 7, name: 'Palov', price: 28000 },
  { id: 8, name: 'Kabob', price: 26000 }
];

// REST API endpoints
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const { tableNumber, items, waiterName } = req.body;
  
  if (!tableNumber || !items || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  const newOrder = {
    id: orderIdCounter++,
    tableNumber,
    items,
    waiterName: waiterName || 'Unknown',
    status: 'NEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  orders.push(newOrder);

  // Broadcast to all connected clients
  io.emit('order:created', newOrder);
  io.emit('orders:updated', orders);

  // Play sound notification
  io.emit('notification:sound', 'new-order');

  res.json({ success: true, orderId: newOrder.id });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = orders.find(o => o.id === parseInt(req.params.id));

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (!['NEW', 'COOKING', 'READY'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  // Broadcast updates
  io.emit('order:updated', order);
  io.emit('orders:updated', orders);

  // Notify waiters when order is ready
  if (status === 'READY') {
    io.emit('notification:ready', {
      orderId: order.id,
      tableNumber: order.tableNumber
    });
  }

  res.json({ success: true, order });
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send current orders to new client
  socket.emit('orders:initial', orders);

  // Waiter requesting order status
  socket.on('waiter:requestStatus', (tableNumber) => {
    const tableOrders = orders.filter(o => o.tableNumber === tableNumber);
    socket.emit('waiter:orderStatus', tableOrders);
  });

  // Kitchen requesting all orders
  socket.on('kitchen:requestOrders', () => {
    socket.emit('kitchen:orders', orders);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket ready on ws://localhost:${PORT}`);
});
