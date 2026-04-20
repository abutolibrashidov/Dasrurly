/**
 * Tables Module - Service
 * Handles table management
 */

import * as db from '../config/database.js';

class TableService {
  /**
   * Get all tables
   */
  static getAllTables() {
    return db.tables.map(table => {
      const room = db.rooms.find(r => r.id === table.roomId);
      return {
        ...table,
        roomName: room?.name || 'Unknown'
      };
    });
  }

  /**
   * Get tables by room
   */
  static getTablesByRoom(roomId) {
    return db.tables.filter(t => t.roomId === roomId);
  }

  /**
   * Get single table by ID
   */
  static getTableById(id) {
    return db.tables.find(t => t.id === id);
  }

  /**
   * Create table (manager only)
   */
  static createTable(tableData) {
    // Verify room exists
    const room = db.rooms.find(r => r.id === tableData.roomId);
    if (!room) throw new Error('Room not found');

    const newTable = {
  id: (Math.max(...db.tables.map(t => t.id), 0) + 1),
      number: tableData.number,
      roomId: tableData.roomId,
      status: 'free',
      capacity: tableData.capacity || 4,
      createdAt: new Date()
    };

    db.tables.push(newTable);
    return newTable;
  }

  /**
   * Update table (manager only)
   */
  static updateTable(id, updateData) {
    const table = db.tables.find(t => t.id === id);
    if (!table) throw new Error('Table not found');

    if (updateData.number !== undefined) table.number = updateData.number;
    if (updateData.capacity !== undefined) table.capacity = updateData.capacity;
    if (updateData.roomId !== undefined) {
      const room = db.rooms.find(r => r.id === updateData.roomId);
      if (!room) throw new Error('Room not found');
      table.roomId = updateData.roomId;
    }
    table.updatedAt = new Date();

    return table;
  }

  /**
   * Update table status
   * Statuses: free, occupied, reserved, cleaning
   */
  static updateTableStatus(id, status) {
    const table = db.tables.find(t => t.id === id);
    if (!table) throw new Error('Table not found');

    const validStatuses = ['free', 'occupied', 'reserved', 'cleaning'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    table.status = status;
    table.updatedAt = new Date();

    return table;
  }

  /**
   * Delete table (manager only)
   */
  static deleteTable(id) {
    const index = db.tables.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Table not found');

    const deleted = db.tables.splice(index, 1);
    return deleted[0];
  }
}

export default TableService;
