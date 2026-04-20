import prisma from '../../config/prisma.js';

class RoomService {
  async getRooms(restaurantId) {
    return prisma.room.findMany({
      where: { restaurantId },
      include: { tables: true }
    });
  }

  async createRoom(restaurantId, data) {
    return prisma.room.create({
      data: {
        ...data,
        restaurantId
      }
    });
  }

  async updateRoom(restaurantId, id, data) {
    const room = await prisma.room.findFirst({
      where: { id, restaurantId }
    });

    if (!room) {
      throw new Error('Room not found or access denied');
    }

    return prisma.room.update({
      where: { id },
      data
    });
  }

  async deleteRoom(restaurantId, id) {
    const room = await prisma.room.findFirst({
      where: { id, restaurantId }
    });

    if (!room) {
      throw new Error('Room not found or access denied');
    }

    return prisma.room.delete({
      where: { id }
    });
  }
}

class TableService {
  async getTables(restaurantId) {
    return prisma.table.findMany({
      where: { restaurantId },
      include: { room: true }
    });
  }

  async createTable(restaurantId, data) {
    // Validate room belongs to same restaurant
    const room = await prisma.room.findFirst({
      where: { id: data.roomId, restaurantId }
    });

    if (!room) {
      throw new Error('Room not found or access denied');
    }

    return prisma.table.create({
      data: {
        ...data,
        restaurantId
      }
    });
  }

  async updateStatus(restaurantId, id, status) {
    const table = await prisma.table.findFirst({
      where: { id, restaurantId }
    });

    if (!table) {
      throw new Error('Table not found');
    }

    return prisma.table.update({
      where: { id },
      data: { status }
    });
  }

  async updateTable(restaurantId, id, data) {
    const table = await prisma.table.findFirst({
      where: { id, restaurantId }
    });

    if (!table) {
      throw new Error('Table not found or access denied');
    }

    return prisma.table.update({
      where: { id },
      data
    });
  }

  async deleteTable(restaurantId, id) {
    const table = await prisma.table.findFirst({
      where: { id, restaurantId }
    });

    if (!table) {
      throw new Error('Table not found or access denied');
    }

    return prisma.table.delete({
      where: { id }
    });
  }
}

export const roomService = new RoomService();
export const tableService = new TableService();
