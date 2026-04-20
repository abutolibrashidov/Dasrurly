import PaymentService from './payment.service.js';

class PaymentController {
  async getPayments(req, res) {
    const payments = await PaymentService.getPayments(req.user.restaurantId);
    res.json(payments);
  }

  async getPayment(req, res) {
    const payment = await PaymentService.getPaymentById(req.user.restaurantId, req.params.id);
    res.json(payment);
  }
}

export default new PaymentController();
