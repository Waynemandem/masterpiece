// services/menuService.js

import { collection, 
         getDocs, 
         addDoc,
         updateDoc,
         deleteDoc,
         doc,
         query,
         where,
         _orderBy
         } from "firebase/firestore";
import { db } from "../config/firebase";

// Reference to "menu" collection in Firestore
const MENU_COLLECTION = collection(db, "menu");

/**
 * Fetch all menu items
 * @returns {Promise<MenuItem[]>}
 */


export const getAllMenuItems = async () => {
  try {
    const menuRef = collection(db, MENU_COLLECTION);
    const querySnapshot = await getDocs(menuRef);

    const menuItems = [];
    querySnapshot.forEach((doc) => {
      menuItems.push({
        id: doc.id,
        ...doc.data()
      });
    });
 
    return menuItems;
  } catch (error) {
    console.error('error getting menu items:', error);
  }
};

;

/**
 * Get menu items by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of menu items
 */
export const getMenuItemsByCategory = async (category) => {
  try {
    const menuRef = collection(db, MENU_COLLECTION);
    const q = query(menuRef, where('category', '==', category));
    const querySnapshot = await getDocs(q);
    
    const menuItems = [];
    querySnapshot.forEach((doc) => {
      menuItems.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return menuItems;
  } catch (error) {
    console.error('Error getting menu items by category:', error);
    throw error;
  }
};

/**
 * Get available menu items (in stock)
 * @returns {Promise<Array>} Array of available menu items
 */
export const getAvailableMenuItems = async () => {
  try {
    const menuRef = collection(db, MENU_COLLECTION);
    const q = query(menuRef, where('available', '==', true));
    const querySnapshot = await getDocs(q);
    
    const menuItems = [];
    querySnapshot.forEach((doc) => {
      menuItems.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return menuItems;
  } catch (error) {
    console.error('Error getting available menu items:', error);
    throw error;
  }
};

/**
 * Get a single menu item by ID
 * @param {string} itemId - Menu item ID
 * @returns {Promise<Object>} Menu item data
 */
export const getMenuItem = async (itemId) => {
  try {
    const itemRef = doc(db, MENU_COLLECTION, itemId);
    const itemSnap = await getDocs(itemRef);
    
    if (itemSnap.exists()) {
      return {
        id: itemSnap.id,
        ...itemSnap.data()
      };
    } else {
      throw new Error('Menu item not found');
    }
  } catch (error) {
    console.error('Error getting menu item:', error);
    throw error;
  }
};

/**
 * Get popular menu items
 * @returns {Promise<Array>} Array of popular menu items
 */
export const getPopularMenuItems = async () => {
  try {
    const menuRef = collection(db, MENU_COLLECTION);
    const q = query(menuRef, where('popular', '==', true));
    const querySnapshot = await getDocs(q);
    
    const menuItems = [];
    querySnapshot.forEach((doc) => {
      menuItems.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return menuItems;
  } catch (error) {
    console.error('Error getting popular menu items:', error);
    throw error;
  }
};

// ============================================
// WRITE OPERATIONS (Admin only)
// ============================================

/**
 * Add a new menu item
 * @param {Object} itemData - Menu item data
 * @returns {Promise<string>} ID of created item
 */
export const addMenuItem = async (itemData) => {
  try {
    const menuRef = collection(db, MENU_COLLECTION);
    const docRef = await addDoc(menuRef, {
      ...itemData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

/**
 * Update an existing menu item
 * @param {string} itemId - Menu item ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateMenuItem = async (itemId, updates) => {
  try {
    const itemRef = doc(db, MENU_COLLECTION, itemId);
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

/**
 * Delete a menu item
 * @param {string} itemId - Menu item ID
 * @returns {Promise<void>}
 */
export const deleteMenuItem = async (itemId) => {
  try {
    const itemRef = doc(db, MENU_COLLECTION, itemId);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

/**
 * Toggle item availability (in stock / sold out)
 * @param {string} itemId - Menu item ID
 * @param {boolean} available - Availability status
 * @returns {Promise<void>}
 */
export const toggleItemAvailability = async (itemId, available) => {
  try {
    const itemRef = doc(db, MENU_COLLECTION, itemId);
    await updateDoc(itemRef, {
      available,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error toggling item availability:', error);
    throw error;
  }
};

// ============================================
// BATCH OPERATIONS
// ============================================

/**
 * Initialize menu with default items
 * Useful for first-time setup
 * @param {Array} menuItems - Array of menu items to add
 * @returns {Promise<Array>} Array of created item IDs
 */
export const initializeMenu = async (menuItems) => {
  try {
    const menuRef = collection(db, MENU_COLLECTION);
    const createdIds = [];
    
    for (const item of menuItems) {
      const docRef = await addDoc(menuRef, {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      createdIds.push(docRef.id);
    }
    
    return createdIds;
  } catch (error) {
    console.error('Error initializing menu:', error);
    throw error;
  }
};

export default {
  getAllMenuItems,
  getMenuItemsByCategory,
  getAvailableMenuItems,
  getMenuItem,
  getPopularMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleItemAvailability,
  initializeMenu
};