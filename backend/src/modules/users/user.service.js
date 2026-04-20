import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma.js';

class UserService {
  async getUsers(restaurantId) {
    return prisma.user.findMany({
      where: { restaurantId },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true
      }
    });
  }

  async createUser(restaurantId, data) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        restaurantId
      },
      select: {
        id: true,
        username: true,
        role: true
      }
    });
  }

  async updateUser(restaurantId, id, data) {
    const user = await prisma.user.findFirst({
      where: { id, restaurantId }
    });

    if (!user) {
      throw new Error('User not found or access denied');
    }

    const updateData = { ...data };
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(data.password, salt);
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        role: true
      }
    });
  }

  async deleteUser(restaurantId, id) {
    const user = await prisma.user.findFirst({
      where: { id, restaurantId }
    });

    if (!user) {
      throw new Error('User not found or access denied');
    }

    return prisma.user.delete({
      where: { id }
    });
  }

  async generateImpersonationToken(restaurantId, targetUserId) {
    const user = await prisma.user.findFirst({
      where: { id: targetUserId, restaurantId }
    });

    if (!user) {
      throw new Error('Target user not found or access denied');
    }

    return jwt.sign(
      {
        userId: user.id,
        role: user.role,
        restaurantId: user.restaurantId,
        impersonatedBy: true
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
  }
}

export default new UserService();