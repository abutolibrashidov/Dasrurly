import jwt from 'jsonwebtoken';

export const initSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
      console.error('🔌 Socket Auth failed: No token');
      return next(new Error('Authentication error: No token'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      console.error(`🔌 Socket Auth failed: ${err.message}`);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const { restaurantId, userId, role } = socket.user;

    console.log(`🔌 User ${userId} (${role}) connected to restaurant ${restaurantId}`);

    // Join room for this tenant
    socket.join(restaurantId);

    socket.on('disconnect', () => {
      console.log(`🔌 User ${userId} disconnected`);
    });
  });
};
