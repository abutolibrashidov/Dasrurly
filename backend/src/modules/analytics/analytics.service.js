import prisma from '../../config/prisma.js';

class AnalyticsService {
  async getDashboardStats(restaurantId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      ordersToday,
      activeOrders,
      paymentsToday,
      expensesToday,
      occupiedTables
    ] = await Promise.all([
      prisma.order.count({ where: { restaurantId } }),
      prisma.order.count({
        where: { restaurantId, createdAt: { gte: today } }
      }),
      prisma.order.count({
        where: { restaurantId, status: { not: 'PAID' } }
      }),
      prisma.payment.findMany({
        where: { restaurantId, status: 'paid', paidAt: { gte: today } }
      }),
      prisma.expense.findMany({
        where: { restaurantId, date: { gte: today } }
      }),
      prisma.table.count({
        where: { restaurantId, status: 'occupied' }
      })
    ]);

    const totalRevenueToday = paymentsToday.reduce((sum, p) => sum + p.amount, 0);
    const totalExpensesToday = expensesToday.reduce((sum, e) => sum + e.amount, 0);
    const netRevenueToday = totalRevenueToday - totalExpensesToday;
    
    const totalPaymentsToday = paymentsToday.length;
    const averageBillSize = totalPaymentsToday > 0
      ? totalRevenueToday / totalPaymentsToday
      : 0;

    return {
      totalOrders,
      ordersToday,
      activeOrders,
      totalRevenueToday,
      totalExpensesToday,
      netRevenueToday,
      totalPaymentsToday,
      averageBillSize,
      occupiedTables,
      paymentSplit: {
        cash: paymentsToday.filter(p => p.method === 'cash').length,
        card: paymentsToday.filter(p => p.method === 'card').length
      }
    };
  }

  async getRevenue(restaurantId, days = 7) {
    const from = new Date();
    from.setDate(from.getDate() - (days - 1));
    from.setHours(0, 0, 0, 0);

    const [payments, expenses] = await Promise.all([
      prisma.payment.findMany({
        where: { restaurantId, status: 'paid', paidAt: { gte: from } },
        select: { amount: true, paidAt: true }
      }),
      prisma.expense.findMany({
        where: { restaurantId, date: { gte: from } },
        select: { amount: true, date: true }
      })
    ]);

    // Pre-fill every day with 0
    const dailyMap = {};
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const key = d.toISOString().slice(0, 10);
      dailyMap[key] = { revenue: 0, expenses: 0 };
    }

    for (const p of payments) {
      const key = new Date(p.paidAt).toISOString().slice(0, 10);
      if (dailyMap[key] !== undefined) dailyMap[key].revenue += p.amount;
    }

    for (const e of expenses) {
      const key = new Date(e.date).toISOString().slice(0, 10);
      if (dailyMap[key] !== undefined) dailyMap[key].expenses += e.amount;
    }

    return Object.entries(dailyMap).map(([date, data]) => ({
      date,
      label: new Date(date + 'T12:00:00').toLocaleDateString('ru-RU', {
        month: 'short',
        day: 'numeric'
      }),
      revenue: Math.round(data.revenue),
      expenses: Math.round(data.expenses),
      netRevenue: Math.round(data.revenue - data.expenses)
    }));
  }

  async getPeakHours(restaurantId) {
    const orders = await prisma.order.findMany({
      where: { restaurantId },
      select: { createdAt: true }
    });

    const hourCounts = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      label: `${String(h).padStart(2, '0')}:00`,
      orders: 0
    }));

    for (const order of orders) {
      hourCounts[new Date(order.createdAt).getHours()].orders += 1;
    }

    // Return 6:00–23:00 only
    return hourCounts.slice(6);
  }

  async getTopDishes(restaurantId, limit = 10) {
    const items = await prisma.orderItem.groupBy({
      by: ['menuItemId', 'name'],
      where: {
        order: { restaurantId, status: 'PAID' }
      },
      _sum: { quantity: true, price: true },
      _count: { menuItemId: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit
    });

    return items.map((item, index) => ({
      rank: index + 1,
      menuItemId: item.menuItemId,
      name: item.name,
      totalQuantity: item._sum.quantity || 0,
      totalRevenue: Math.round((item._sum.price || 0) * (item._sum.quantity || 0)),
      orderCount: item._count.menuItemId
    }));
  }
}

export default new AnalyticsService();
