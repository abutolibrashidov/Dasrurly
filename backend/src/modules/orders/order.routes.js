import { Router } from 'express';
import OrderController from './order.controller.js';
import { authorize } from '../../middleware/auth.js';

const router = Router();

// Manager sees all orders; waiter uses /my instead
router.get('/', authorize(['manager']), OrderController.getOrders);

// Kitchen sees only active orders (NEW, COOKING, READY) for the restaurant
router.get('/kitchen', authorize(['kitchen', 'manager']), OrderController.getKitchenOrders);

// Waiter sees only their own active orders
router.get('/my', authorize(['waiter', 'manager']), OrderController.getMyOrders);

// Only waiters and managers can create orders
router.post('/', authorize(['waiter', 'manager']), OrderController.createOrder);

// All roles can update status — service validates the transition per role
router.patch('/:id/status', authorize(['waiter', 'kitchen', 'manager']), OrderController.updateStatus);

// Only waiters and managers can close a table (take payment)
router.post('/table/:tableId/close', authorize(['waiter', 'manager']), OrderController.closeTable);

export default router;