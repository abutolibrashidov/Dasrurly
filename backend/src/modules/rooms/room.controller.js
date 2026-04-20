import { roomService, tableService } from './room.service.js';
import { z } from 'zod';

const roomSchema = z.object({
  name: z.string().min(1),
  type: z.string().optional()
});

const tableSchema = z.object({
  number: z.number().int().positive(),
  capacity: z.number().int().positive(),
  roomId: z.string().uuid()
});

class RoomController {
  async getRooms(req, res) {
    const rooms = await roomService.getRooms(req.user.restaurantId);
    res.json(rooms);
  }

  async createRoom(req, res) {
    const data = roomSchema.parse(req.body);
    const room = await roomService.createRoom(req.user.restaurantId, data);
    res.status(201).json(room);
  }

  async updateRoom(req, res) {
    const data = roomSchema.partial().parse(req.body);
    const room = await roomService.updateRoom(req.user.restaurantId, req.params.id, data);
    res.json(room);
  }

  async deleteRoom(req, res) {
    await roomService.deleteRoom(req.user.restaurantId, req.params.id);
    res.status(204).send();
  }
}

class TableController {
  async getTables(req, res) {
    const tables = await tableService.getTables(req.user.restaurantId);
    res.json(tables);
  }

  async createTable(req, res) {
    const data = tableSchema.parse(req.body);
    const table = await tableService.createTable(req.user.restaurantId, data);
    res.status(201).json(table);
  }

  async updateTable(req, res) {
    const data = tableSchema.partial().parse(req.body);
    const table = await tableService.updateTable(req.user.restaurantId, req.params.id, data);
    res.json(table);
  }

  async deleteTable(req, res) {
    await tableService.deleteTable(req.user.restaurantId, req.params.id);
    res.status(204).send();
  }
}

export const roomController = new RoomController();
export const tableController = new TableController();
