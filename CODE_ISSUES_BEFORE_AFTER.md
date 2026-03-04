# CODE ISSUES - BEFORE & AFTER

Quick reference for all major code problems and their fixes.

---

## Issue 1: Firestore Allows Anyone to Read All Orders

### ❌ CURRENT (WRONG)
```javascript
// firestore.rules
match /orders/{orderId} {
  allow read: if true;  // 🚨 CRITICAL SECURITY FLAW
  allow create: if request.auth.uid != null &&
                   request.writeFields.hasAll(['orderNumber', 'items', 'customer', 'total']);
}
```

**Problem:** Any visitor can read every customer's order details, addresses, phone numbers, payment info.

### ✅ FIXED
```javascript
// firestore.rules
match /orders/{orderId} {
  // Only authenticated users can read
  // Only their own orders OR if they're admin
  allow read: if request.auth != null && 
              (resource.data.userId == request.auth.uid || 
               get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'admin');
  
  // Orders can only be created by Cloud Functions (never by client)
  allow create: if false;
  
  // Update/delete only for admin
  allow update, delete: if request.auth != null &&
    get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'admin';
}
```

---

## Issue 2: Cart is an Array, Causes Duplication and Performance Issues

### ❌ CURRENT (WRONG)
```jsx
// App.jsx
const [cart, setCart] = useState([]); // Array stores each item separately

const addToCart = (item) => {
  setCart((prevCart) => [...prevCart, item]); // Adds duplicate
};

// Result: cart = [item1, item1, item1, item1] for 4 quantities
// Then deduplicates in Cart.jsx with getCartWithQuantities()
const getCartWithQuantities = () => {
  const itemMap = {};
  cart.forEach(item => {
    if (itemMap[item.id]) {
      itemMap[item.id].quantity += 1;  // Inefficient deduplication
    } else {
      itemMap[item.id] = { ...item, quantity: 1 };
    }
  });
  return Object.values(itemMap);
};
```

**Problems:**
- Cart grows exponentially (10 quantities = 10 items in array)
- Re-renders entire app when cart changes
- Lost on page refresh
- Difficult to sync across browser tabs
- Race conditions with concurrent operations

### ✅ FIXED
```javascript
// src/contexts/CartContext.js
import { createContext, useReducer, useCallback, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  items: {},  // { itemId: { quantity: 3, ...itemData } }
  total: 0
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item } = action.payload;
      const existing = state.items[item.id];
      
      return {
        ...state,
        items: {
          ...state.items,
          [item.id]: existing
            ? { ...existing, quantity: existing.quantity + 1 }
            : { ...item, quantity: 1 }
        }
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      if (quantity <= 0) {
        const items = { ...state.items };
        delete items[itemId];
        return { ...state, items };
      }
      
      return {
        ...state,
        items: {
          ...state.items,
          [itemId]: { ...state.items[itemId], quantity }
        }
      };
    }
    
    case 'REMOVE_ITEM': {
      const items = { ...state.items };
      delete items[action.payload.itemId];
      return { ...state, items };
    }
    
    case 'CLEAR_CART':
      return initialState;
    
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    // Load from localStorage on init
    const saved = localStorage.getItem('mp_cart');
    return saved ? JSON.parse(saved) : initial;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('mp_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', payload: { item } });
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be within CartProvider');
  return context;
};
```

---

## Issue 3: Promo Codes Hardcoded in Frontend

### ❌ CURRENT (WRONG)
```jsx
// Cart.jsx
const promoCodes = {
  'FIRST15': 0.15,
  'FRIYAY': 0.20,
  'WELCOME10': 0.10,
  'LOYALTY': 0.25
};

const applyPromoCode = () => {
  const code = promoCode.toUpperCase();
  if (promoCodes[code]) {
    setDiscount(promoCodes[code]);
    setPromoApplied(true);
  } else {
    alert('Invalid promo code');
  }
};
```

**Problems:**
- User can see all codes by inspecting page source
- User can reverse engineer discount percentages
- Can't manage codes without code changes
- No usage tracking
- No expiration dates

