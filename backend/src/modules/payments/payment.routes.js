import { Router } from 'express';
import PaymentController from './payment.controller.js';
import { authorize } from '../../middleware/auth.js';

const router = Router();

router.get('/', authorize(['manager', 'waiter']), PaymentController.getPayments);
router.get('/:id', authorize(['manager', 'waiter']), PaymentController.getPayment);

export default router;
