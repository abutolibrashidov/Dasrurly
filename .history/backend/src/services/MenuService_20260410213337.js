/**
 * Menu Module - Service
 * Handles menu items and categories
 */

import * as db from '../config/database.js';

class MenuService {
  /**
   * Get all menu items
   */
  static getAllItems() {
    return db.menuItems.map(item => {
      const category = db.categories.find(c => c.id === item.categoryId);
      return {
        ...item,
        category: category?.name || 'Unknown'
      };
    });
  }

  /**
   * Get menu items by category
   */
  static getItemsByCategory(categoryId) {
    return db.menuItems.filter(item => item.categoryId === categoryId);
  }

  /**
   * Get single menu item
   */
  static getItemById(id) {
    return db.menuItems.find(item => item.id === id);
  }

  /**
   * Create menu item (manager only)
   */
  static createItem(itemData) {
    const newItem = {
  id: (Math.max(...db.menuItems.map(i => i.id), 0) + 1),
      name: itemData.name,
      price: itemData.price,
      categoryId: itemData.categoryId,
      isAvailable: itemData.isAvailable !== false,
      createdAt: new Date()
    };

    db.menuItems.push(newItem);
    return newItem;
  }

  /**
   * Update menu item (manager only)
   */
  static updateItem(id, updateData) {
    const item = db.menuItems.find(i => i.id === id);
    if (!item) throw new Error('Menu item not found');

    if (updateData.name !== undefined) item.name = updateData.name;
    if (updateData.price !== undefined) item.price = updateData.price;
    if (updateData.categoryId !== undefined) item.categoryId = updateData.categoryId;
    if (updateData.isAvailable !== undefined) item.isAvailable = updateData.isAvailable;
    item.updatedAt = new Date();

    return item;
  }

  /**
   * Delete menu item (manager only)
   */
  static deleteItem(id) {
    const index = db.menuItems.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Menu item not found');
    
    const deleted = db.menuItems.splice(index, 1);
    return deleted[0];
  }

  /**
   * Get all categories
   */
  static getAllCategories() {
    return db.categories;
  }

  /**
   * Create category (manager only)
   */
  static createCategory(categoryData) {
    const newCategory = {
      id: db.categoryIdCounter++,
      name: categoryData.name,
      description: categoryData.description || ''
    };

    db.categories.push(newCategory);
    return newCategory;
  }

  /**
   * Update category (manager only)
   */
  static updateCategory(id, updateData) {
    const category = db.categories.find(c => c.id === id);
    if (!category) throw new Error('Category not found');

    if (updateData.name !== undefined) category.name = updateData.name;
    if (updateData.description !== undefined) category.description = updateData.description;

    return category;
  }

  /**
   * Delete category (manager only)
   */
  static deleteCategory(id) {
    const index = db.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    const deleted = db.categories.splice(index, 1);
    return deleted[0];
  }
}

export default MenuService;
