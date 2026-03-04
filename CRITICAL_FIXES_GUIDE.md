# CRITICAL FIXES - IMPLEMENTATION GUIDE

## Quick Reference for Immediate Actions

### 1. Update Firestore Rules (15 minutes) ⚡

**File:** `firestore.rules`

**Replace entire content with:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOrderOwner(orderId) {
      return isAuthenticated() && 
             resource.data.userId == request.auth.uid;
    }
    
    function isValidOrder(data) {
      return data.size() > 0 &&
             'orderNumber' in data &&
             'items' in data &&
             'userId' in data &&
             'customer' in data &&
             'total' in data &&
             data.total is number &&
             data.total > 0;
    }
    
    // ============================================
    // ORDERS - Strict Access Control
    // ============================================
    match /orders/{orderId} {
      // Read: Only owner or admin
      allow read: if isAuthenticated() && 
                    (resource.data.userId == request.auth.uid || isAdmin());
      
      // Create: ONLY Cloud Functions can create
      // Never from client-side
      allow create: if false;
      
      // Update: Only admin
      allow update: if isAdmin();
      
      // Delete: Only admin
      allow delete: if isAdmin();
    }
    
    // ============================================
    // MENU - Public Read, Admin Write
    // ============================================
    match /menu/{menuId} {
      // Everyone can view menu
      allow read: if true;
      
      // Only admin can modify
      allow create, update, delete: if isAdmin();
    }
    
    // ============================================
    // PROMO CODES - Authenticated Read, Admin Write
    // ============================================
    match /promoCodes/{code} {
      // Authenticated users can check codes
      allow read: if isAuthenticated();
      
      // Only admin can manage
      allow create, update, delete: if isAdmin();
    }
    
    // ============================================
    // USERS - Own Profile + Admin Access
    // ============================================
    match /users/{userId} {
      // User can read/write own profile
      // Admin can read all
      allow read, write: if isAuthenticated() && 
                           (request.auth.uid == userId || isAdmin());
    }
    
    // ============================================
    // DELIVERY ZONES - Public Read, Admin Write
    // ============================================
    match /deliveryZones/{zone} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // ============================================
    // ADMINS - Self Reference Only
    // ============================================
    match /admins/{adminId} {
      allow read: if request.auth.uid == adminId;
      allow write: if false; // Only manually set in Firebase Console
    }
    
    // ============================================
    // DEFAULT - DENY ALL
    // ============================================
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Then deploy:**
```bash
firebase deploy --only firestore:rules
```

---

### 2. Create Authentication Service (30 minutes) ⚡

**NEW FILE:** `src/services/authService.js`

```javascript
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Enable persistence so user stays logged in
setPersistence(auth, browserLocalPersistence).catch(err => {
  console.error('Persistence error:', err);
});

/**
 * Register a new customer
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @param {string} phone
 * @returns {Promise<Object>} User object
 */
export const registerCustomer = async (email, password, name, phone = '') => {
  try {
    // 1. Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Update profile
    await updateProfile(user, {
      displayName: name
    });

    // 3. Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      name,
      phone,
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      savedAddresses: [],
      preferences: {
        notifications: true,
        newsletter: false
      }
    });

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    };
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email already registered');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('Password too weak (minimum 6 characters)');
    }
    throw new Error(error.message);
  }
};

/**
 * Login a customer
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User object
 */
export const loginCustomer = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    };
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account with this email');
    }
    if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password');
    }
    throw new Error(error.message);
  }
};

/**
 * Logout current user
 */
export const logoutCustomer = async () => {
  return signOut(auth);
};

/**
 * Get current user profile from Firestore
 */
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Watch auth state changes
 * @param {Function} callback - Called with (user | null)
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profile = await getUserProfile(user.uid);
      callback({ ...user, profile });
    } else {
      callback(null);
    }
  });
};

/**
 * Get current auth user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = () => {
  return auth.currentUser !== null;
};
```

---

