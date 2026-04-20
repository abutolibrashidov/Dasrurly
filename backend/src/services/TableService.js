/**
 * Tables Module - Service
 * Handles table management
 *
 * NOTE: Add getAllTablesWithRoom() below to your existing TableService.
 * The rest of this file shows where it fits — merge it in, don't replace.
 */

import * as db from '../config/database.js';

class TableService {
  static getAllTables() {
    return db.tables;
  }

  // ✅ NEW: Flat table list with room name joined.
  //         Used by GET /api/tables/all (waiter + manager role).
  //         Replaces the old client-side pattern of fetching rooms then
  //         looping /api/tables/room/:id — which required manager access.
  static getAllTablesWithRoom() {
    return db.tables.map(table => {
      const room = db.rooms.find(r => r.id === table.roomId);
      return {
        id:       table.id,
        number:   table.number,
        status:   table.status,
        capacity: table.capacity,
        roomId:   table.roomId,
        roomName: room ? room.name : null,
      };
    });
  }

  static getTablesByRoom(roomId) {
    return db.tables.filter(t => t.roomId === roomId);
  }

  static getTableById(id) {
    return db.tables.find(t => t.id === id) || null;
  }

  static createTable(tableData) {
    const room = db.rooms.find(r => r.id === tableData.roomId);
    if (!room) throw new Error('Room not found');

    const newTable = {
      id:       (Math.max(...db.tables.map(t => t.id), 0) + 1),
      number:   tableData.number,
      roomId:   tableData.roomId,
      capacity: tableData.capacity || 4,
      status:   'free',
    };

    db.tables.push(newTable);
    return newTable;
  }

  static updateTable(id, tableData) {
    const table = db.tables.find(t => t.id === id);
    if (!table) throw new Error('Table not found');

    if (tableData.number   !== undefined) table.number   = tableData.number;
    if (tableData.capacity !== undefined) table.capacity = tableData.capacity;
    if (tableData.roomId   !== undefined) {
      const room = db.rooms.find(r => r.id === tableData.roomId);
      if (!room) throw new Error('Room not found');
      table.roomId = tableData.roomId;
    }

    return table;
  }

  static updateTableStatus(id, status) {
    const table = db.tables.find(t => t.id === id);
    if (!table) throw new Error('Table not found');

    const validStatuses = ['free', 'occupied', 'reserved'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    table.status = status;
    return table;
  }

  static deleteTable(id) {
    const idx = db.tables.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Table not found');
    return db.tables.splice(idx, 1)[0];
  }
}

export default TableService;