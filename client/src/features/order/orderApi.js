// // frontend/src/features/orders/orderApi.js
// import API from "../../app/axios";

// // ============================================
// // 📦 ORDER API - All API calls
// // ============================================

// const ORDER_BASE = "/orders";

// /**
//  * Get order statistics for dashboard
//  * @returns {Promise} - Stats data
//  */
// export const getOrderStats = async () => {
//   try {
//     const response = await API.get(`${ORDER_BASE}/stats`);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error fetching order stats:", error);
//     throw error;
//   }
// };

// /**
//  * Get dashboard data (today's orders, pending deliveries, collection)
//  * @returns {Promise} - Dashboard data
//  */
// export const getDashboardData = async () => {
//   try {
//     const response = await API.get(`${ORDER_BASE}/dashboard`);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error fetching dashboard data:", error);
//     throw error;
//   }
// };

// /**
//  * Create new order with payments
//  * @param {Object} orderData - Order data with payments array
//  * @returns {Promise} - Created order
//  */
// export const createOrder = async (orderData) => {
//   try {
//     console.log("📦 Creating order with data:", orderData);
//     const response = await API.post(ORDER_BASE, orderData);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error creating order:", error);
//     throw error;
//   }
// };

// /**
//  * Get all orders with filters
//  * @param {Object} params - Query params (page, limit, search, status, paymentStatus, timeFilter)
//  * @returns {Promise} - Paginated orders
//  */
// export const getAllOrders = async (params = {}) => {
//   try {
//     const response = await API.get(ORDER_BASE, { params });
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error fetching orders:", error);
//     throw error;
//   }
// };

// /**
//  * ✅ NEW: Get orders by customer ID
//  * @param {string} customerId - Customer ID
//  * @returns {Promise} - Customer's orders
//  */
// export const getOrdersByCustomer = async (customerId) => {
//   try {
//     console.log(`🔍 Fetching orders for customer: ${customerId}`);
//     const response = await API.get(`${ORDER_BASE}/customer/${customerId}`);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error fetching orders for customer ${customerId}:`, error);
//     throw error;
//   }
// };

// /**
//  * Get single order by ID (includes payments & works)
//  * @param {string} id - Order ID
//  * @returns {Promise} - Order details
//  */
// export const getOrderById = async (id) => {
//   try {
//     const response = await API.get(`${ORDER_BASE}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error fetching order ${id}:`, error);
//     throw error;
//   }
// };

// /**
//  * Update order details
//  * @param {string} id - Order ID
//  * @param {Object} updateData - Data to update
//  * @returns {Promise} - Updated order
//  */
// export const updateOrder = async (id, updateData) => {
//   try {
//     const response = await API.put(`${ORDER_BASE}/${id}`, updateData);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error updating order ${id}:`, error);
//     throw error;
//   }
// };

// /**
//  * Update order status only
//  * @param {string} id - Order ID
//  * @param {string} status - New status
//  * @returns {Promise} - Updated order
//  */
// export const updateOrderStatus = async (id, status) => {
//   try {
//     const response = await API.patch(`${ORDER_BASE}/${id}/status`, { status });
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error updating order status ${id}:`, error);
//     throw error;
//   }
// };

// /**
//  * Delete order (soft delete)
//  * @param {string} id - Order ID
//  * @returns {Promise} - Deletion confirmation
//  */
// export const deleteOrder = async (id) => {
//   try {
//     const response = await API.delete(`${ORDER_BASE}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error deleting order ${id}:`, error);
//     throw error;
//   }
// };

// // ============================================
// // 💰 PAYMENT ROUTES (Specific to order)
// // ============================================

// /**
//  * Add payment to existing order
//  * @param {string} orderId - Order ID
//  * @param {Object} paymentData - Payment details
//  * @returns {Promise} - Created payment
//  */
// export const addPaymentToOrder = async (orderId, paymentData) => {
//   try {
//     console.log(`💰 Adding payment to order ${orderId}:`, paymentData);
//     const response = await API.post(`${ORDER_BASE}/${orderId}/payments`, paymentData);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error adding payment to order ${orderId}:`, error);
//     throw error;
//   }
// };