### 3. Fix ReviewForm Component (15 minutes) ⚡

**File:** `src/components/ReviewForm.jsx`

**Replace with:**

```jsx
import { useState } from "react";
import { db } from "../config/firebase";  // ✅ FIXED IMPORT
import { addDoc, collection } from 'firebase/firestore';

/**
 * Review form for customers to submit feedback
 * @param {Function} onSuccess - Callback after successful submission
 */
function ReviewForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.comment.trim()) {
      setError('Comment is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        name: formData.name,
        email: formData.email,
        rating: formData.rating,
        comment: formData.comment,
        createdAt: new Date().toISOString(),
        approved: false
      });
      
      // Reset form
      setFormData({ name: '', email: '', rating: 5, comment: '' });
      setError(null);
      
      // Call success callback
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error('Review submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="form-group">
        <label htmlFor="name">Your Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="rating">Rating *</label>
        <select
          id="rating"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
        >
          <option value="1">⭐ Poor</option>
          <option value="2">⭐⭐ Fair</option>
          <option value="3">⭐⭐⭐ Good</option>
          <option value="4">⭐⭐⭐⭐ Very Good</option>
          <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="comment">Your Review *</label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Share your experience..."
          rows="5"
          required
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button 
        type="submit" 
        disabled={loading}
        className="submit-btn"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export default ReviewForm;
```

---

### 4. Move Hardcoded Values to Constants (20 minutes) ⚡

**NEW FILE:** `src/constants/config.js`

```javascript
/**
 * All hardcoded configuration values
 * These should eventually come from Firestore/admin panel
 */

// Delivery Configuration
export const DELIVERY_AREAS = [
  {
    id: 'zone_fatgbems',
    name: 'Fatgbems',
    fee: 500,
    estimatedTime: '30-45 mins'
  },
  {
    id: 'zone_arepo',
    name: 'Arepo',
    fee: 500,
    estimatedTime: '30-45 mins'
  },
  {
    id: 'zone_warewa',
    name: 'Warewa',
    fee: 500,
    estimatedTime: '30-45 mins'
  }
];

// Restaurant Location
export const RESTAURANT_LOCATION = {
  name: 'Masterpiece Shawarma',
  address: '15 Admiralty Way, Lekki Phase 1, Lagos',
  fullAddress: 'Warewa Market Road, Warewa 100201, Ogun state',
  phone: '+234-706-702-7109',
  whatsapp: '+2347067027109',
  email: 'issatolani05@gmail.com',
  coordinates: {
    lat: 6.4396,
    lng: 3.4643
  },
  mapUrl: 'https://maps.google.com/?q=6.4396,3.4643'
};

// Promo Codes (DEPRECATED - Move to Firestore)
// These are now validated on backend, but keeping for reference
export const VALID_PROMO_CODES = {
  'FIRST15': 0.15,   // 15% off
  'FRIYAY': 0.20,    // 20% off (Friday)
  'WELCOME10': 0.10, // 10% off
  'LOYALTY': 0.25    // 25% off
};

// Payment Configuration
export const PAYMENT_CONFIG = {
  timeoutMs: 30000,      // 30 second timeout
  retryLimit: 3,         // Max 3 retry attempts
  verificationRetries: 2 // Verification retries
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  FAILED: 'failed'
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: '⏳ Pending',
  [ORDER_STATUS.PREPARING]: '👨‍🍳 Preparing',
  [ORDER_STATUS.READY]: '✅ Ready',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: '🚗 Out for Delivery',
  [ORDER_STATUS.DELIVERED]: '🎉 Delivered',
  [ORDER_STATUS.CANCELLED]: '❌ Cancelled',
  [ORDER_STATUS.FAILED]: '⚠️ Payment Failed'
};

// Order Types
export const ORDER_TYPES = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  TRANSFER: 'transfer'
};

// Misc
export const APP_CONFIG = {
  name: 'Masterpiece Shawarma',
  version: '1.0.0',
  supportEmail: 'issatolani05@gmail.com',
  supportPhone: '+2347067027109'
};
```