### ✅ FIXED - Option A: Move to Firestore
```javascript
// Backend Cloud Function for validation
exports.validatePromoCode = onCall(async (request) => {
  const { code } = request.data;

  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be logged in');
  }

  const codeDoc = await db.collection('promoCodes').doc(code.toUpperCase()).get();
  
  if (!codeDoc.exists) {
    throw new HttpsError('invalid-argument', 'Invalid promo code');
  }

  const promoData = codeDoc.data();

  // Check if expired
  if (promoData.expiresAt && new Date(promoData.expiresAt) < new Date()) {
    throw new HttpsError('invalid-argument', 'Promo code expired');
  }

  // Check if active
  if (!promoData.active) {
    throw new HttpsError('invalid-argument', 'Promo code inactive');
  }

  // Check usage limit
  if (promoData.maxUses && promoData.usageCount >= promoData.maxUses) {
    throw new HttpsError('invalid-argument', 'Promo code usage limit reached');
  }

  return {
    valid: true,
    discountPercent: promoData.discountPercent,
    maxDiscount: promoData.maxDiscount || null
  };
});

// Firestore collection structure
promoCodes/
├── FIRST15: {
│     discountPercent: 0.15,
│     maxDiscount: null,          // Max discount amount
│     expiresAt: '2025-12-31',
│     active: true,
│     maxUses: 100,
│     usageCount: 45,
│     createdAt: '2025-01-01'
│   }
└── FRIYAY: { ... }
```

### ✅ FIXED - Option B: Call Backend
```jsx
// Cart.jsx
import { getFunctions, httpsCallable } from 'firebase/functions';

const applyPromoCode = async () => {
  setLoading(true);
  try {
    const functions = getFunctions();
    const validatePromo = httpsCallable(functions, 'validatePromoCode');
    
    const result = await validatePromo({ code: promoCode });
    
    // Backend says it's valid, apply discount
    const discountAmount = orderData.subtotal * result.data.discountPercent;
    setDiscount(discountAmount);
    setPromoApplied(true);
  } catch (error) {
    setPromoError(error.message);
  } finally {
    setLoading(false);
  }
};
```

---

## Issue 4: Client Calculates Order Total, Then Backend Trusts It

### ❌ CURRENT (WRONG)
```jsx
// Checkout.jsx - CLIENT SIDE
const finalTotal = (orderData.subtotal || 0) - (orderData.discount || 0) + deliveryFee;
// User could modify this in browser console!

const orderToCreate = {
  items: orderData.cartItems,
  total: finalTotal,  // 🚨 This number came from browser
  // ...
};

const createdOrder = await createOrder(orderToCreate);
// Order created with unverified total
```

**Attack Scenario:**
```javascript
// Attacker's browser console
// 1. Order for ₦7,000 ready to pay
// 2. User pays ₦7,000 on Paystack ✓
// 3. Before order creation, attacker modifies cart
// 4. Attacker changes total to ₦1,000
// 5. Order created for ₦1,000 ✗ FRAUD
```