// /**
//  * Get all payments for an order
//  * @param {string} orderId - Order ID
//  * @returns {Promise} - List of payments
//  */
// export const getOrderPayments = async (orderId) => {
//   try {
//     const response = await API.get(`${ORDER_BASE}/${orderId}/payments`);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error fetching payments for order ${orderId}:`, error);
//     throw error;
//   }
// };

// // ============================================
// // 📊 EXPORT ALL FUNCTIONS
// // ============================================
// const orderApi = {
//   getOrderStats,
//   getDashboardData,
//   createOrder,
//   getAllOrders,
//   getOrdersByCustomer, // ✅ Added new function
//   getOrderById,
//   updateOrder,
//   updateOrderStatus,
//   deleteOrder,
//   addPaymentToOrder,
//   getOrderPayments
// };

// export default orderApi;







// // frontend/src/features/orders/orderApi.js
// import API from "../../app/axios";

// // ============================================
// // 📦 ORDER API - All API calls
// // ============================================

// const ORDER_BASE = "/orders";

// /**
//  * Get order statistics for dashboard
//  * @param {Object} params - Optional params (period, startDate, endDate)
//  * @returns {Promise} - Stats data
//  */
// export const getOrderStats = async (params = {}) => {
//   try {
//     const queryParams = new URLSearchParams();
    
//     Object.entries(params).forEach(([key, value]) => {
//       if (value) queryParams.append(key, value);
//     });

//     const response = await API.get(`${ORDER_BASE}/stats?${queryParams}`);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error fetching order stats:", error);
//     throw error;
//   }
// };

// /**
//  * Get dashboard data (today's orders, pending deliveries, collection)
//  * @returns {Promise} - Dashboard data
//  */
// export const getDashboardData = async () => {
//   try {
//     const response = await API.get(`${ORDER_BASE}/dashboard`);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error fetching dashboard data:", error);
//     throw error;
//   }
// };

// /**
//  * ✅ NEW: Get ready to delivery orders
//  * @returns {Promise} - Ready to delivery orders
//  */
// export const getReadyToDeliveryOrders = async () => {
//   try {
//     const response = await API.get(`${ORDER_BASE}/ready-to-delivery`);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error fetching ready to delivery orders:", error);
//     throw error;
//   }
// };

// /**
//  * Create new order with payments
//  * @param {Object} orderData - Order data with payments array
//  * @returns {Promise} - Created order
//  */
// export const createOrder = async (orderData) => {
//   try {
//     console.log("📦 Creating order with data:", orderData);
//     const response = await API.post(ORDER_BASE, orderData);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error creating order:", error);
//     throw error;
//   }
// };

// /**
//  * Get all orders with filters
//  * @param {Object} params - Query params (page, limit, search, status, paymentStatus, timeFilter)
//  * @returns {Promise} - Paginated orders
//  */
// export const getAllOrders = async (params = {}) => {
//   try {
//     const response = await API.get(ORDER_BASE, { params });
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error fetching orders:", error);
//     throw error;
//   }
// };

// /**
//  * Get orders by customer ID
//  * @param {string} customerId - Customer ID
//  * @returns {Promise} - Customer's orders
//  */
// export const getOrdersByCustomer = async (customerId) => {
//   try {
//     console.log(`🔍 Fetching orders for customer: ${customerId}`);
//     const response = await API.get(`${ORDER_BASE}/customer/${customerId}`);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error fetching orders for customer ${customerId}:`, error);
//     throw error;
//   }
// };

// /**
//  * Get single order by ID (includes payments & works)
//  * @param {string} id - Order ID
//  * @returns {Promise} - Order details
//  */
// export const getOrderById = async (id) => {
//   try {
//     const response = await API.get(`${ORDER_BASE}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error fetching order ${id}:`, error);
//     throw error;
//   }
// };

// /**
//  * Update order details
//  * @param {string} id - Order ID
//  * @param {Object} updateData - Data to update
//  * @returns {Promise} - Updated order
//  */
// export const updateOrder = async (id, updateData) => {
//   try {
//     const response = await API.put(`${ORDER_BASE}/${id}`, updateData);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error updating order ${id}:`, error);
//     throw error;
//   }
// };

