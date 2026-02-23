// Robust Firebase Initialization
// src/utils/initializeFirebase.js

import { initializeMenu } from '../services/menuService';

/**
 * Initialize Firebase with menu items
 * This should be run ONCE after Firebase setup
 */
export const initializeFirebaseData = async () => {
  try {
    console.log('🔥 Starting Firebase initialization...');
    console.log('⏰ Time:', new Date().toLocaleTimeString());
    
    // Step 1: Import menu data
    console.log('📦 Step 1/4: Loading menu data...');
    const menuDataModule = await import('../data/menuData');
    
    // Handle both default and named exports
    let menuData;
    if (menuDataModule.default) {
      menuData = menuDataModule.default;
    } else if (Array.isArray(menuDataModule)) {
      menuData = menuDataModule;
    } else {
      menuData = menuDataModule.menuData || Object.values(menuDataModule)[0];
    }
    
    // Step 2: Validate data
    console.log('✅ Step 2/4: Validating data...');
    if (!Array.isArray(menuData)) {
      console.error('❌ menuData is not an array:', menuData);
      throw new Error('menuData must be an array. Check your menuData.js export format.');
    }
    
    if (menuData.length === 0) {
      throw new Error('menuData is empty! No items to upload.');
    }
    
    console.log(`✅ Validation passed: Found ${menuData.length} items`);
    
    // Show first item as sample
    console.log('📋 Sample item:', {
      id: menuData[0].id,
      name: menuData[0].name,
      category: menuData[0].category,
      price: menuData[0].price
    });
    
    // Step 3: Upload to Firebase
    console.log('📤 Step 3/4: Uploading to Firebase...');
    console.log('⏳ This may take 30-60 seconds...');
    
    const createdIds = await initializeMenu(menuData);
    
    // Step 4: Verify upload
    console.log('✅ Step 4/4: Verifying upload...');
    console.log(`📊 Successfully uploaded ${createdIds.length} out of ${menuData.length} items`);
    
    if (createdIds.length === 0) {
      throw new Error('No items were uploaded! Check Firebase permissions.');
    }
    
    if (createdIds.length < menuData.length) {
      console.warn(`⚠️ Warning: Only ${createdIds.length}/${menuData.length} items uploaded`);
      console.warn('Some items may have failed. Check console for errors.');
    }
    
    // Show created IDs
    console.log('🆔 Firebase IDs created:', createdIds);
    
    console.log('✅ Menu initialization complete!');
    console.log('🎉 Firebase is ready to use!');
    console.log('⏰ Completed at:', new Date().toLocaleTimeString());
    
    return {
      success: true,
      menuItemsCreated: createdIds.length,
      totalItems: menuData.length,
      ids: createdIds,
      allUploaded: createdIds.length === menuData.length
    };
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    console.error('📝 Error name:', error.name);
    console.error('📝 Error message:', error.message);
    console.error('📝 Error stack:', error.stack);
    
    // Provide helpful error messages
    if (error.message.includes('permission')) {
      console.error('');
      console.error('🔒 PERMISSION ERROR:');
      console.error('1. Go to Firebase Console');
      console.error('2. Firestore Database → Rules');
      console.error('3. Set: allow read, write: if true;');
      console.error('4. Click Publish');
    }
    
    if (error.message.includes('not found') || error.message.includes('404')) {
      console.error('');
      console.error('📁 FILE NOT FOUND:');
      console.error('Make sure menuData.js exists at:');
      console.error('src/data/menuData.js');
    }
    
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
    console.log(`📊 Firebase currently has ${items.length} items`);
    return items.length > 0;
  } catch (error) {
    console.error('Error checking menu initialization:', error);
    return false;
  }
};

/**
 * Clear all menu items from Firebase (use with caution!)
 * @returns {Promise<number>} Number of items deleted
 */
export const clearAllMenuItems = async () => {
  try {
    console.log('🗑️ Clearing all menu items from Firebase...');
    const { getAllMenuItems, deleteMenuItem } = await import('../services/menuService');
    
    const items = await getAllMenuItems();
    console.log(`Found ${items.length} items to delete`);
    
    let deletedCount = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      console.log(`Deleting ${i + 1}/${items.length}: ${item.name}`);
      try {
        await deleteMenuItem(item.id);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete ${item.name}:`, error.message);
      }
    }
    
    console.log(`✅ Deleted ${deletedCount} items`);
    return deletedCount;
  } catch (error) {
    console.error('Error clearing menu items:', error);
    throw error;
  }
};

// Export for use in admin panel or setup page
export default initializeFirebaseData;