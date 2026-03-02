// Firebase configuration and initialization
// src/config/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// ============================================
// FIREBASE CONFIG
// ============================================
// Configuration loaded from environment variables
// See .env.example for required variables

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
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
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.authDomain);
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