// /**
//  * Update order status only
//  * @param {string} id - Order ID
//  * @param {string} status - New status
//  * @returns {Promise} - Updated order
//  */
// export const updateOrderStatus = async (id, status) => {
//   try {
//     const response = await API.patch(`${ORDER_BASE}/${id}/status`, { status });
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error updating order status ${id}:`, error);
//     throw error;
//   }
// };

// /**
//  * Delete order (soft delete)
//  * @param {string} id - Order ID
//  * @returns {Promise} - Deletion confirmation
//  */
// export const deleteOrder = async (id) => {
//   try {
//     const response = await API.delete(`${ORDER_BASE}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error deleting order ${id}:`, error);
//     throw error;
//   }
// };

// // ============================================
// // 💰 PAYMENT ROUTES (Specific to order)
// // ============================================

// /**
//  * Add payment to existing order
//  * @param {string} orderId - Order ID
//  * @param {Object} paymentData - Payment details
//  * @returns {Promise} - Created payment
//  */
// export const addPaymentToOrder = async (orderId, paymentData) => {
//   try {
//     console.log(`💰 Adding payment to order ${orderId}:`, paymentData);
//     const response = await API.post(`${ORDER_BASE}/${orderId}/payments`, paymentData);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error adding payment to order ${orderId}:`, error);
//     throw error;
//   }
// };

// /**
//  * Get all payments for an order
//  * @param {string} orderId - Order ID
//  * @returns {Promise} - List of payments
//  */
// export const getOrderPayments = async (orderId) => {
//   try {
//     const response = await API.get(`${ORDER_BASE}/${orderId}/payments`);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error fetching payments for order ${orderId}:`, error);
//     throw error;
//   }
// };

// // ============================================
// // 📊 EXPORT ALL FUNCTIONS
// // ============================================
// const orderApi = {
//   getOrderStats,
//   getDashboardData,
//   getReadyToDeliveryOrders, // ✅ NEW
//   createOrder,
//   getAllOrders,
//   getOrdersByCustomer,
//   getOrderById,
//   updateOrder,
//   updateOrderStatus,
//   deleteOrder,
//   addPaymentToOrder,
//   getOrderPayments
// };

// export default orderApi;





// frontend/src/features/orders/orderApi.js
import API from "../../app/axios";

// ============================================
// 📦 ORDER API - All API calls with DATE FILTER SUPPORT
// ============================================

const ORDER_BASE = "/orders";

/**
 * Helper function to build query string with filters
 * @param {Object} params - Query parameters
 * @returns {string} - Query string
 */
const buildQueryString = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

// ============================================
// 📊 STATS & DASHBOARD
// ============================================

/**
 * Get order statistics for dashboard with date filters
 * @param {Object} params - Optional params (period, startDate, endDate)
 * @returns {Promise} - Stats data
 */
