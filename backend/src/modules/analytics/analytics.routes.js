import { Router } from 'express';
import AnalyticsController from './analytics.controller.js';
import { authorize } from '../../middleware/auth.js';

const router = Router();

// All analytics endpoints are manager-only
router.get('/stats',      authorize(['manager']), AnalyticsController.getStats);
router.get('/revenue',    authorize(['manager']), AnalyticsController.getRevenue);
router.get('/peak-hours', authorize(['manager']), AnalyticsController.getPeakHours);
router.get('/top-dishes', authorize(['manager']), AnalyticsController.getTopDishes);

export default router;