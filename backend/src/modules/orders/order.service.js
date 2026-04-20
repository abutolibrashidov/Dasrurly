import prisma from '../../config/prisma.js';
import { io } from '../../../server.js';

class OrderService {
  async getOrders(restaurantId) {
    return prisma.order.findMany({
      where: { restaurantId },
      include: {
        items: true,
        table: true,
        waiter: { select: { username: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getMyOrders(restaurantId, waiterId) {
    return prisma.order.findMany({
      where: {
        restaurantId,
        waiterId,
        status: { not: 'PAID' }
      },
      include: {
        items: true,
        table: true,
        waiter: { select: { username: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getKitchenOrders(restaurantId) {
    return prisma.order.findMany({
      where: {
        restaurantId,
        status: { in: ['NEW', 'COOKING', 'READY'] }
      },
      include: {
        items: true,
        table: true,
        waiter: { select: { username: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async createOrder(restaurantId, waiterId, data) {
    const { tableId, items, notes } = data;

    const table = await prisma.table.findFirst({
      where: { id: tableId, restaurantId }
    });
    if (!table) throw new Error('Table not found');

    // Idempotency guard — reject duplicate within 3 seconds
    const recentDuplicate = await prisma.order.findFirst({
      where: {
        tableId,
        restaurantId,
        waiterId,
        createdAt: { gte: new Date(Date.now() - 3000) }
      }
    });
    if (recentDuplicate) {
      const err = new Error('Duplicate order detected — please wait a moment');
      err.status = 409;
      throw err;
    }

    // ONE query for all menu items instead of N queries
    const menuItemIds = items.map(i => i.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, restaurantId }
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new Error('One or more menu items not found or unavailable');
    }

    const menuItemMap = Object.fromEntries(menuItems.map(m => [m.id, m]));

    let totalPrice = 0;
    const orderItemsData = items.map(item => {
      const menuItem = menuItemMap[item.menuItemId];
      totalPrice += menuItem.price * item.quantity;
      return {
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity
      };
    });

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          restaurantId,
          tableId,
          waiterId,
          totalPrice,
          notes,
          status: 'NEW',
          items: {
            create: orderItemsData
          }
        },
        include: { items: true, table: true }
      });

      await tx.table.update({
        where: { id: tableId },
        data: { status: 'occupied' }
      });

      return newOrder;
    });

    io.to(restaurantId).emit('order:created', order);

    return order;
  }

  async updateStatus(restaurantId, orderId, newStatus, userRole) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, restaurantId },
      include: { table: true }
    });

    if (!order) throw new Error('Order not found');

    this.validateTransition(order.status, newStatus, userRole);

    const updateData = { status: newStatus };
    if (newStatus === 'PAID') {
      updateData.paidAt = new Date();
    }
    if (newStatus === 'SERVED') {
      updateData.completedAt = new Date();
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const o = await tx.order.update({
        where: { id: orderId },
        data: updateData,
        include: { items: true, table: true }
      });

      if (newStatus === 'PAID') {
        const otherActiveOrders = await tx.order.count({
          where: {
            tableId: order.tableId,
            status: { not: 'PAID' },
            id: { not: orderId }
          }
        });

        if (otherActiveOrders === 0) {
          await tx.table.update({
            where: { id: order.tableId },
            data: { status: 'free' }
          });
        }
      }

      return o;
    });

    io.to(restaurantId).emit('order:statusChanged', updatedOrder);
    if (newStatus === 'READY') {
      io.to(restaurantId).emit('order:ready', updatedOrder);
    }

    return updatedOrder;
  }

  async closeTable(restaurantId, tableId, data) {
    const { method, amount } = data;

    const table = await prisma.table.findFirst({
      where: { id: tableId, restaurantId },
      include: {
        orders: {
          where: { status: { not: 'PAID' } }
        }
      }
    });

    if (!table) throw new Error('Table not found');
    if (table.orders.length === 0) throw new Error('Table has no active orders');

    const totalPrice = table.orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const finalAmount = amount || totalPrice;

    const payment = await prisma.$transaction(async (tx) => {
      const p = await tx.payment.create({
        data: {
          restaurantId,
          tableId,
          amount: finalAmount,
          method,
          status: 'paid',
          paidAt: new Date(),
          orders: {
            connect: table.orders.map(o => ({ id: o.id }))
          }
        }
      });

      await tx.order.updateMany({
        where: {
          id: { in: table.orders.map(o => o.id) }
        },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          paymentId: p.id
        }
      });

      await tx.table.update({
        where: { id: tableId },
        data: { status: 'free' }
      });

      return p;
    });

    io.to(restaurantId).emit('payment:created', payment);
    io.to(restaurantId).emit('table:closed', { tableId, paymentId: payment.id });
    io.to(restaurantId).emit('table:updated', { tableId, status: 'free' });
    io.to(restaurantId).emit('revenue:updated', { amount: finalAmount });

    return payment;
  }

  validateTransition(current, next, role) {
    const transitions = {
      NEW: ['COOKING'],
      COOKING: ['READY'],
      READY: ['SERVED'],
      SERVED: ['PAID']
    };

    if (role === 'manager') return;

    if (role === 'kitchen') {
      if (!['COOKING', 'READY'].includes(next)) {
        throw new Error('Kitchen can only set status to COOKING or READY');
      }
    }

    if (role === 'waiter') {
      if (!['SERVED', 'PAID'].includes(next)) {
        throw new Error('Waiter can only set status to SERVED or PAID');
      }
    }

    if (!transitions[current]?.includes(next)) {
      throw new Error(`Invalid transition from ${current} to ${next}`);
    }
  }
}

export default new OrderService();