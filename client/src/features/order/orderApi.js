import API from "../../app/axios";

// ===== 1. GET ALL ORDERS with filters =====
export const getAllOrdersApi = async (params = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    search = "", 
    status = "", 
    timeFilter = "all",
    startDate = "",
    endDate = "" 
  } = params;
  
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...(search && { search }),
    ...(status && status !== 'all' && { status }),
    ...(timeFilter && { timeFilter }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate })
  }).toString();

  console.log("📡 Fetching orders with params:", params);
  const response = await API.get(`/orders?${queryParams}`);
  return response.data;
};

// ===== 2. GET ORDER STATS =====
export const getOrderStatsApi = async () => {
  console.log("📊 Fetching order stats");
  const response = await API.get("/orders/stats");
  return response.data;
};

// ===== 3. GET ORDER BY ID (UPDATED - includes payments & works) =====
export const getOrderByIdApi = async (id) => {
  console.log(`📡 Fetching order: ${id}`);
  const response = await API.get(`/orders/${id}`);
  // Response includes: { order, payments, works }
  return response.data;
};

// ===== 4. CREATE NEW ORDER (UPDATED - with payments) =====
export const createOrderApi = async (orderData) => {
  // 🔍 CRITICAL DEBUGGING
  console.log("========== ORDER API DEBUG ==========");
  console.log("📥 Received orderData type:", typeof orderData);
  console.log("📥 Received orderData:", orderData);
  console.log("📥 All keys:", Object.keys(orderData));
  console.log("📥 createdBy value:", orderData.createdBy);
  console.log("📥 createdBy type:", typeof orderData.createdBy);
  console.log("📥 createdBy length:", orderData.createdBy?.length);
  console.log("📥 customer value:", orderData.customer);
  console.log("📥 payments value:", orderData.payments); // ✅ New
  console.log("=====================================");
  
  // Create a clean copy of the data with payments
  const dataToSend = {
    customer: orderData.customer,
    deliveryDate: orderData.deliveryDate,
    specialNotes: orderData.specialNotes || "",
    advancePayment: {
      amount: Number(orderData.advancePayment?.amount) || 0,
      method: orderData.advancePayment?.method || "cash",
      date: orderData.advancePayment?.date || new Date().toISOString(),
    },
    priceSummary: {
      totalMin: Number(orderData.priceSummary?.totalMin) || 0,
      totalMax: Number(orderData.priceSummary?.totalMax) || 0,
    },
    balanceAmount: Number(orderData.balanceAmount) || 0,
    createdBy: orderData.createdBy,
    status: orderData.status || "draft",
    orderDate: orderData.orderDate || new Date().toISOString(),
    garments: orderData.garments || [],
    // ✅ NEW: Include payments array if provided
    payments: orderData.payments || [],
  };

  // Verify createdBy is still present
  console.log("📤 Data being sent to backend:", {
    ...dataToSend,
    createdBy: dataToSend.createdBy || "❌ MISSING - THIS IS THE PROBLEM!",
    paymentsCount: dataToSend.payments?.length || 0
  });

  if (!dataToSend.createdBy) {
    console.error("❌ CRITICAL: createdBy is missing in dataToSend!");
    throw new Error("createdBy is required but was not provided");
  }

  try {
    const response = await API.post("/orders", dataToSend);
    console.log("✅ Order created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Order creation failed:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

// ===== 5. UPDATE ORDER (UPDATED) =====
export const updateOrderApi = async (id, orderData) => {
  console.log(`========== UPDATE ORDER API DEBUG ==========`);
  console.log(`📝 Updating order ${id}:`, orderData);
  
  const dataToSend = {
    deliveryDate: orderData.deliveryDate,
    specialNotes: orderData.specialNotes || "",
    advancePayment: {
      amount: Number(orderData.advancePayment?.amount) || 0,
      method: orderData.advancePayment?.method || "cash",
    },
    priceSummary: {
      totalMin: Number(orderData.priceSummary?.totalMin) || 0,
      totalMax: Number(orderData.priceSummary?.totalMax) || 0,
    },
    balanceAmount: Number(orderData.balanceAmount) || 0,
    status: orderData.status || "draft",
    // ✅ Include new garments if any
    newGarments: orderData.newGarments || [],
  };

  console.log("📤 Update data being sent:", dataToSend);
  console.log("==========================================");

  try {
    const response = await API.put(`/orders/${id}`, dataToSend);
    console.log("✅ Order updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Order update failed:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

// ===== 6. UPDATE ORDER STATUS =====
export const updateOrderStatusApi = async (id, status) => {
  console.log(`🔄 Updating order ${id} status to:`, status);
  const response = await API.patch(`/orders/${id}/status`, { status });
  return response.data;
};

// ===== 7. DELETE ORDER =====
export const deleteOrderApi = async (id) => {
  console.log(`🗑️ Deleting order: ${id}`);
  const response = await API.delete(`/orders/${id}`);
  return response.data;
};

// ===== ✅ NEW: ADD PAYMENT TO ORDER =====
export const addPaymentToOrderApi = async (orderId, paymentData) => {
  console.log(`💰 Adding payment to order ${orderId}:`, paymentData);
  
  const dataToSend = {
    amount: Number(paymentData.amount),
    type: paymentData.type || 'advance',
    method: paymentData.method || 'cash',
    referenceNumber: paymentData.referenceNumber || '',
    paymentDate: paymentData.paymentDate || new Date().toISOString().split('T')[0],
    paymentTime: paymentData.paymentTime || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    notes: paymentData.notes || ''
  };

  try {
    const response = await API.post(`/orders/${orderId}/payments`, dataToSend);
    console.log("✅ Payment added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Add payment failed:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

// ===== ✅ NEW: GET ORDER PAYMENTS =====
export const getOrderPaymentsApi = async (orderId) => {
  console.log(`💰 Fetching payments for order: ${orderId}`);
  
  try {
    const response = await API.get(`/orders/${orderId}/payments`);
    console.log(`✅ Found ${response.data.payments?.length || 0} payments`);
    return response.data;
  } catch (error) {
    console.error("❌ Get payments failed:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

// ===== ✅ NEW: GET ORDER WITH PAYMENTS & WORKS =====
export const getOrderWithDetailsApi = async (orderId) => {
  console.log(`📦 Fetching order with details: ${orderId}`);
  
  try {
    const response = await API.get(`/orders/${orderId}`);
    return response.data; // Already includes payments and works
  } catch (error) {
    console.error("❌ Get order details failed:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};