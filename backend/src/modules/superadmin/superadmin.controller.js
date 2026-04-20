import superAdminService from './superadmin.service.js';
import { io } from '../../../server.js';

export const getGlobalStats = async (req, res) => {
  const stats = await superAdminService.getGlobalStats();
  res.json(stats);
};

export const getAllRestaurants = async (req, res) => {
  const restaurants = await superAdminService.getAllRestaurants();
  res.json(restaurants);
};

export const createRestaurant = async (req, res) => {
  const restaurant = await superAdminService.createRestaurant(req.body);
  res.status(201).json(restaurant);
};

export const updateRestaurant = async (req, res) => {
  const restaurant = await superAdminService.updateRestaurant(req.params.id, req.body);
  res.json(restaurant);
};

export const toggleRestaurantStatus = async (req, res) => {
  const restaurant = await superAdminService.toggleRestaurantStatus(req.params.id);
  res.json(restaurant);
};

export const broadcastNotification = async (req, res) => {
  const notification = await superAdminService.broadcastNotification(req.body);
  
  // Emit to all connected clients
  io.emit('system:notification', notification);
  
  res.status(201).json(notification);
};

export const getNotifications = async (req, res) => {
  const notifications = await superAdminService.getNotifications();
  res.json(notifications);
};
