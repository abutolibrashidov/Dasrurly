import { Router } from 'express';
import { roomController, tableController } from './room.controller.js';
import { authorize } from '../../middleware/auth.js';

const router = Router();

// Room routes
router.get('/', roomController.getRooms);
router.post('/', authorize(['manager']), roomController.createRoom);
router.put('/:id', authorize(['manager']), roomController.updateRoom);
router.delete('/:id', authorize(['manager']), roomController.deleteRoom);

// Table routes
router.get('/tables', tableController.getTables);
router.post('/tables', authorize(['manager']), tableController.createTable);
router.put('/tables/:id', authorize(['manager']), tableController.updateTable);
router.delete('/tables/:id', authorize(['manager']), tableController.deleteTable);

export default router;
