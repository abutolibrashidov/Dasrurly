import MenuService from './menu.service.js';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1)
});

const menuItemSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  categoryId: z.string().uuid(),
  isAvailable: z.boolean().optional()
});

class MenuController {
  async getCategories(req, res) {
    const categories = await MenuService.getCategories(req.user.restaurantId);
    res.json(categories);
  }

  async createCategory(req, res) {
    const data = categorySchema.parse(req.body);
    const category = await MenuService.createCategory(req.user.restaurantId, data);
    res.status(201).json(category);
  }

  async updateCategory(req, res) {
    const data = categorySchema.partial().parse(req.body);
    const category = await MenuService.updateCategory(req.user.restaurantId, req.params.id, data);
    res.json(category);
  }

  async deleteCategory(req, res) {
    await MenuService.deleteCategory(req.user.restaurantId, req.params.id);
    res.status(204).send();
  }

  async getMenuItems(req, res) {
    const items = await MenuService.getMenuItems(req.user.restaurantId);
    res.json(items);
  }

  async createMenuItem(req, res) {
    const data = menuItemSchema.parse(req.body);
    const item = await MenuService.createMenuItem(req.user.restaurantId, data);
    res.status(201).json(item);
  }

  async updateMenuItem(req, res) {
    const data = menuItemSchema.partial().parse(req.body);
    const item = await MenuService.updateMenuItem(req.user.restaurantId, req.params.id, data);
    res.json(item);
  }

  async deleteMenuItem(req, res) {
    await MenuService.deleteMenuItem(req.user.restaurantId, req.params.id);
    res.status(204).send();
  }
}

export default new MenuController();
