import UserService from './user.service.js';
import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['manager', 'waiter', 'kitchen'])
});

class UserController {
  async getUsers(req, res) {
    const users = await UserService.getUsers(req.user.restaurantId);
    res.json(users);
  }

  async createUser(req, res) {
    const data = userSchema.parse(req.body);
    const user = await UserService.createUser(req.user.restaurantId, data);
    res.status(201).json(user);
  }

  async updateUser(req, res) {
    const data = userSchema.partial().parse(req.body);
    const user = await UserService.updateUser(req.user.restaurantId, req.params.id, data);
    res.json(user);
  }

  async deleteUser(req, res) {
    await UserService.deleteUser(req.user.restaurantId, req.params.id);
    res.status(204).send();
  }
  
  async impersonateUser(req, res) {
    const { userId } = req.params;
    const token = await UserService.generateImpersonationToken(req.user.restaurantId, userId);
    res.json({ token });
  }

  async updateProfile(req, res) {
    const data = userSchema.partial().parse(req.body);
    const user = await UserService.updateUser(req.user.restaurantId, req.user.userId, data);
    res.json(user);
  }
}

export default new UserController();
