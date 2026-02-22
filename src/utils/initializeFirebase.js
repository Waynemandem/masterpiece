// Initialize Firebase with menu data
// Run this once to populate your database
// src/utils/initializeFirebase.js

import { initializeMenu } from '../services/menuService';

/**
 * Initialize Firebase with menu items
 * This should be run ONCE after Firebase setup
 */
export const initializeFirebaseData = async () => {
  try {
    console.log('🔥 Starting Firebase initialization...');
    
    // Import menu data dynamically to handle different export formats
    const menuDataModule = await import('../data/menuData');
    
    // Handle both default and named exports
    let menuData;
    if (menuDataModule.default) {
      menuData = menuDataModule.default;
    } else if (Array.isArray(menuDataModule)) {
      menuData = menuDataModule;
    } else {
      // If it's an object with menuData property
      menuData = menuDataModule.menuData || Object.values(menuDataModule)[0];
    }
    
    // Verify it's an array
    if (!Array.isArray(menuData)) {
      console.error('❌ menuData is not an array:', menuData);
      throw new Error('menuData must be an array. Check your menuData.js export format.');
    }
    
    console.log(`📋 Found ${menuData.length} menu items to upload`);
    
    if (menuData.length === 0) {
      throw new Error('menuData is empty! No items to upload.');
    }
    
    // Upload menu items
    console.log('📤 Uploading menu items to Firebase...');
    const createdIds = await initializeMenu(menuData);
    
    console.log('✅ Menu initialization complete!');
    console.log(`📊 Created ${createdIds.length} menu items`);
    console.log('🎉 Firebase is ready to use!');
    
    return {
      success: true,
      menuItemsCreated: createdIds.length,
      ids: createdIds
    };
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    console.error('Error details:', error.message);
    throw error;
  }
};

/**
 * Check if menu is already initialized
 * @returns {Promise<boolean>} True if menu has items
 */
export const isMenuInitialized = async () => {
  try {
    const { getAllMenuItems } = await import('../services/menuService');
    const items = await getAllMenuItems();
    return items.length > 0;
  } catch (error) {
    console.error('Error checking menu initialization:', error);
    return false;
  }
};

// Export for use in admin panel or setup page
export default initializeFirebaseData;