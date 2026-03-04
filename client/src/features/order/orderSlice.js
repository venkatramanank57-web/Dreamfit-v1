// // frontend/src/features/orders/orderSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import * as orderApi from "./orderApi";

// // ============================================
// // 🔄 ASYNC THUNKS
// // ============================================

// // Get order stats
// export const fetchOrderStats = createAsyncThunk(
//   "orders/fetchStats",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await orderApi.getOrderStats();
//       return response.stats;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
//     }
//   }
// );

// // Get dashboard data
// export const fetchDashboardData = createAsyncThunk(
//   "orders/fetchDashboard",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await orderApi.getDashboardData();
//       return response.dashboard;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard");
//     }
//   }
// );

// // Create new order
// export const createNewOrder = createAsyncThunk(
//   "orders/create",
//   async (orderData, { rejectWithValue }) => {
//     try {
//       const response = await orderApi.createOrder(orderData);
//       return response.order;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to create order");
//     }
//   }
// );

// // Get all orders
// export const fetchOrders = createAsyncThunk(
//   "orders/fetchAll",
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const response = await orderApi.getAllOrders(params);
//       return {
//         orders: response.orders,
//         pagination: response.pagination
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
//     }
//   }
// );

// // ✅ NEW: Get orders by customer ID
// export const fetchOrdersByCustomer = createAsyncThunk(
//   "orders/fetchByCustomer",
//   async (customerId, { rejectWithValue }) => {
//     try {
//       const response = await orderApi.getOrdersByCustomer(customerId);
//       return {
//         customerId,
//         orders: response.orders || []
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch customer orders");
//     }
//   }
// );

// // Get single order
// export const fetchOrderById = createAsyncThunk(
//   "orders/fetchById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await orderApi.getOrderById(id);
//       return {
//         order: response.order,
//         payments: response.payments,
//         works: response.works
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch order");
//     }
//   }
// );

// // Update order
// export const updateExistingOrder = createAsyncThunk(
//   "orders/update",
//   async ({ id, data }, { rejectWithValue }) => {
//     try {
//       const response = await orderApi.updateOrder(id, data);
//       return response.order;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to update order");
//     }
//   }
// );

// // Update order status
// export const updateOrderStatusThunk = createAsyncThunk(
//   "orders/updateStatus",
//   async ({ id, status }, { rejectWithValue }) => {
//     try {
//       const response = await orderApi.updateOrderStatus(id, status);
//       return response.order;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to update status");
//     }
//   }
// );

// // Delete order
// export const deleteExistingOrder = createAsyncThunk(
//   "orders/delete",
//   async (id, { rejectWithValue }) => {
//     try {
//       await orderApi.deleteOrder(id);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to delete order");
//     }
//   }
// );

// // Add payment to order
// export const addPayment = createAsyncThunk(
//   "orders/addPayment",
//   async ({ orderId, paymentData }, { rejectWithValue }) => {
//     try {
//       const response = await orderApi.addPaymentToOrder(orderId, paymentData);
//       return {
//         orderId,
//         payment: response.payment
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to add payment");
//     }
//   }
// );

// // Get order payments
// export const fetchOrderPayments = createAsyncThunk(
//   "orders/fetchPayments",
//   async (orderId, { rejectWithValue }) => {
//     try {
//       const response = await orderApi.getOrderPayments(orderId);
//       return {
//         orderId,
//         payments: response.payments
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch payments");
//     }
//   }
// );

// // ============================================
// // 📊 INITIAL STATE
// // ============================================
// const initialState = {
//   orders: [],
//   currentOrder: null,
//   currentPayments: [],
//   currentWorks: [],
//   customerOrders: {}, // ✅ New: Store orders by customer ID
//   stats: {
//     today: 0,
//     thisWeek: 0,
//     thisMonth: 0,
//     total: 0,
//     statusBreakdown: [],
//     paymentBreakdown: []
//   },
//   dashboard: {
//     todayOrders: { count: 0, orders: [] },
//     pendingDeliveries: { count: 0, orders: [] },
//     recentOrders: [],
//     todayCollection: 0
//   },
//   pagination: {
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 1
//   },
//   loading: false,
//   error: null,
//   success: false
// };

