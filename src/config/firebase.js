// Firebase configuration and initialization
// src/config/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// ============================================
// FIREBASE CONFIG
// ============================================
// TODO: Replace with your actual Firebase config
// Get this from Firebase Console > Project Settings > Your Apps

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBIuygY3Sq7XdM7YthtkWRHOlhDIAeFzo",
  authDomain: "masterpiece-e82b2.firebaseapp.com",
  projectId: "masterpiece-e82b2",
  storageBucket: "masterpiece-e82b2.firebasestorage.app",
  messagingSenderId: "480863399644",
  appId: "1:480863399644:web:719e740314b44f7274ce19"
};

// ============================================
// INITIALIZE FIREBASE
// ============================================

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Export app instance
export default app;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if Firebase is properly initialized
 */
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY";
};

/**
 * Get Firebase error message in user-friendly format
 */
export const getFirebaseErrorMessage = (error) => {
  switch (error.code) {
    case 'permission-denied':
      return 'You do not have permission to perform this action.';
    case 'unavailable':
      return 'Service is currently unavailable. Please try again later.';
    case 'not-found':
      return 'The requested data was not found.';
    case 'already-exists':
      return 'This item already exists.';
    case 'failed-precondition':
      return 'Operation failed. Please check your input and try again.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};

// ============================================
// CONFIGURATION VALIDATION
// ============================================

if (!isFirebaseConfigured()) {
  console.warn(
    '⚠️ Firebase is not configured! Please update src/config/firebase.js with your Firebase credentials.'
  );
}