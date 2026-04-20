import prisma from '../../config/prisma.js';

class MenuService {
  async getCategories(restaurantId) {
    return prisma.category.findMany({
      where: { restaurantId },
      include: { menuItems: true }
    });
  }

  async createCategory(restaurantId, data) {
    return prisma.category.create({
      data: {
        ...data,
        restaurantId
      }
    });
  }

  async updateCategory(restaurantId, id, data) {
    const category = await prisma.category.findFirst({
      where: { id, restaurantId }
    });

    if (!category) {
      throw new Error('Category not found or access denied');
    }

    return prisma.category.update({
      where: { id },
      data
    });
  }

  async deleteCategory(restaurantId, id) {
    const category = await prisma.category.findFirst({
      where: { id, restaurantId }
    });

    if (!category) {
      throw new Error('Category not found or access denied');
    }

    return prisma.category.delete({
      where: { id }
    });
  }

  async getMenuItems(restaurantId) {
    return prisma.menuItem.findMany({
      where: { restaurantId },
      include: { category: true }
    });
  }

  async createMenuItem(restaurantId, data) {
    // Validate category belongs to same restaurant
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, restaurantId }
    });

    if (!category) {
      throw new Error('Category not found or access denied');
    }

    return prisma.menuItem.create({
      data: {
        ...data,
        restaurantId
      }
    });
  }

  async updateMenuItem(restaurantId, id, data) {
    const item = await prisma.menuItem.findFirst({
      where: { id, restaurantId }
    });

    if (!item) {
      throw new Error('Item not found or access denied');
    }

    return prisma.menuItem.update({
      where: { id },
      data
    });
  }

  async deleteMenuItem(restaurantId, id) {
    const item = await prisma.menuItem.findFirst({
      where: { id, restaurantId }
    });

    if (!item) {
      throw new Error('Item not found or access denied');
    }

    return prisma.menuItem.delete({
      where: { id }
    });
  }
}

export default new MenuService();
