import prisma from '../../config/prisma.js';
import bcrypt from 'bcryptjs';

class SuperAdminService {
  async getGlobalStats() {
    const totalRestaurants = await prisma.restaurant.count();
    const activeRestaurants = await prisma.restaurant.count({ where: { isActive: true } });
    const totalUsers = await prisma.user.count();
    
    // Total turnover across all restaurants (paid payments)
    const totalPayments = await prisma.payment.aggregate({
      where: { status: 'paid' },
      _sum: { amount: true }
    });

    return {
      totalRestaurants,
      activeRestaurants,
      totalUsers,
      totalTurnover: totalPayments._sum.amount || 0
    };
  }

  async getAllRestaurants() {
    return prisma.restaurant.findMany({
      include: {
        _count: {
          select: { users: true, orders: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createRestaurant(data) {
    const { name, managerUsername, password } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.$transaction(async (tx) => {
      // 1. Create the restaurant
      const restaurant = await tx.restaurant.create({
        data: { name }
      });

      // 2. Create the initial manager user
      await tx.user.create({
        data: {
          username: managerUsername,
          password: hashedPassword,
          role: 'manager',
          restaurantId: restaurant.id
        }
      });

      return restaurant;
    });
  }

  async updateRestaurant(id, data) {
    return prisma.restaurant.update({
      where: { id },
      data
    });
  }

  async toggleRestaurantStatus(id) {
    const restaurant = await prisma.restaurant.findUnique({ where: { id } });
    if (!restaurant) throw new Error('Restaurant not found');

    return prisma.restaurant.update({
      where: { id },
      data: { isActive: !restaurant.isActive }
    });
  }

  async broadcastNotification(data) {
    return prisma.systemNotification.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type || 'info',
        target: data.target || 'all'
      }
    });
  }

  async getNotifications() {
    return prisma.systemNotification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }
}

export default new SuperAdminService();
