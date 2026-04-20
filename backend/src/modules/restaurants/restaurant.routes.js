import { Router } from 'express';
import RestaurantController from './restaurant.controller.js';
import { authorize } from '../../middleware/auth.js';

const router = Router();

router.get('/me', RestaurantController.getInfo);
router.patch('/me', authorize(['manager']), RestaurantController.update);

export default router;