// // ============================================
// // 🎯 ORDER SLICE
// // ============================================
// const orderSlice = createSlice({
//   name: "orders",
//   initialState,
//   reducers: {
//     clearOrderError: (state) => {
//       state.error = null;
//     },
//     clearCurrentOrder: (state) => {
//       state.currentOrder = null;
//       state.currentPayments = [];
//       state.currentWorks = [];
//     },
//     clearCustomerOrders: (state, action) => {
//       const { customerId } = action.payload;
//       if (customerId) {
//         delete state.customerOrders[customerId];
//       } else {
//         state.customerOrders = {};
//       }
//     },
//     setPagination: (state, action) => {
//       state.pagination = { ...state.pagination, ...action.payload };
//     },
//     resetOrderState: () => initialState
//   },
//   extraReducers: (builder) => {
//     builder
//       // ===== FETCH STATS =====
//       .addCase(fetchOrderStats.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchOrderStats.fulfilled, (state, action) => {
//         state.loading = false;
//         state.stats = action.payload;
//       })
//       .addCase(fetchOrderStats.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== FETCH DASHBOARD =====
//       .addCase(fetchDashboardData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchDashboardData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.dashboard = action.payload;
//       })
//       .addCase(fetchDashboardData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== CREATE ORDER =====
//       .addCase(createNewOrder.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(createNewOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders.unshift(action.payload);
//         state.success = true;
        
//         // ✅ Also add to customerOrders if customer exists
//         if (action.payload.customer) {
//           const customerId = action.payload.customer._id || action.payload.customer;
//           if (!state.customerOrders[customerId]) {
//             state.customerOrders[customerId] = [];
//           }
//           state.customerOrders[customerId].unshift(action.payload);
//         }
//       })
//       .addCase(createNewOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.success = false;
//       })

//       // ===== FETCH ALL ORDERS =====
//       .addCase(fetchOrders.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchOrders.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders = action.payload.orders;
//         state.pagination = action.payload.pagination;
//       })
//       .addCase(fetchOrders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== FETCH ORDERS BY CUSTOMER =====
//       .addCase(fetchOrdersByCustomer.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchOrdersByCustomer.fulfilled, (state, action) => {
//         state.loading = false;
//         const { customerId, orders } = action.payload;
//         state.customerOrders[customerId] = orders;
//       })
//       .addCase(fetchOrdersByCustomer.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== FETCH ORDER BY ID =====
//       .addCase(fetchOrderById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchOrderById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentOrder = action.payload.order;
//         state.currentPayments = action.payload.payments || [];
//         state.currentWorks = action.payload.works || [];
//       })
//       .addCase(fetchOrderById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== UPDATE ORDER =====
//       .addCase(updateExistingOrder.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateExistingOrder.fulfilled, (state, action) => {
//         state.loading = false;
        
//         // Update in main orders array
//         const index = state.orders.findIndex(o => o._id === action.payload._id);
//         if (index !== -1) {
//           state.orders[index] = action.payload;
//         }
        
//         // Update in customerOrders if customer exists
//         if (action.payload.customer) {
//           const customerId = action.payload.customer._id || action.payload.customer;
//           if (state.customerOrders[customerId]) {
//             const custIndex = state.customerOrders[customerId].findIndex(o => o._id === action.payload._id);
//             if (custIndex !== -1) {
//               state.customerOrders[customerId][custIndex] = action.payload;
//             }
//           }
//         }
        
//         // Update currentOrder if it's the same
//         if (state.currentOrder?._id === action.payload._id) {
//           state.currentOrder = action.payload;
//         }
//         state.success = true;
//       })
//       .addCase(updateExistingOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== UPDATE ORDER STATUS =====
//       .addCase(updateOrderStatusThunk.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
//         state.loading = false;
        
//         // Update in main orders array
//         const index = state.orders.findIndex(o => o._id === action.payload._id);
//         if (index !== -1) {
//           state.orders[index] = action.payload;
//         }
        
