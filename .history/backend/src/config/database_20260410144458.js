/**
 * In-Memory Database
 * Used for MVP - can be replaced with MongoDB/PostgreSQL later
 */

// Users (Staff)
let users = [
  {
    id: 1,
    name: 'Admin',
    username: 'admin',
    password: 'admin123',
    role: 'manager',
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'Alisher',
    username: 'waiter1',
    password: 'pass123',
    role: 'waiter',
    createdAt: new Date()
  },
  {
    id: 3,
    name: 'Sayarjon',
    username: 'kitchen1',
    password: 'pass123',
    role: 'kitchen',
    createdAt: new Date()
  }
];

// Categories
let categories = [
  { id: 1, name: 'Palovlar', description: 'O\'rmach taomlar' },
  { id: 2, name: 'Ichakli taomlar', description: 'Manti, Samsa' },
  { id: 3, name: 'Shashlik', description: 'Goshtli taomlar' },
  { id: 4, name: 'Ichimliklar', description: 'Choy, suv' }
];

// Menu Items
let menuItems = [
  { id: 1, name: 'Plov', price: 25000, categoryId: 1, isAvailable: true, createdAt: new Date() },
  { id: 2, name: 'Manti', price: 18000, categoryId: 2, isAvailable: true, createdAt: new Date() },
  { id: 3, name: 'Shashlik', price: 22000, categoryId: 3, isAvailable: true, createdAt: new Date() },
  { id: 4, name: 'Lagman', price: 20000, categoryId: 1, isAvailable: true, createdAt: new Date() },
  { id: 5, name: 'Dimlama', price: 24000, categoryId: 1, isAvailable: true, createdAt: new Date() },
  { id: 6, name: 'Samsa', price: 12000, categoryId: 2, isAvailable: true, createdAt: new Date() },
  { id: 7, name: 'Palov', price: 28000, categoryId: 1, isAvailable: true, createdAt: new Date() },
  { id: 8, name: 'Kabob', price: 26000, categoryId: 3, isAvailable: true, createdAt: new Date() }
];

// Rooms (Spaces)
let rooms = [
  { id: 1, name: 'Hall', type: 'main', capacity: 50, createdAt: new Date() },
  { id: 2, name: 'VIP', type: 'vip', capacity: 20, createdAt: new Date() },
  { id: 3, name: 'Choyxona', type: 'outdoor', capacity: 30, createdAt: new Date() }
];

// Tables
let tables = [
  { id: 1, number: 1, roomId: 1, status: 'free', capacity: 4, createdAt: new Date() },
  { id: 2, number: 2, roomId: 1, status: 'free', capacity: 4, createdAt: new Date() },
  { id: 3, number: 3, roomId: 1, status: 'free', capacity: 6, createdAt: new Date() },
  { id: 4, number: 4, roomId: 1, status: 'free', capacity: 4, createdAt: new Date() },
  { id: 5, number: 5, roomId: 2, status: 'free', capacity: 8, createdAt: new Date() },
  { id: 6, number: 6, roomId: 2, status: 'free', capacity: 8, createdAt: new Date() },
  { id: 7, number: 7, roomId: 3, status: 'free', capacity: 6, createdAt: new Date() },
  { id: 8, number: 8, roomId: 3, status: 'free', capacity: 6, createdAt: new Date() }
];

// Orders
let orders = [];
let orderIdCounter = 1;

// Counters for IDs
let userIdCounter = 4;
let categoryIdCounter = 5;
let menuIdCounter = 9;
let roomIdCounter = 4;
let tableIdCounter = 9;

export {
  // Users
  users,
  userIdCounter,
  
  // Categories
  categories,
  categoryIdCounter,
  
  // Menu Items
  menuItems,
  menuIdCounter,
  
  // Rooms
  rooms,
  roomIdCounter,
  
  // Tables
  tables,
  tableIdCounter,
  
  // Orders
  orders,
  orderIdCounter
};
