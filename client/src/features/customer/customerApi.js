// frontend/src/features/customer/customerApi.js
import API from "../../app/axios";

// ==================== CUSTOMER API CALLS ====================

/**
 * Create new customer
 * @param {Object} customerData - Customer data
 * @returns {Promise}
 */
export const createCustomerApi = async (customerData) => {
  try {
    console.log("📦 API Call: createCustomer", customerData);
    const response = await API.post("/customers/create", customerData);
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error createCustomer:", error.response?.data || error.message);
    if (error.response?.data) {
      throw error.response.data;
    } else {
      throw { message: error.message || "Network error. Please try again." };
    }
  }
};

/**
 * Get all customers
 * @returns {Promise}
 */
export const getAllCustomersApi = async () => {
  try {
    console.log("📋 API Call: getAllCustomers");
    const response = await API.get("/customers/all");
    return response.data;
  } catch (error) {
    console.error("❌ API Error getAllCustomers:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Get all customers with payment summary
 * @returns {Promise}
 */
export const getCustomersWithPaymentsApi = async () => {
  try {
    console.log("📋 API Call: getCustomersWithPayments");
    const response = await API.get("/customers/with-payments");
    return response.data;
  } catch (error) {
    console.error("❌ API Error getCustomersWithPayments:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Get customer by ID
 * @param {string} id - Customer MongoDB ID
 * @returns {Promise}
 */
export const getCustomerByIdApi = async (id) => {
  try {
    console.log(`🔍 API Call: getCustomerById ${id}`);
    const response = await API.get(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ API Error getCustomerById:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Search customer by phone
 * @param {string} phone - Phone number
 * @returns {Promise}
 */
export const searchCustomerByPhoneApi = async (phone) => {
  try {
    console.log(`🔍 API Call: searchCustomerByPhone ${phone}`);
    const response = await API.get(`/customers/search/phone/${phone}`);
    return response.data;
  } catch (error) {
    console.error("❌ API Error searchCustomerByPhone:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Search customer by customer ID (CUST-2024-00001)
 * @param {string} customerId - Customer ID
 * @returns {Promise}
 */
export const searchCustomerByCustomerIdApi = async (customerId) => {
  try {
    console.log(`🔍 API Call: searchCustomerByCustomerId ${customerId}`);
    const response = await API.get(`/customers/search/id/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("❌ API Error searchCustomerByCustomerId:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Update customer
 * @param {string} id - Customer MongoDB ID
 * @param {Object} customerData - Updated data
 * @returns {Promise}
 */
export const updateCustomerApi = async (id, customerData) => {
  try {
    console.log(`✏️ API Call: updateCustomer ${id}`, customerData);
    const response = await API.put(`/customers/${id}`, customerData);
    return response.data;
  } catch (error) {
    console.error("❌ API Error updateCustomer:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Delete customer
 * @param {string} id - Customer MongoDB ID
 * @returns {Promise}
 */
export const deleteCustomerApi = async (id) => {
  try {
    console.log(`🗑️ API Call: deleteCustomer ${id}`);
    const response = await API.delete(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ API Error deleteCustomer:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Get customer payments
 * @param {string} id - Customer MongoDB ID
 * @returns {Promise}
 */
export const getCustomerPaymentsApi = async (id) => {
  try {
    console.log(`💰 API Call: getCustomerPayments ${id}`);
    const response = await API.get(`/customers/${id}/payments`);
    return response.data;
  } catch (error) {
    console.error("❌ API Error getCustomerPayments:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Get customer orders
 * @param {string} id - Customer MongoDB ID
 * @returns {Promise}
 */
export const getCustomerOrdersApi = async (id) => {
  try {
    console.log(`📦 API Call: getCustomerOrders ${id}`);
    const response = await API.get(`/customers/${id}/orders`);
    return response.data;
  } catch (error) {
    console.error("❌ API Error getCustomerOrders:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Get customer payment statistics
 * @param {string} id - Customer MongoDB ID
 * @returns {Promise}
 */
export const getCustomerPaymentStatsApi = async (id) => {
  try {
    console.log(`📊 API Call: getCustomerPaymentStats ${id}`);
    const response = await API.get(`/customers/${id}/payment-stats`);
    return response.data;
  } catch (error) {
    console.error("❌ API Error getCustomerPaymentStats:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Get customer statistics (Admin only)
 * @returns {Promise}
 */
export const getCustomerStatsApi = async () => {
  try {
    console.log(`📊 API Call: getCustomerStats`);
    const response = await API.get("/customers/stats");
    return response.data;
  } catch (error) {
    console.error("❌ API Error getCustomerStats:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};