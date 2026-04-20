import prisma from '../../config/prisma.js';
import { io } from '../../../server.js';

class PaymentService {
  async getPayments(restaurantId) {
    return prisma.payment.findMany({
      where: { restaurantId },
      include: { orders: true, table: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPaymentById(restaurantId, id) {
    const payment = await prisma.payment.findFirst({
      where: { id, restaurantId },
      include: { orders: true, table: true }
    });
    if (!payment) throw new Error('Payment not found');
    return payment;
  }
}

export default new PaymentService();
