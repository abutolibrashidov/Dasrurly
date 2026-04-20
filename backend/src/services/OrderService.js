/**
 * Orders Module - Service
 * Handles order management
 */

import * as db from '../config/database.js';

class OrderService {
  static getAllOrders() {
    return db.orders.map(order => this._enrichOrder(order));
  }

  static getOrdersByTable(tableId) {
    return db.orders
      .filter(o => o.tableId === tableId)
      .map(order => this._enrichOrder(order));
  }

  // ✅ NEW: Each waiter sees only their own submitted orders.
  //         Used by GET /api/orders/mine and socket waiter:requestMyOrders.
  static getOrdersByWaiter(waiterId) {
    return db.orders
      .filter(o => o.waiterId === waiterId)
      .map(order => this._enrichOrder(order));
  }

  static getActiveOrders() {
    return db.orders
      .filter(o => ['NEW', 'COOKING'].includes(o.status))
      .map(order => this._enrichOrder(order));
  }

  static getReadyOrders() {
    return db.orders
      .filter(o => o.status === 'READY')
      .map(order => this._enrichOrder(order));
  }

  static getOrderById(id) {
    const order = db.orders.find(o => o.id === id);
    return order ? this._enrichOrder(order) : null;
  }

  /**
   * Create order (waiter only)
   * Expects: { tableId, items: [{ id }], notes? }
   * waiterId comes from req.user.id (JWT) — never from request body
   */
  static createOrder(orderData, waiterId) {
    const table = db.tables.find(t => t.id === orderData.tableId);
    if (!table) throw new Error('Table not found');

    for (const item of orderData.items) {
      const menuItem = db.menuItems.find(m => m.id === item.id);
      if (!menuItem) throw new Error(`Menu item ${item.id} not found`);
    }

    const newOrder = {
      id:         (Math.max(...db.orders.map(o => o.id), 0) + 1),
      tableId:    orderData.tableId,
      waiterId:   waiterId,
      items:      orderData.items.map(item => ({ id: item.id })),
      status:     'NEW',
      totalPrice: orderData.items.reduce((sum, item) => {
        const menuItem = db.menuItems.find(m => m.id === item.id);
        return sum + (menuItem?.price || 0);
      }, 0),
      notes:      orderData.notes || '',
      createdAt:  new Date(),
      updatedAt:  new Date(),
    };

    db.orders.push(newOrder);
    table.status = 'occupied';

    return this._enrichOrder(newOrder);
  }

  /**
   * Update order status (kitchen only)
   * NEW → COOKING → READY
   */
  static updateOrderStatus(id, status) {
    const order = db.orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');

    const validStatuses = ['NEW', 'COOKING', 'READY'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    order.status    = status;
    order.updatedAt = new Date();

    return this._enrichOrder(order);
  }

  /**
   * Complete order (waiter marks as delivered)
   */
  static completeOrder(id) {
    const order = db.orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');

    if (order.status !== 'READY') {
      throw new Error('Order must be READY before completing');
    }

    order.completedAt = new Date();

    const table = db.tables.find(t => t.id === order.tableId);
    if (table) table.status = 'free';

    return this._enrichOrder(order);
  }

  static getAnalytics() {
    const today       = new Date().toDateString();
    const ordersToday = db.orders.filter(o => new Date(o.createdAt).toDateString() === today);

    return {
      totalOrders:       db.orders.length,
      ordersToday:       ordersToday.length,
      activeOrders:      db.orders.filter(o => ['NEW', 'COOKING'].includes(o.status)).length,
      readyOrders:       db.orders.filter(o => o.status === 'READY').length,
      occupiedTables:    db.tables.filter(t => t.status === 'occupied').length,
      totalTables:       db.tables.length,
      averageOrderValue: ordersToday.length > 0
        ? Math.round(ordersToday.reduce((sum, o) => sum + o.totalPrice, 0) / ordersToday.length)
        : 0,
    };
  }

  /**
   * Enrich order with resolved table, room, waiter, and full item details.
   * Items stored as [{ id }] — resolved to { id, name, price, category } at read time.
   */
  static _enrichOrder(order) {
    const table  = db.tables.find(t => t.id === order.tableId);
    const room   = table ? db.rooms.find(r => r.id === table.roomId) : null;
    const waiter = db.users.find(u => u.id === order.waiterId);

    const enrichedItems = order.items.map(item => {
      const menuItem = db.menuItems.find(m => m.id === item.id);
      return menuItem
        ? { id: menuItem.id, name: menuItem.name, price: menuItem.price, category: menuItem.category }
        : { id: item.id, name: null, price: 0 }; // graceful fallback if item deleted
    });

    return {
      ...order,
      items:  enrichedItems,
      table:  table  ? { id: table.id,  number: table.number }  : null,
      room:   room   ? { id: room.id,   name: room.name }       : null,
      waiter: waiter ? { id: waiter.id, name: waiter.name }     : null,
    };
  }
}

export default OrderService;