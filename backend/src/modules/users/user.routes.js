import { Router } from 'express';
import UserController from './user.controller.js';
import { authorize } from '../../middleware/auth.js';

const router = Router();

router.get('/', authorize(['manager']), UserController.getUsers);
router.post('/', authorize(['manager']), UserController.createUser);
router.put('/:id', authorize(['manager']), UserController.updateUser);
router.delete('/:id', authorize(['manager']), UserController.deleteUser);
router.post('/impersonate/:userId', authorize(['manager']), UserController.impersonateUser);
router.patch('/profile', UserController.updateProfile);

export default router;