### ✅ FIXED - Backend Recalculates Everything
```javascript
// functions/index.js
exports.createOrderAfterPayment = onCall(async (request) => {
  const { items, customerData, orderType } = request.data;

  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  // 1. RE-CALCULATE SUBTOTAL FROM DATABASE
  // Don't trust client amounts!
  const db = admin.firestore();
  let serverSubtotal = 0;
  const validatedItems = [];

  for (const item of items) {
    const menuDoc = await db.collection('menu').doc(item.id).get();
    
    if (!menuDoc.exists) {
      throw new HttpsError('invalid-argument', `Item ${item.id} not found`);
    }

    const menuItem = menuDoc.data();
    const itemTotal = menuItem.price * item.quantity;  // ✅ Use database price
    
    serverSubtotal += itemTotal;
    validatedItems.push({
      id: item.id,
      name: menuItem.name,
      price: menuItem.price,  // Database price, NOT client price
      quantity: item.quantity,
      total: itemTotal
    });
  }

  // 2. CALCULATE FEES AND DISCOUNTS
  const deliveryFee = orderType === 'delivery' ? 500 : 0;
  
  // Validate promo code if provided
  let discount = 0;
  if (request.data.promoCode) {
    const promoDoc = await db
      .collection('promoCodes')
      .doc(request.data.promoCode.toUpperCase())
      .get();
    
    if (promoDoc.exists && promoDoc.data().active) {
      const discountPercent = promoDoc.data().discountPercent;
      discount = serverSubtotal * discountPercent;
    }
  }

  // 3. CALCULATE FINAL TOTAL
  const serverTotal = serverSubtotal + deliveryFee - discount;

  // 4. VERIFY THIS MATCHES WHAT CUSTOMER PAID
  // Allow small difference for rounding (0.01 rounding error)
  if (Math.abs(serverTotal - request.data.paidAmount) > 10) {
    logger.error('FRAUD DETECTED: Amount mismatch', {
      userId: request.auth.uid,
      clientAmount: request.data.paidAmount,
      serverAmount: serverTotal,
      difference: request.data.paidAmount - serverTotal
    });
    
    throw new HttpsError('invalid-argument', 'Order total mismatch. Payment cancelled.');
  }

  // 5. NOW CREATE ORDER WITH SERVER-CALCULATED TOTAL
  const orderRef = await db.collection('orders').add({
    userId: request.auth.uid,
    items: validatedItems,
    subtotal: serverSubtotal,    // ✅ Server calculated
    deliveryFee,
    discount,
    total: serverTotal,           // ✅ Server calculated - FINAL
    paymentReference: request.data.paymentReference,
    status: 'pending',
    createdAt: admin.firestore.Timestamp.now()
  });

  return {
    success: true,
    orderId: orderRef.id,
    total: serverTotal
  };
});
```

---

## Issue 5: ReviewForm Has Syntax Error

### ❌ CURRENT (WRONG)
```jsx
// src/components/ReviewForm.jsx
import { useState } from "react";
import { db } from "../data"  // ❌ WRONG PATH - db not in data/

function ReviewForm () {
    return ()  // ❌ EMPTY RETURN - SYNTAX ERROR!
}

export default ReviewForm;
```

**Problem:** This will crash the entire app if imported.

### ✅ FIXED
```jsx
// src/components/ReviewForm.jsx
import { useState } from "react";
import { db } from "../config/firebase";  // ✅ CORRECT PATH
import { addDoc, collection, Timestamp } from 'firebase/firestore';

function ReviewForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addDoc(collection(db, 'reviews'), {
        ...formData,
        approved: false,
        createdAt: Timestamp.now()
      });
      
      setFormData({ name: '', email: '', rating: 5, comment: '' });
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}

export default ReviewForm;
```

---

## Issue 6: Hardcoded Delivery Areas and Restaurant Location

### ❌ CURRENT (WRONG)
```jsx
// Checkout.jsx
const deliveryAreas = ['Fatgbems', 'Arepo', 'Warewa'];

// Contact.jsx
const businessInfo = {
  name: "Masterpiece Shawarma",
  phone: "+234-706-702-7109",
  address: "Warewa Market Road...",
};

// Home.jsx
const todaySpecial = {
  title: "Friday Special",
  description: "Buy 3 Chicken Wraps, Get 1 Free!",
  code: "FRIYAY"
};
```

**Problems:**
- Scattered across multiple files
- Hard to update without code changes
- Admin can't manage these values
- No source of truth

### ✅ FIXED
```javascript
// src/constants/config.js
export const DELIVERY_AREAS = [
  { id: 'zone_1', name: 'Fatgbems', fee: 500 },
  { id: 'zone_2', name: 'Arepo', fee: 500 },
  { id: 'zone_3', name: 'Warewa', fee: 500 }
];

export const RESTAURANT = {
  name: "Masterpiece Shawarma",
  phone: "+234-706-702-7109",
  address: "Warewa Market Road, Warewa 100201",
  email: "issatolani05@gmail.com",
  whatsapp: "+2347067027109",
  coordinates: { lat: 6.67657, lng: 3.40924 }
};

export const APP_CONFIG = {
  maxInstances: 10,
  paymentTimeout: 30000,
  retryLimit: 3
};

// Then use everywhere:
import { DELIVERY_AREAS, RESTAURANT, APP_CONFIG } from '../constants/config';

const handlePaymentTimeout = setTimeout(() => {
  cancelPayment();
}, APP_CONFIG.paymentTimeout);
```

