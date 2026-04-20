import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma.js';

class AuthService {
  async login(username, password) {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { restaurant: true }
    });

    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    if (user.role !== 'superadmin' && !user.restaurant?.isActive) {
      const error = new Error('Hisobingiz vaqtinchalik to\'xtatilgan. Iltimos, administrator bilan bog\'laning.');
      error.status = 403;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        restaurantId: user.restaurantId
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        restaurantId: user.restaurantId,
        restaurantName: user.restaurant.name
      }
    };
  }
}

export default new AuthService();