export const getOrderStats = async (params = {}) => {
  try {
    console.log('📊 Fetching order stats with params:', params);
    const queryString = buildQueryString(params);
    const response = await API.get(`${ORDER_BASE}/stats${queryString}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching order stats:", error);
    throw error;
  }
};

/**
 * Get dashboard data (today's orders, pending deliveries, collection)
 * @returns {Promise} - Dashboard data
 */
export const getDashboardData = async () => {
  try {
    const response = await API.get(`${ORDER_BASE}/dashboard`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error);
    throw error;
  }
};

/**
 * ✅ NEW: Get recent orders with date filters (for dashboard)
 * @param {Object} params - { limit, startDate, endDate, period }
 * @returns {Promise} - Recent orders
 */
export const getRecentOrders = async (params = {}) => {
  try {
    console.log('📋 Fetching recent orders with params:', params);
    const queryString = buildQueryString(params);
    const response = await API.get(`${ORDER_BASE}/recent${queryString}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching recent orders:", error);
    throw error;
  }
};

/**
 * ✅ NEW: Get filtered orders with pagination
 * @param {Object} params - { page, limit, status, startDate, endDate, period }
 * @returns {Promise} - Filtered orders with pagination
 */
export const getFilteredOrders = async (params = {}) => {
  try {
    console.log('🔍 Fetching filtered orders with params:', params);
    const queryString = buildQueryString(params);
    const response = await API.get(`${ORDER_BASE}${queryString}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching filtered orders:", error);
    throw error;
  }
};

/**
 * Get ready to delivery orders
 * @param {Object} params - Optional filters
 * @returns {Promise} - Ready to delivery orders
 */
export const getReadyToDeliveryOrders = async (params = {}) => {
  try {
    const queryString = buildQueryString(params);
    const response = await API.get(`${ORDER_BASE}/ready-to-delivery${queryString}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching ready to delivery orders:", error);
    throw error;
  }
};

// ============================================
// 📝 CRUD OPERATIONS
// ============================================

/**
 * Create new order with payments
 * @param {Object} orderData - Order data with payments array
 * @returns {Promise} - Created order
 */
export const createOrder = async (orderData) => {
  try {
    console.log("📦 Creating order with data:", orderData);
    const response = await API.post(ORDER_BASE, orderData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating order:", error);
    throw error;
  }
};

/**
 * Get all orders with filters (alias for getFilteredOrders)
 * @param {Object} params - Query params
 * @returns {Promise} - Paginated orders
 */
export const getAllOrders = async (params = {}) => {
  try {
    return await getFilteredOrders(params);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    throw error;
  }
};

/**
 * Get orders by customer ID
 * @param {string} customerId - Customer ID
 * @param {Object} params - Optional filters
 * @returns {Promise} - Customer's orders
 */
export const getOrdersByCustomer = async (customerId, params = {}) => {
  try {
    console.log(`🔍 Fetching orders for customer: ${customerId}`);
    const queryString = buildQueryString(params);
    const response = await API.get(`${ORDER_BASE}/customer/${customerId}${queryString}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching orders for customer ${customerId}:`, error);
    throw error;
  }
};

/**
 * Get single order by ID (includes payments & works)
 * @param {string} id - Order ID
 * @returns {Promise} - Order details
 */
export const getOrderById = async (id) => {
  try {
    const response = await API.get(`${ORDER_BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching order ${id}:`, error);
    throw error;
  }
};

/**
 * Update order details
 * @param {string} id - Order ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} - Updated order
 */
export const updateOrder = async (id, updateData) => {
  try {
    const response = await API.put(`${ORDER_BASE}/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating order ${id}:`, error);
    throw error;
  }
};

/**
 * Update order status only
 * @param {string} id - Order ID
 * @param {string} status - New status
 * @returns {Promise} - Updated order
 */
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await API.patch(`${ORDER_BASE}/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating order status ${id}:`, error);
    throw error;
  }
};

/**
 * Delete order (soft delete)
 * @param {string} id - Order ID
 * @returns {Promise} - Deletion confirmation
 */
export const deleteOrder = async (id) => {
  try {
    const response = await API.delete(`${ORDER_BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error deleting order ${id}:`, error);
    throw error;
  }
};

// ============================================
// 💰 PAYMENT ROUTES
// ============================================

/**
 * Add payment to existing order
 * @param {string} orderId - Order ID
 * @param {Object} paymentData - Payment details
 * @returns {Promise} - Created payment
 */
export const addPaymentToOrder = async (orderId, paymentData) => {
  try {
    console.log(`💰 Adding payment to order ${orderId}:`, paymentData);
    const response = await API.post(`${ORDER_BASE}/${orderId}/payments`, paymentData);
    return response.data;
  } catch (error) {
    console.error(`❌ Error adding payment to order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Get all payments for an order
 * @param {string} orderId - Order ID
 * @returns {Promise} - List of payments
 */
export const getOrderPayments = async (orderId) => {
  try {
    const response = await API.get(`${ORDER_BASE}/${orderId}/payments`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching payments for order ${orderId}:`, error);
    throw error;
  }
};

// ============================================
// 📊 EXPORT ALL FUNCTIONS
// ============================================
const orderApi = {
  // Stats & Dashboard
  getOrderStats,
  getDashboardData,
  getRecentOrders,           // ✅ NEW
  getFilteredOrders,         // ✅ NEW
  getReadyToDeliveryOrders,
  
  // CRUD
  createOrder,
  getAllOrders,
  getOrdersByCustomer,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  
  // Payments
  addPaymentToOrder,
  getOrderPayments
};

export default orderApi;