//         // Update in customerOrders if customer exists
//         if (action.payload.customer) {
//           const customerId = action.payload.customer._id || action.payload.customer;
//           if (state.customerOrders[customerId]) {
//             const custIndex = state.customerOrders[customerId].findIndex(o => o._id === action.payload._id);
//             if (custIndex !== -1) {
//               state.customerOrders[customerId][custIndex] = action.payload;
//             }
//           }
//         }
        
//         // Update currentOrder if it's the same
//         if (state.currentOrder?._id === action.payload._id) {
//           state.currentOrder = action.payload;
//         }
//       })
//       .addCase(updateOrderStatusThunk.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== DELETE ORDER =====
//       .addCase(deleteExistingOrder.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteExistingOrder.fulfilled, (state, action) => {
//         state.loading = false;
        
//         // Remove from main orders array
//         state.orders = state.orders.filter(o => o._id !== action.payload);
        
//         // Remove from all customerOrders entries
//         Object.keys(state.customerOrders).forEach(customerId => {
//           state.customerOrders[customerId] = state.customerOrders[customerId].filter(
//             o => o._id !== action.payload
//           );
//         });
        
//         // Clear currentOrder if it's the deleted one
//         if (state.currentOrder?._id === action.payload) {
//           state.currentOrder = null;
//           state.currentPayments = [];
//           state.currentWorks = [];
//         }
//         state.success = true;
//       })
//       .addCase(deleteExistingOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== ADD PAYMENT =====
//       .addCase(addPayment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addPayment.fulfilled, (state, action) => {
//         state.loading = false;
//         // Will be refreshed by fetch
//         state.success = true;
//       })
//       .addCase(addPayment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== FETCH ORDER PAYMENTS =====
//       .addCase(fetchOrderPayments.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchOrderPayments.fulfilled, (state, action) => {
//         state.loading = false;
//         if (state.currentOrder?._id === action.payload.orderId) {
//           state.currentPayments = action.payload.payments;
//         }
//       })
//       .addCase(fetchOrderPayments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   }
// });

// // ============================================
// // 📤 EXPORT ACTIONS & REDUCER
// // ============================================
// export const { 
//   clearOrderError, 
//   clearCurrentOrder,
//   clearCustomerOrders, 
//   setPagination, 
//   resetOrderState 
// } = orderSlice.actions;

// export default orderSlice.reducer;




// frontend/src/features/orders/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as orderApi from "./orderApi";

// ============================================
// 🔄 ASYNC THUNKS
// ============================================

// Get order stats
export const fetchOrderStats = createAsyncThunk(
  "orders/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderStats();
      return response.stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

// Get dashboard data
export const fetchDashboardData = createAsyncThunk(
  "orders/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getDashboardData();
      return response.dashboard;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard");
    }
  }
);

// ✅ NEW: Get ready to delivery orders
export const fetchReadyToDeliveryOrders = createAsyncThunk(
  "orders/fetchReadyToDelivery",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getReadyToDeliveryOrders();
      return {
        orders: response.orders || [],
        count: response.count || 0
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch ready to delivery orders");
    }
  }
);

// Create new order
export const createNewOrder = createAsyncThunk(
  "orders/create",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderApi.createOrder(orderData);
      return response.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create order");
    }
  }
);

// Get all orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await orderApi.getAllOrders(params);
      return {
        orders: response.orders,
        pagination: response.pagination
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// Get orders by customer ID
export const fetchOrdersByCustomer = createAsyncThunk(
  "orders/fetchByCustomer",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrdersByCustomer(customerId);
      return {
        customerId,
        orders: response.orders || []
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch customer orders");
    }
  }
);

// Get single order
export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderById(id);
      return {
        order: response.order,
        payments: response.payments,
        works: response.works
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch order");
    }
  }
);

// Update order
export const updateExistingOrder = createAsyncThunk(
  "orders/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await orderApi.updateOrder(id, data);
      return response.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update order");
    }
  }
);

// Update order status
export const updateOrderStatusThunk = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await orderApi.updateOrderStatus(id, status);
      return response.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  }
);

