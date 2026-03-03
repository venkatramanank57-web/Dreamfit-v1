// features/customer/customerApi.js
import API from "../../app/axios";

// 🔍 Search customer by phone
export const searchCustomerApi = async (phone) => {
  console.log(`🔍 API - Searching customer by phone: ${phone}`);
  const response = await API.get(`/customers/search/phone/${phone}`);
  return response.data;
};

// 🔍 Search customer by Customer ID
export const searchCustomerByCustomerIdApi = async (customerId) => {
  console.log(`🔍 API - Searching customer by ID: ${customerId}`);
  const response = await API.get(`/customers/search/id/${customerId}`);
  return response.data;
};

// 🆕 Create new customer
export const createCustomerApi = async (customerData) => {
  console.log("\n📦 ========== API CALL ==========");
  console.log("📦 Original customerData:", customerData);
  
  // ✅ FIXED: Direct mapping - no transformations!
  const apiData = {
    salutation: customerData.salutation,
    firstName: customerData.firstName,
    lastName: customerData.lastName || "",
    dateOfBirth: customerData.dateOfBirth,
    contactNumber: customerData.contactNumber,
    whatsappNumber: customerData.whatsappNumber,
    email: customerData.email || "",
    addressLine1: customerData.addressLine1,
    addressLine2: customerData.addressLine2 || "",
    city: customerData.city || "",
    state: customerData.state || "",
    pincode: customerData.pincode || "",
    notes: customerData.notes || ""
  };
  
  console.log("📦 Mapped API data:", apiData);
  console.log("📞 contactNumber being sent:", apiData.contactNumber);
  console.log("🏠 addressLine1 being sent:", apiData.addressLine1);
  console.log("📅 dateOfBirth being sent:", apiData.dateOfBirth);
  console.log("================================\n");
  
  try {
    const response = await API.post("/customers/create", apiData);
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    throw error;
  }
};

// 📋 Get all customers
export const getAllCustomersApi = async () => {
  console.log("📋 API - Fetching all customers");
  const response = await API.get("/customers/all");
  return response.data;
};

// 👤 Get customer by MongoDB ID (UPDATED - now includes payments & orders)
export const getCustomerByIdApi = async (id) => {
  console.log(`👤 API - Fetching customer by ID: ${id}`);
  const response = await API.get(`/customers/${id}`);
  // Response includes: { customer, payments, orders, paymentSummary }
  return response.data;
};

// ✏️ Update customer
export const updateCustomerApi = async (id, customerData) => {
  console.log(`✏️ API - Updating customer ${id}:`, customerData);
  
  const apiData = {
    salutation: customerData.salutation,
    firstName: customerData.firstName,
    lastName: customerData.lastName || "",
    dateOfBirth: customerData.dateOfBirth,
    contactNumber: customerData.contactNumber,
    whatsappNumber: customerData.whatsappNumber,
    email: customerData.email || "",
    addressLine1: customerData.addressLine1,
    addressLine2: customerData.addressLine2 || "",
    city: customerData.city || "",
    state: customerData.state || "",
    pincode: customerData.pincode || "",
    notes: customerData.notes || ""
  };
  
  const response = await API.put(`/customers/${id}`, apiData);
  return response.data;
};

// ❌ Delete customer
export const deleteCustomerApi = async (id) => {
  console.log(`🗑️ API - Deleting customer: ${id}`);
  const response = await API.delete(`/customers/${id}`);
  return response.data;
};

// ===== ✅ NEW: PAYMENT-RELATED APIs =====

// 💰 Get customer payment history
export const getCustomerPaymentsApi = async (customerId) => {
  console.log(`💰 API - Fetching payments for customer: ${customerId}`);
  try {
    const response = await API.get(`/customers/${customerId}/payments`);
    console.log(`✅ Found ${response.data.payments?.length || 0} payments`);
    return response.data;
  } catch (error) {
    console.error("❌ API Error fetching payments:", error.response?.data || error.message);
    throw error;
  }
};

// 📦 Get customer order history
export const getCustomerOrdersApi = async (customerId) => {
  console.log(`📦 API - Fetching orders for customer: ${customerId}`);
  try {
    const response = await API.get(`/customers/${customerId}/orders`);
    console.log(`✅ Found ${response.data.orders?.length || 0} orders`);
    return response.data;
  } catch (error) {
    console.error("❌ API Error fetching orders:", error.response?.data || error.message);
    throw error;
  }
};

// 📊 Get customer payment statistics
export const getCustomerPaymentStatsApi = async (customerId) => {
  console.log(`📊 API - Fetching payment stats for customer: ${customerId}`);
  try {
    const response = await API.get(`/customers/${customerId}/payment-stats`);
    console.log(`✅ Payment stats:`, response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error fetching payment stats:", error.response?.data || error.message);
    throw error;
  }
};

// ===== ✅ NEW: BULK OPERATIONS =====

// 📊 Get customers with payment summary (for dashboard)
export const getCustomersWithPaymentSummaryApi = async (params = {}) => {
  console.log(`📊 API - Fetching customers with payment summary`);
  const { page = 1, limit = 10, search = "" } = params;
  
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...(search && { search })
  }).toString();
  
  try {
    const response = await API.get(`/customers/with-payments?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("❌ API Error fetching customers with payments:", error.response?.data || error.message);
    throw error;
  }
};

// 📈 Get customer payment trends
export const getCustomerPaymentTrendsApi = async (customerId, period = 'month') => {
  console.log(`📈 API - Fetching payment trends for customer: ${customerId}, period: ${period}`);
  try {
    const response = await API.get(`/customers/${customerId}/payment-trends?period=${period}`);
    return response.data;
  } catch (error) {
    console.error("❌ API Error fetching payment trends:", error.response?.data || error.message);
    throw error;
  }
};

// ===== ✅ NEW: CUSTOMER SEARCH WITH PAYMENTS =====

// 🔍 Search customers by phone with payment summary
export const searchCustomerWithPaymentsApi = async (phone) => {
  console.log(`🔍 API - Searching customer by phone with payments: ${phone}`);
  try {
    const response = await API.get(`/customers/search/phone/${phone}?includePayments=true`);
    return response.data;
  } catch (error) {
    console.error("❌ API Error searching customer with payments:", error.response?.data || error.message);
    throw error;
  }
};

// 🔍 Search customers by ID with payment summary
export const searchCustomerByIdWithPaymentsApi = async (customerId) => {
  console.log(`🔍 API - Searching customer by ID with payments: ${customerId}`);
  try {
    const response = await API.get(`/customers/search/id/${customerId}?includePayments=true`);
    return response.data;
  } catch (error) {
    console.error("❌ API Error searching customer by ID with payments:", error.response?.data || error.message);
    throw error;
  }
};