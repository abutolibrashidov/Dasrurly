/**
 * Rooms Module - Service
 * Handles rooms (spaces) management
 */

import * as db from '../config/database.js';

class RoomService {
  /**
   * Get all rooms
   */
  static getAllRooms() {
    return db.rooms.map(room => {
      const roomTables = db.tables.filter(t => t.roomId === room.id);
      return {
        ...room,
        tableCount: roomTables.length,
        freeTables: roomTables.filter(t => t.status === 'free').length,
        occupiedTables: roomTables.filter(t => t.status === 'occupied').length
      };
    });
  }

  /**
   * Get single room by ID
   */
  static getRoomById(id) {
    return db.rooms.find(r => r.id === id);
  }

  /**
   * Create room (manager only)
   */
  static createRoom(roomData) {
    const newRoom = {
      id: db.roomIdCounter++,
      name: roomData.name,
      type: roomData.type,
      capacity: roomData.capacity,
      createdAt: new Date()
    };

    db.rooms.push(newRoom);
    return newRoom;
  }

  /**
   * Update room (manager only)
   */
  static updateRoom(id, updateData) {
    const room = db.rooms.find(r => r.id === id);
    if (!room) throw new Error('Room not found');

    if (updateData.name !== undefined) room.name = updateData.name;
    if (updateData.type !== undefined) room.type = updateData.type;
    if (updateData.capacity !== undefined) room.capacity = updateData.capacity;
    room.updatedAt = new Date();

    return room;
  }

  /**
   * Delete room (manager only)
   */
  static deleteRoom(id) {
    const index = db.rooms.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Room not found');

    // Check if room has tables
    const roomTables = db.tables.filter(t => t.roomId === id);
    if (roomTables.length > 0) {
      throw new Error('Cannot delete room with tables. Delete tables first.');
    }

    const deleted = db.rooms.splice(index, 1);
    return deleted[0];
  }
}

module.exports = RoomService;
