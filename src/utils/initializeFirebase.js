// Initialize Firebase with menu data
// Run this once to populate your database
// src/utils/initializeFirebase.js

import { initializeMenu } from '../services/menuService';
import menuData from '../data/menuData';

/**
 * Initialize Firebase with menu items
 * This should be run ONCE after Firebase setup
 */
export const initializeFirebaseData = async () => {
  try {
    console.log('🔥 Starting Firebase initialization...');
    console.log(`📋 Found ${menuData.length} menu items to upload`);
    
    // Upload menu items
    console.log('📤 Uploading menu items...');
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

// ============================================
// USAGE INSTRUCTIONS
// ============================================

/*
HOW TO USE THIS SCRIPT:

Option 1: In your app (one-time setup button)
---------------------------------------------
import { initializeFirebaseData } from './utils/initializeFirebase';

const handleInitialize = async () => {
  try {
    const result = await initializeFirebaseData();
    alert(`Success! Created ${result.menuItemsCreated} menu items`);
  } catch (error) {
    alert('Error: ' + error.message);
  }
};

<button onClick={handleInitialize}>Initialize Database</button>


Option 2: Browser console (quick test)
---------------------------------------
1. Start your app: npm start
2. Open browser console (F12)
3. Paste this code:

import('./utils/initializeFirebase').then(module => {
  module.initializeFirebaseData()
    .then(result => console.log('Success!', result))
    .catch(error => console.error('Error:', error));
});


Option 3: Node script (advanced)
---------------------------------
Create a separate file: scripts/init.js

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const menuData = require('../src/data/menuData');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initialize() {
  for (const item of menuData) {
    await db.collection('menu').add(item);
  }
  console.log('Done!');
}

initialize();


IMPORTANT NOTES:
----------------
1. Run this ONLY ONCE after Firebase setup
2. Running multiple times will create duplicate items
3. Check your Firebase Console to verify data
4. You can delete all items and re-run if needed

*/