**Better Yet: Load from Firestore**
```javascript
// services/configService.js
export const getRestaurantConfig = async () => {
  const doc = await getDoc(doc(db, 'config', 'restaurant'));
  return doc.data();
};

// Use with caching
export const useRestaurantConfig = () => {
  const [config, setConfig] = useState(null);
  
  useEffect(() => {
    const loadConfig = async () => {
      const cached = localStorage.getItem('mp_config');
      if (cached && Date.now() - JSON.parse(cached).ts < 3600000) {
        setConfig(JSON.parse(cached).data);
      } else {
        const data = await getRestaurantConfig();
        localStorage.setItem('mp_config', JSON.stringify({ data, ts: Date.now() }));
        setConfig(data);
      }
    };
    loadConfig();
  }, []);
  
  return config;
};
```

---

## Issue 7: No Input Validation Before Database

### ❌ CURRENT (WRONG)
```javascript
// orderService.js
export const createOrder = async (orderData) => {
  const order = {
    orderNumber: `MP${Date.now().toString().slice(-8)}`,
    items: orderData.items || [],        // Could be undefined!
    customer: orderData.customer || {},  // Could be empty object!
    total: orderData.total || 0,         // Could be 0 or negative!
    // ...
  };
  
  await addDoc(ordersRef, order);  // Creates anyway ❌
};
```

**Problem:** Invalid data stored in database forever.

### ✅ FIXED
```javascript
// validators/orderValidator.js
export const validateOrder = (orderData) => {
  const errors = {};

  // Validate items
  if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
    errors.items = 'Order must contain at least 1 item';
  } else {
    orderData.items.forEach((item, idx) => {
      if (!item.id || !Number.isInteger(item.quantity) || item.quantity <= 0) {
        errors[`items[${idx}]`] = 'Invalid item';
      }
    });
  }

  // Validate customer
  if (!orderData.customer?.name?.trim()) {
    errors['customer.name'] = 'Customer name required';
  }
  if (!orderData.customer?.phone?.trim()) {
    errors['customer.phone'] = 'Phone number required';
  }
  if (!/^[\d\s+()-]{10,}$/.test(orderData.customer?.phone)) {
    errors['customer.phone'] = 'Invalid phone format';
  }

  // Validate total
  if (typeof orderData.total !== 'number' || orderData.total <= 0) {
    errors.total = 'Invalid order total';
  }

  // Validate address for delivery
  if (orderData.orderType === 'delivery' && !orderData.address?.trim()) {
    errors.address = 'Delivery address required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// orderService.js
export const createOrder = async (orderData) => {
  // Validate first
  const validation = validateOrder(orderData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`);
  }

  // Only create if valid
  const order = {
    orderNumber: `MP${Date.now().toString().slice(-8)}`,
    items: orderData.items,  // Already validated
    customer: orderData.customer,
    total: orderData.total,
    // ... other fields
  };
  
  return await addDoc(collection(db, 'orders'), order);
};
```

---

## Issue 8: No Console.log Removal for Production

### ❌ CURRENT (WRONG) - In Production Build
```javascript
// Everywhere in code
console.log('🔥 Starting database initialization...');
console.log('Payment successful:', response);
console.error('❌ Error:', error);

// These appear in user's browser console
// Exposes system details to attackers
// Slows down page load slightly
```

### ✅ FIXED
```javascript
// services/logger.js
class Logger {
  log(message, data = null) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(message, data);
    }
    // Send to error tracking service (Sentry, LogRocket)
    this.sendToService('info', message, data);
  }

  error(message, error = null) {
    console.error(message, error);  // Always log errors for debugging
    this.sendToService('error', message, error);
  }

  warn(message, data = null) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(message, data);
    }
    this.sendToService('warn', message, data);
  }

  async sendToService(level, message, data) {
    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      try {
        await fetch('/.netlify/functions/log', {
          method: 'POST',
          body: JSON.stringify({ level, message, data, timestamp: new Date() })
        });
      } catch (err) {
        // Fail silently
      }
    }
  }
}

export default new Logger();

