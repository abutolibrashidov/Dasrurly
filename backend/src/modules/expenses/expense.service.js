import prisma from '../../config/prisma.js';

class ExpenseService {
  async getExpenses(restaurantId, filters = {}) {
    const { category, startDate, endDate } = filters;
    const where = { restaurantId };

    if (category) {
      where.category = category;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    return prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' }
    });
  }

  async createExpense(restaurantId, data) {
    return prisma.expense.create({
      data: {
        ...data,
        restaurantId,
        date: data.date ? new Date(data.date) : new Date()
      }
    });
  }

  async updateExpense(id, restaurantId, data) {
    // Ensure ownership
    const expense = await prisma.expense.findFirst({
      where: { id, restaurantId }
    });

    if (!expense) throw new Error('Harajat topilmadi');

    return prisma.expense.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : expense.date
      }
    });
  }

  async deleteExpense(id, restaurantId) {
    // Ensure ownership
    const expense = await prisma.expense.findFirst({
      where: { id, restaurantId }
    });

    if (!expense) throw new Error('Harajat topilmadi');

    return prisma.expense.delete({
      where: { id }
    });
  }

  async getExpenseStats(restaurantId, days = 30) {
    const from = new Date();
    from.setDate(from.getDate() - (days - 1));
    from.setHours(0, 0, 0, 0);

    const expenses = await prisma.expense.findMany({
      where: { restaurantId, date: { gte: from } }
    });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    return {
      total,
      byCategory,
      count: expenses.length
    };
  }
}

export default new ExpenseService();
