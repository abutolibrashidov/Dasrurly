/**
 * Orders Module - Service
 * Handles order management
 */

const db = require('../config/database');

class OrderService {
  /**
   * Get all orders
   */
  static getAllOrders() {
    return db.orders.map(order => this._enrichOrder(order));
  }

  /**
   * Get orders by table
   */
  static getOrdersByTable(tableId) {
    return db.orders
      .filter(o => o.tableId === tableId)
      .map(order => this._enrichOrder(order));
  }

  /**
   * Get active orders (NEW, COOKING)
   */
  static getActiveOrders() {
    return db.orders
      .filter(o => ['NEW', 'COOKING'].includes(o.status))
      .map(order => this._enrichOrder(order));
  }

  /**
   * Get ready orders
   */
  static getReadyOrders() {
    return db.orders
      .filter(o => o.status === 'READY')
      .map(order => this._enrichOrder(order));
  }

  /**
   * Get single order by ID
   */
  static getOrderById(id) {
    const order = db.orders.find(o => o.id === id);
    return order ? this._enrichOrder(order) : null;
  }

  /**
   * Create order (waiter only)
   */
  static createOrder(orderData, waiterId) {
    // Verify table exists
    const table = db.tables.find(t => t.id === orderData.tableId);
    if (!table) throw new Error('Table not found');

    // Verify all items exist
    for (const item of orderData.items) {
      const menuItem = db.menuItems.find(m => m.id === item.id);
      if (!menuItem) throw new Error(`Menu item ${item.id} not found`);
    }

    const newOrder = {
      id: db.orderIdCounter++,
      tableId: orderData.tableId,
      waiterId: waiterId,
      items: orderData.items,
      status: 'NEW',
      totalPrice: orderData.items.reduce((sum, item) => {
        const menuItem = db.menuItems.find(m => m.id === item.id);
        return sum + (menuItem?.price || 0);
      }, 0),
      notes: orderData.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    db.orders.push(newOrder);

    // Update table status to occupied
    table.status = 'occupied';

    return this._enrichOrder(newOrder);
  }

  /**
   * Update order status (kitchen only)
   * Statuses: NEW → COOKING → READY
   */
  static updateOrderStatus(id, status) {
    const order = db.orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');

    const validStatuses = ['NEW', 'COOKING', 'READY'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    order.status = status;
    order.updatedAt = new Date();

    // If order is ready, mark table as free after serving
    if (status === 'READY') {
      const table = db.tables.find(t => t.id === order.tableId);
      if (table) {
        // Table becomes free after order is picked up
        // This can be triggered by waiter
      }
    }

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

    // Free the table
    const table = db.tables.find(t => t.id === order.tableId);
    if (table) {
      table.status = 'free';
    }

    return this._enrichOrder(order);
  }

  /**
   * Get analytics (manager only)
   */
  static getAnalytics() {
    const today = new Date().toDateString();
    const ordersToday = db.orders.filter(o => new Date(o.createdAt).toDateString() === today);

    return {
      totalOrders: db.orders.length,
      ordersToday: ordersToday.length,
      activeOrders: db.orders.filter(o => ['NEW', 'COOKING'].includes(o.status)).length,
      readyOrders: db.orders.filter(o => o.status === 'READY').length,
      occupiedTables: db.tables.filter(t => t.status === 'occupied').length,
      totalTables: db.tables.length,
      averageOrderValue: ordersToday.length > 0 
        ? Math.round(ordersToday.reduce((sum, o) => sum + o.totalPrice, 0) / ordersToday.length)
        : 0
    };
  }

  /**
   * Enrich order with table and items data
   */
  static _enrichOrder(order) {
    const table = db.tables.find(t => t.id === order.tableId);
    const room = table ? db.rooms.find(r => r.id === table.roomId) : null;
    const waiter = db.users.find(u => u.id === order.waiterId);

    return {
      ...order,
      table: table ? { id: table.id, number: table.number } : null,
      room: room ? { id: room.id, name: room.name } : null,
      waiter: waiter ? { id: waiter.id, name: waiter.name } : null
    };
  }
}

module.exports = OrderService;