// Usage everywhere:
import logger from '../services/logger';
logger.log('Menu loaded', items);
logger.error('Payment failed', error);
```

---

## Issue 9: No Error Handling for Failed Payments

### ❌ CURRENT (WRONG)
```jsx
const handlePaymentSuccess = async (response) => {
  try {
    const result = await verifyPayment(response.reference);
    
    // ❌ What if verifyPayment times out? No retry
    // ❌ What if order creation fails? Payment is gone
    // ❌ No recovery mechanism
    
    await createOrder(orderData);
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

### ✅ FIXED - Track Failed Payments
```javascript
// functions/retryFailedPayments.js
exports.retryFailedPayments = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    const failedPayments = await admin
      .firestore()
      .collection('failedPayments')
      .where('status', '==', 'PENDING_RETRY')
      .where('retryCount', '<', 3)
      .get();

    for (const doc of failedPayments.docs) {
      try {
        const { paymentReference, customerData, orderData } = doc.data();
        
        // Try to verify and create order again
        await createOrderAfterPayment({
          auth: { uid: doc.data().userId },
          data: { paymentReference, customerData, orderData }
        });
        
        // Success
        await doc.ref.update({ status: 'RECOVERED' });
        logger.info('Failed payment recovered', { reference: paymentReference });
      } catch (error) {
        // Increment retry count
        await doc.ref.update({
          retryCount: FieldValue.increment(1),
          lastError: error.message,
          lastRetryAt: FieldValue.serverTimestamp()
        });
      }
    }
  });

// Track each failed payment
const handlePaymentFailure = async (error) => {
  await db.collection('failedPayments').add({
    reference: paymentRef,
    userId: auth.currentUser.uid,
    error: error.message,
    status: 'PENDING_RETRY',
    retryCount: 0,
    createdAt: Timestamp.now()
  });
  
  alert('Payment processing. Will retry automatically.');
};
```

---

## Issue 10: No TypeScript or JSDoc Types

### ❌ CURRENT (WRONG)
```javascript
// What types are these?
const addToCart = (item) => { ... };
const updateQuantity = (itemId, change) => { ... };
const createOrder = (orderData) => { ... };
```

### ✅ FIXED - Option A: JSDoc (Quick Fix)
```javascript
/**
 * @typedef {Object} MenuItem
 * @property {string} id - Unique item identifier
 * @property {string} name - Item name
 * @property {number} price - Price in naira
 * @property {string} category - Menu category
 * @property {string} image - Image URL
 * @property {number} [rating] - Customer rating (optional)
 */

/**
 * Add item to cart
 * @param {MenuItem} item - Menu item to add
 * @throws {Error} If item is invalid
 */
const addToCart = (item) => {
  if (!item?.id || !item?.price) {
    throw new Error('Invalid menu item');
  }
  setCart(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
};

/**
 * Update quantity of item in cart
 * @param {string} itemId - Item ID
 * @param {number} quantity - New quantity (0 to remove)
 */
const updateQuantity = (itemId, quantity) => {
  setCart(prev => {
    if (quantity <= 0) {
      const { [itemId]: _, ...rest } = prev;
      return rest;
    }
    return { ...prev, [itemId]: quantity };
  });
};
```

### ✅ FIXED - Option B: TypeScript (Better)
```typescript
// types/menu.ts
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  rating?: number;
  reviews?: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id?: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  customer: CustomerInfo;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

// services/cartService.ts
export const addToCart = (cart: Map<string, CartItem>, item: MenuItem): Map<string, CartItem> => {
  const existing = cart.get(item.id);
  return new Map(cart).set(item.id, {
    ...item,
    quantity: (existing?.quantity || 0) + 1
  });
};
```

---

## Summary: Most Critical Fixes

| Issue | Severity | Impact | Fix Time |
|-------|----------|--------|----------|
| Firestore rules expose data | 🔴 CRITICAL | Data breach | 15 min |
| Client calculates total | 🔴 CRITICAL | Financial fraud | 30 min |
| No authentication | 🔴 CRITICAL | Can't track orders | 3 hours |
| Cart is array | 🟠 HIGH | Performance issues | 1 hour |
| ReviewForm broken | 🟠 HIGH | App crash | 15 min |
| Promo codes hardcoded | 🟠 HIGH | Security/UX | 1 hour |
| No input validation | 🟠 HIGH | Bad data | 2 hours |

**Do these 10 fixes first.** Everything else can wait.
