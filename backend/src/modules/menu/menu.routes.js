import { Router } from 'express';
import MenuController from './menu.controller.js';
import { authorize } from '../../middleware/auth.js';

const router = Router();

router.get('/categories', MenuController.getCategories);
router.post('/categories', authorize(['manager']), MenuController.createCategory);
router.put('/categories/:id', authorize(['manager']), MenuController.updateCategory);
router.delete('/categories/:id', authorize(['manager']), MenuController.deleteCategory);

router.get('/items', MenuController.getMenuItems);
router.post('/items', authorize(['manager']), MenuController.createMenuItem);
router.put('/items/:id', authorize(['manager']), MenuController.updateMenuItem);
router.delete('/items/:id', authorize(['manager']), MenuController.deleteMenuItem);

export default router;
