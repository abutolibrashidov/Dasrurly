import prisma from '../../config/prisma.js';

class RestaurantService {
  async getRestaurantInfo(id) {
    return prisma.restaurant.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true, tables: true, menuItems: true }
        }
      }
    });
  }

  async updateRestaurant(id, data) {
    return prisma.restaurant.update({
      where: { id },
      data
    });
  }
}

export default new RestaurantService();
