import express from 'express';
import * as superAdminController from './superadmin.controller.js';
import { authorize } from '../../middleware/auth.js';

const router = express.Router();

// All routes here require superadmin role
router.use(authorize('superadmin'));

router.get('/stats', superAdminController.getGlobalStats);
router.get('/restaurants', superAdminController.getAllRestaurants);
router.post('/restaurants', superAdminController.createRestaurant);
router.put('/restaurants/:id', superAdminController.updateRestaurant);
router.patch('/restaurants/:id/toggle-status', superAdminController.toggleRestaurantStatus);

router.get('/notifications', superAdminController.getNotifications);
router.post('/notifications/broadcast', superAdminController.broadcastNotification);

export default router;
