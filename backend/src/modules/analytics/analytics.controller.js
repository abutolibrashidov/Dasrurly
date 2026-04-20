import AnalyticsService from './analytics.service.js';
import { z } from 'zod';

const revenueQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(90).default(7)
});

const topDishesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10)
});

class AnalyticsController {
  async getStats(req, res) {
    const stats = await AnalyticsService.getDashboardStats(req.user.restaurantId);
    res.json(stats);
  }

  async getRevenue(req, res) {
    const { days } = revenueQuerySchema.parse(req.query);
    const data = await AnalyticsService.getRevenue(req.user.restaurantId, days);
    res.json(data);
  }

  async getPeakHours(req, res) {
    const data = await AnalyticsService.getPeakHours(req.user.restaurantId);
    res.json(data);
  }

  async getTopDishes(req, res) {
    const { limit } = topDishesQuerySchema.parse(req.query);
    const data = await AnalyticsService.getTopDishes(req.user.restaurantId, limit);
    res.json(data);
  }
}

export default new AnalyticsController();