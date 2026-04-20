import { Router } from 'express';
import { tableController } from '../rooms/room.controller.js';
import { authorize } from '../../middleware/auth.js';

const router = Router();

router.get('/', tableController.getTables);
router.post('/', authorize(['manager']), tableController.createTable);

export default router;
