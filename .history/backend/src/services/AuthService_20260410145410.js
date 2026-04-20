/**
 * Authentication Service
 * Handles login, JWT generation, token verification
 */

import jwt from 'jsonwebtoken';
import * as db from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '24h';

class AuthService {
  /**
   * Login user with username and password
   */
  static login(username, password) {
    const user = db.users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role
      }
    };
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get user by ID
   */
  static getUserById(id) {
    return db.users.find(u => u.id === id);
  }

  /**
   * Register new user (admin only)
   */
  static registerUser(userData, adminRole) {
    if (adminRole !== 'manager') {
      throw new Error('Only managers can register users');
    }

    const newUser = {
      id: db.userIdCounter++,
      name: userData.name,
      username: userData.username,
      password: userData.password,
      role: userData.role,
      createdAt: new Date()
    };

    db.users.push(newUser);
    return newUser;
  }

  /**
   * Get all users (manager only)
   */
  static getAllUsers(role) {
    if (role !== 'manager') {
      throw new Error('Unauthorized');
    }
    return db.users.map(u => ({
      id: u.id,
      name: u.name,
      username: u.username,
      role: u.role,
      createdAt: u.createdAt
    }));
  }
}

export default AuthService;
