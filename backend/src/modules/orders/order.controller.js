import OrderService from './order.service.js';
import { z } from 'zod';

const createOrderSchema = z.object({
  tableId: z.string().uuid(),
  notes: z.string().optional(),
  items: z.array(z.object({
    menuItemId: z.string().uuid(),
    quantity: z.number().int().positive()
  })).min(1)
});

const updateStatusSchema = z.object({
  status: z.enum(['NEW', 'COOKING', 'READY', 'SERVED', 'PAID'])
});

const closeTableSchema = z.object({
  method: z.enum(['cash', 'card', 'mixed']),
  amount: z.number().positive().optional()
});

class OrderController {
  async getOrders(req, res) {
    const orders = await OrderService.getOrders(req.user.restaurantId);
    res.json(orders);
  }

  async getMyOrders(req, res) {
    const orders = await OrderService.getMyOrders(
      req.user.restaurantId,
      req.user.userId
    );
    res.json(orders);
  }

  async getKitchenOrders(req, res) {
    const orders = await OrderService.getKitchenOrders(req.user.restaurantId);
    res.json(orders);
  }

  async createOrder(req, res) {
    const data = createOrderSchema.parse(req.body);
    const order = await OrderService.createOrder(
      req.user.restaurantId,
      req.user.userId,
      data
    );
    res.status(201).json(order);
  }

  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = updateStatusSchema.parse(req.body);
    const order = await OrderService.updateStatus(
      req.user.restaurantId,
      id,
      status,
      req.user.role
    );
    res.json(order);
  }

  async closeTable(req, res) {
    const { tableId } = req.params;
    const data = closeTableSchema.parse(req.body);
    const payment = await OrderService.closeTable(req.user.restaurantId, tableId, data);
    res.json(payment);
  }
}

export default new OrderController();