**NEW FILE:** `src/constants/validation.js`

```javascript
/**
 * Validation patterns and messages
 */

export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s+()-]{10,}$/,
  name: /^[a-zA-Z\s]{2,50}$/,
  postalCode: /^[0-9]{5,6}$/
};

export const VALIDATION_MESSAGES = {
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  name: 'Name must be 2-50 characters',
  required: 'This field is required',
  postalCode: 'Please enter a valid postal code'
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  INVALID_PAYMENT: 'Payment verification failed. Please try again.',
  DUPLICATE_PAYMENT: 'This payment has already been processed.',
  AMOUNT_MISMATCH: 'Order amount mismatch. Please try again.',
  ORDER_NOT_FOUND: 'Order not found.',
  AUTHENTICATION_REQUIRED: 'Please log in to continue.',
  UNAUTHORIZED: 'You do not have permission to perform this action.'
};
```

---

### 5. Create Auth Context (30 minutes) ⚡

**NEW FILE:** `src/contexts/AuthContext.jsx`

```jsx
import { createContext, useState, useEffect } from 'react';
import { onAuthChange, getCurrentUser } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen to auth changes
    const unsubscribe = onAuthChange((authUser) => {
      if (authUser) {
        setUser({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          profile: authUser.profile
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: user !== null,
    currentUser: getCurrentUser()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

**NEW FILE:** `src/hooks/useAuth.js`

```javascript
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

### 6. Update App.jsx to Use Auth (20 minutes) ⚡

**File:** `src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import './App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu-Firebase';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import NotFound from './components/NotFound';

// TODO: Create these new pages
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Orders from './pages/Orders';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/ordersuccess" element={<OrderSuccess />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            
            {/* TODO: Add these routes */}
            {/* <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/orders" element={<Orders />} /> */}
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
```

---

### 7. Create Protected Route Component (15 minutes) ⚡

**NEW FILE:** `src/components/ProtectedRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Route that requires authentication
 * Redirects to login if not authenticated
 */
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

---

### 8. Update Checkout to Use Auth (30 minutes) ⚡

**File:** `src/pages/Checkout.jsx` - Add at top after imports:

```jsx
import { useAuth } from '../hooks/useAuth';
import { ProtectedRoute } from '../components/ProtectedRoute';

function Checkout({ clearCart }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="checkout-page">
        <div className="checkout-notice">
          <h2>Please Log In</h2>
          <p>You need to be logged in to complete your order</p>
          <button onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ... rest of component
}
```

---

## Summary: Time to Implement All Critical Fixes

| Fix | Time | Difficulty |
|-----|------|-----------|
| 1. Fix Firestore Rules | 15 min | Easy ✅ |
| 2. Auth Service | 30 min | Easy ✅ |
| 3. Fix ReviewForm | 15 min | Easy ✅ |
| 4. Constants | 20 min | Easy ✅ |
| 5. Auth Context | 30 min | Medium ⚠️ |
| 6. Update App.jsx | 20 min | Medium ⚠️ |
| 7. Protected Routes | 15 min | Easy ✅ |
| 8. Update Checkout | 30 min | Medium ⚠️ |
| **TOTAL** | **3.25 hours** | - |

### Deploy Commands

```bash
# 1. Deploy Firestore rules
firebase deploy --only firestore:rules

# 2. Redeploy Cloud Functions (if you updated them)
firebase deploy --only functions

# 3. Deploy hosting
firebase deploy --only hosting

# 4. Check everything
firebase deploy
```

---

## Next Steps

After implementing these critical fixes:

1. ✅ Create Login/Register pages
2. ✅ Create Orders history page (show user's orders)
3. ✅ Add email notifications
4. ✅ Build admin dashboard
5. ✅ Implement order status workflow

**You'll be significantly closer to production-ready!** 🚀
