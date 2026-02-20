// Order Service - Handles all order-related database operations
// src/services/orderService.js

import { 
  collection, 
  addDoc, 
  getDoc,
  getDocs,
  doc, 
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const ORDERS_COLLECTION = 'orders';

// ============================================
// CREATE OPERATIONS
// ============================================

/**
 * Create a new order
 * @param {Object} orderData - Order information
 * @returns {Promise<Object>} Created order with ID
 */
export const createOrder = async (orderData) => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    
    // Generate order number
    const orderNumber = `MP${Date.now().toString().slice(-8)}`;
    
    // Prepare order document
    const order = {
      orderNumber,
      items: orderData.items || [],
      customer: orderData.customer || {},
      orderType: orderData.orderType || 'delivery',
      address: orderData.address || null,
      subtotal: orderData.subtotal || 0,
      discount: orderData.discount || 0,
      deliveryFee: orderData.deliveryFee || 0,
      total: orderData.total || 0,
      paymentMethod: orderData.paymentMethod || 'cash',
      paymentStatus: orderData.paymentStatus || 'pending',
      status: 'pending', // pending, preparing, ready, delivered, cancelled
      notes: orderData.notes || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Add to database
    const docRef = await addDoc(ordersRef, order);
    
    return {
      id: docRef.id,
      ...order
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Get order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order data
 */
export const getOrder = async (orderId) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      return {
        id: orderSnap.id,
        ...orderSnap.data()
      };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

/**
 * Get order by order number
 * @param {string} orderNumber - Order number (e.g., MP12345678)
 * @returns {Promise<Object>} Order data
 */
export const getOrderByNumber = async (orderNumber) => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, where('orderNumber', '==', orderNumber));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const orderDoc = querySnapshot.docs[0];
      return {
        id: orderDoc.id,
        ...orderDoc.data()
      };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error('Error getting order by number:', error);
    throw error;
  }
};

/**
 * Get all orders
 * @param {number} limitCount - Maximum number of orders to return
 * @returns {Promise<Array>} Array of orders
 */
export const getAllOrders = async (limitCount = 100) => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(
      ordersRef, 
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting all orders:', error);
    throw error;
  }
};

/**
 * Get orders by status
 * @param {string} status - Order status (pending, preparing, ready, delivered, cancelled)
 * @returns {Promise<Array>} Array of orders
 */
export const getOrdersByStatus = async (status) => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(
      ordersRef, 
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting orders by status:', error);
    throw error;
  }
};

/**
 * Get orders by customer phone
 * @param {string} phone - Customer phone number
 * @returns {Promise<Array>} Array of orders
 */
export const getOrdersByCustomerPhone = async (phone) => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(
      ordersRef, 
      where('customer.phone', '==', phone),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting orders by customer phone:', error);
    throw error;
  }
};

/**
 * Get today's orders
 * @returns {Promise<Array>} Array of today's orders
 */
export const getTodaysOrders = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(
      ordersRef,
      where('createdAt', '>=', Timestamp.fromDate(today)),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting today\'s orders:', error);
    throw error;
  }
};

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<void>}
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Update payment status
 * @param {string} orderId - Order ID
 * @param {string} paymentStatus - New payment status
 * @returns {Promise<void>}
 */
export const updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      paymentStatus,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

/**
 * Update order
 * @param {string} orderId - Order ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateOrder = async (orderId, updates) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// ============================================
// ANALYTICS
// ============================================

/**
 * Get order statistics for today
 * @returns {Promise<Object>} Order statistics
 */
export const getTodaysStats = async () => {
  try {
    const orders = await getTodaysOrders();
    
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      completedOrders: orders.filter(o => o.status === 'delivered').length,
      averageOrderValue: orders.length > 0 
        ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length 
        : 0
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting today\'s stats:', error);
    throw error;
  }
};

export default {
  createOrder,
  getOrder,
  getOrderByNumber,
  getAllOrders,
  getOrdersByStatus,
  getOrdersByCustomerPhone,
  getTodaysOrders,
  updateOrderStatus,
  updatePaymentStatus,
  updateOrder,
  getTodaysStats
};