// Delete order
export const deleteExistingOrder = createAsyncThunk(
  "orders/delete",
  async (id, { rejectWithValue }) => {
    try {
      await orderApi.deleteOrder(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete order");
    }
  }
);

// Add payment to order
export const addPayment = createAsyncThunk(
  "orders/addPayment",
  async ({ orderId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await orderApi.addPaymentToOrder(orderId, paymentData);
      return {
        orderId,
        payment: response.payment
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add payment");
    }
  }
);

// Get order payments
export const fetchOrderPayments = createAsyncThunk(
  "orders/fetchPayments",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderPayments(orderId);
      return {
        orderId,
        payments: response.payments
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payments");
    }
  }
);

// ============================================
// 📊 INITIAL STATE (UPDATED with readyToDelivery)
// ============================================
const initialState = {
  orders: [],
  currentOrder: null,
  currentPayments: [],
  currentWorks: [],
  customerOrders: {}, // Store orders by customer ID
  // ✅ NEW: Ready to delivery orders
  readyToDelivery: {
    orders: [],
    count: 0,
    loading: false
  },
  stats: {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
    statusBreakdown: [],
    paymentBreakdown: []
  },
  dashboard: {
    todayOrders: { count: 0, orders: [] },
    pendingDeliveries: { count: 0, orders: [] },
    // ✅ NEW: Ready for delivery in dashboard
    readyForDelivery: { count: 0, orders: [] },
    recentOrders: [],
    todayCollection: 0
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  },
  loading: false,
  error: null,
  success: false
};

// ============================================
// 🎯 ORDER SLICE
// ============================================
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.currentPayments = [];
      state.currentWorks = [];
    },
    clearCustomerOrders: (state, action) => {
      const { customerId } = action.payload;
      if (customerId) {
        delete state.customerOrders[customerId];
      } else {
        state.customerOrders = {};
      }
    },
    // ✅ NEW: Clear ready to delivery orders
    clearReadyToDelivery: (state) => {
      state.readyToDelivery = {
        orders: [],
        count: 0,
        loading: false
      };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetOrderState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // ===== FETCH STATS =====
      .addCase(fetchOrderStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchOrderStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== FETCH DASHBOARD =====
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== FETCH READY TO DELIVERY ORDERS (NEW) =====
      .addCase(fetchReadyToDeliveryOrders.pending, (state) => {
        state.readyToDelivery.loading = true;
        state.error = null;
      })
      .addCase(fetchReadyToDeliveryOrders.fulfilled, (state, action) => {
        state.readyToDelivery.loading = false;
        state.readyToDelivery.orders = action.payload.orders;
        state.readyToDelivery.count = action.payload.count;
      })
      .addCase(fetchReadyToDeliveryOrders.rejected, (state, action) => {
        state.readyToDelivery.loading = false;
        state.error = action.payload;
      })

      // ===== CREATE ORDER =====
      .addCase(createNewOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.success = true;
        
        // Add to customerOrders if customer exists
        if (action.payload.customer) {
          const customerId = action.payload.customer._id || action.payload.customer;
          if (!state.customerOrders[customerId]) {
            state.customerOrders[customerId] = [];
          }
          state.customerOrders[customerId].unshift(action.payload);
        }

        // ✅ If order is ready-to-delivery, add to readyToDelivery list
        if (action.payload.status === 'ready-to-delivery') {
          state.readyToDelivery.orders.unshift(action.payload);
          state.readyToDelivery.count += 1;
        }
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // ===== FETCH ALL ORDERS =====
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== FETCH ORDERS BY CUSTOMER =====
      .addCase(fetchOrdersByCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const { customerId, orders } = action.payload;
        state.customerOrders[customerId] = orders;
      })
      .addCase(fetchOrdersByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== FETCH ORDER BY ID =====
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
        state.currentPayments = action.payload.payments || [];
        state.currentWorks = action.payload.works || [];
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== UPDATE ORDER =====
      .addCase(updateExistingOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingOrder.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update in main orders array
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        
        // Update in customerOrders if customer exists
        if (action.payload.customer) {
          const customerId = action.payload.customer._id || action.payload.customer;
          if (state.customerOrders[customerId]) {
            const custIndex = state.customerOrders[customerId].findIndex(o => o._id === action.payload._id);
            if (custIndex !== -1) {
              state.customerOrders[customerId][custIndex] = action.payload;
            }
          }
        }
        
        // ✅ Update in readyToDelivery list if needed
        const readyIndex = state.readyToDelivery.orders.findIndex(o => o._id === action.payload._id);
        if (action.payload.status === 'ready-to-delivery') {
          if (readyIndex === -1) {
            state.readyToDelivery.orders.unshift(action.payload);
            state.readyToDelivery.count += 1;
          } else {
            state.readyToDelivery.orders[readyIndex] = action.payload;
          }
        } else if (readyIndex !== -1) {
          // If status changed from ready-to-delivery to something else, remove from list
          state.readyToDelivery.orders.splice(readyIndex, 1);
          state.readyToDelivery.count -= 1;
        }
        
        // Update currentOrder if it's the same
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
        state.success = true;
      })
      .addCase(updateExistingOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== UPDATE ORDER STATUS =====
      .addCase(updateOrderStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update in main orders array
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        
        // Update in customerOrders if customer exists
        if (action.payload.customer) {
          const customerId = action.payload.customer._id || action.payload.customer;
          if (state.customerOrders[customerId]) {
            const custIndex = state.customerOrders[customerId].findIndex(o => o._id === action.payload._id);
            if (custIndex !== -1) {
              state.customerOrders[customerId][custIndex] = action.payload;
            }
          }
        }
        
        // ✅ Update in readyToDelivery list based on status
        const readyIndex = state.readyToDelivery.orders.findIndex(o => o._id === action.payload._id);
        if (action.payload.status === 'ready-to-delivery') {
          if (readyIndex === -1) {
            state.readyToDelivery.orders.unshift(action.payload);
            state.readyToDelivery.count += 1;
          } else {
            state.readyToDelivery.orders[readyIndex] = action.payload;
          }
        } else if (readyIndex !== -1) {
          // If status changed from ready-to-delivery to something else
          state.readyToDelivery.orders.splice(readyIndex, 1);
          state.readyToDelivery.count -= 1;
        }
        
        // Update currentOrder if it's the same
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== DELETE ORDER =====
      .addCase(deleteExistingOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExistingOrder.fulfilled, (state, action) => {
        state.loading = false;
        
        // Remove from main orders array
        state.orders = state.orders.filter(o => o._id !== action.payload);
        
        // Remove from all customerOrders entries
        Object.keys(state.customerOrders).forEach(customerId => {
          state.customerOrders[customerId] = state.customerOrders[customerId].filter(
            o => o._id !== action.payload
          );
        });
        
        // ✅ Remove from readyToDelivery list
        const readyIndex = state.readyToDelivery.orders.findIndex(o => o._id === action.payload);
        if (readyIndex !== -1) {
          state.readyToDelivery.orders.splice(readyIndex, 1);
          state.readyToDelivery.count -= 1;
        }
        
        // Clear currentOrder if it's the deleted one
        if (state.currentOrder?._id === action.payload) {
          state.currentOrder = null;
          state.currentPayments = [];
          state.currentWorks = [];
        }
        state.success = true;
      })
      .addCase(deleteExistingOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== ADD PAYMENT =====
      .addCase(addPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.loading = false;
        // Will be refreshed by fetch
        state.success = true;
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== FETCH ORDER PAYMENTS =====
      .addCase(fetchOrderPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderPayments.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentOrder?._id === action.payload.orderId) {
          state.currentPayments = action.payload.payments;
        }
      })
      .addCase(fetchOrderPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// ============================================
// 📤 EXPORT ACTIONS & REDUCER
// ============================================
export const { 
  clearOrderError, 
  clearCurrentOrder,
  clearCustomerOrders,
  clearReadyToDelivery, // ✅ NEW
  setPagination, 
  resetOrderState 
} = orderSlice.actions;

export default orderSlice.reducer;