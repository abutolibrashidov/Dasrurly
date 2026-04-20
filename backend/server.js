import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { loginLimiter, apiLimiter } from './src/middleware/rateLimit.js';

import authRoutes from './src/modules/auth/auth.routes.js';
import userRoutes from './src/modules/users/user.routes.js';
import restaurantRoutes from './src/modules/restaurants/restaurant.routes.js';
import menuRoutes from './src/modules/menu/menu.routes.js';
import roomRoutes from './src/modules/rooms/room.routes.js';
import tableRoutes from './src/modules/tables/table.routes.js';
import orderRoutes from './src/modules/orders/order.routes.js';
import paymentRoutes from './src/modules/payments/payment.routes.js';
import analyticsRoutes from './src/modules/analytics/analytics.routes.js';
import expenseRoutes from './src/modules/expenses/expense.routes.js';
import superAdminRoutes from './src/modules/superadmin/superadmin.routes.js';

import { authenticate } from './src/middleware/auth.js';
import { errorMiddleware } from './src/middleware/error.js';
import { initSocket } from './src/sockets/index.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/restaurants', authenticate, restaurantRoutes);
app.use('/api/menu', authenticate, menuRoutes);
app.use('/api/rooms', authenticate, roomRoutes);
app.use('/api/tables', authenticate, tableRoutes);
app.use('/api/orders', authenticate, orderRoutes);
app.use('/api/payments', authenticate, paymentRoutes);
app.use('/api/analytics', authenticate, analyticsRoutes);
app.use('/api/expenses', authenticate, expenseRoutes);
app.use('/api/superadmin', authenticate, superAdminRoutes);
app.use('/api', apiLimiter);           // all routes
app.use('/api/auth/login', loginLimiter); // extra strict on login

// Error handling
app.use(errorMiddleware);

// Socket.io
initSocket(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Dasturly Server running on port ${PORT}`);
});

export { io };