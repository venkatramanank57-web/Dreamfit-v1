// features/customer/customerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  searchCustomerApi, 
  createCustomerApi, 
  getAllCustomersApi,
  getCustomerByIdApi,
  updateCustomerApi,
  deleteCustomerApi,
  searchCustomerByCustomerIdApi,
  // ✅ NEW: Import payment-related APIs
  getCustomerPaymentsApi,
  getCustomerOrdersApi,
  getCustomerPaymentStatsApi
} from "./customerApi";

// 🔍 Search Customer by Phone
export const searchCustomerByPhone = createAsyncThunk(
  "customer/search",
  async (phone, { rejectWithValue }) => {
    try {
      console.log(`🔍 [Thunk] Searching customer by phone: ${phone}`);
      const result = await searchCustomerApi(phone);
      console.log(`✅ [Thunk] Search result:`, result);
      return result;
    } catch (err) {
      console.error(`❌ [Thunk] Search failed:`, err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Search failed" });
    }
  }
);

// 🔍 Search Customer by Customer ID
export const searchCustomerByCustomerId = createAsyncThunk(
  "customer/searchById",
  async (customerId, { rejectWithValue }) => {
    try {
      console.log(`🔍 [Thunk] Searching customer by ID: ${customerId}`);
      const result = await searchCustomerByCustomerIdApi(customerId);
      console.log(`✅ [Thunk] Search result:`, result);
      return result;
    } catch (err) {
      console.error(`❌ [Thunk] Search failed:`, err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Search failed" });
    }
  }
);

// 🆕 Create New Customer
export const createNewCustomer = createAsyncThunk(
  "customer/create",
  async (customerData, { rejectWithValue }) => {
    try {
      console.log("\n🟢 ========== THUNK: CREATE CUSTOMER ==========");
      console.log("📦 Raw customerData received in thunk:", customerData);
      console.log("📞 contactNumber:", customerData.contactNumber);
      console.log("🏠 addressLine1:", customerData.addressLine1);
      console.log("📅 dateOfBirth:", customerData.dateOfBirth);
      console.log("📧 email:", customerData.email);
      console.log("===========================================\n");
      
      const result = await createCustomerApi(customerData);
      
      console.log("\n✅ [Thunk] Create successful:", result);
      return result;
    } catch (err) {
      console.error("\n❌ [Thunk] Create failed:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Creation failed" });
    }
  }
);

// 📋 Fetch All Customers
export const fetchAllCustomers = createAsyncThunk(
  "customer/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      console.log(`📋 [Thunk] Fetching all customers...`);
      const result = await getAllCustomersApi();
      console.log(`✅ [Thunk] Found ${result?.length || 0} customers`);
      return result;
    } catch (err) {
      console.error(`❌ [Thunk] Fetch failed:`, err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Failed to fetch customers" });
    }
  }
);

// 👤 Fetch Customer by MongoDB ID (UPDATED - includes payments & orders)
export const fetchCustomerById = createAsyncThunk(
  "customer/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`👤 [Thunk] Fetching customer by ID: ${id}`);
      const result = await getCustomerByIdApi(id);
      console.log(`✅ [Thunk] Found customer:`, result?.customer?.name);
      console.log(`💰 Payments: ${result?.payments?.length || 0}`);
      console.log(`📦 Orders: ${result?.orders?.length || 0}`);
      return result;
    } catch (err) {
      console.error(`❌ [Thunk] Fetch failed:`, err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Failed to fetch customer" });
    }
  }
);

// ✏️ Update Customer
export const updateCustomer = createAsyncThunk(
  "customer/update",
  async ({ id, customerData }, { rejectWithValue }) => {
    try {
      console.log(`✏️ [Thunk] Updating customer ID: ${id}`);
      console.log("📦 Update data:", customerData);
      
      const result = await updateCustomerApi(id, customerData);
      console.log(`✅ [Thunk] Update successful:`, result);
      return result;
    } catch (err) {
      console.error(`❌ [Thunk] Update failed:`, err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Failed to update customer" });
    }
  }
);

// ❌ Delete Customer
export const deleteCustomer = createAsyncThunk(
  "customer/delete",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`🗑️ [Thunk] Deleting customer ID: ${id}`);
      const result = await deleteCustomerApi(id);
      console.log(`✅ [Thunk] Delete successful:`, result);
      return result;
    } catch (err) {
      console.error(`❌ [Thunk] Delete failed:`, err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Failed to delete customer" });
    }
  }
);

// ===== ✅ NEW: GET CUSTOMER PAYMENTS =====
export const fetchCustomerPayments = createAsyncThunk(
  "customer/fetchPayments",
  async (customerId, { rejectWithValue }) => {
    try {
      console.log(`💰 [Thunk] Fetching payments for customer: ${customerId}`);
      const result = await getCustomerPaymentsApi(customerId);
      console.log(`✅ [Thunk] Found ${result?.payments?.length || 0} payments`);
      return result;
    } catch (err) {
      console.error(`❌ [Thunk] Fetch payments failed:`, err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Failed to fetch payments" });
    }
  }
);

// ===== ✅ NEW: GET CUSTOMER ORDERS =====
export const fetchCustomerOrders = createAsyncThunk(
  "customer/fetchOrders",
  async (customerId, { rejectWithValue }) => {
    try {
      console.log(`📦 [Thunk] Fetching orders for customer: ${customerId}`);
      const result = await getCustomerOrdersApi(customerId);
      console.log(`✅ [Thunk] Found ${result?.orders?.length || 0} orders`);
      return result;
    } catch (err) {
      console.error(`❌ [Thunk] Fetch orders failed:`, err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Failed to fetch orders" });
    }
  }
);

// ===== ✅ NEW: GET CUSTOMER PAYMENT STATS =====
export const fetchCustomerPaymentStats = createAsyncThunk(
  "customer/fetchPaymentStats",
  async (customerId, { rejectWithValue }) => {
    try {
      console.log(`📊 [Thunk] Fetching payment stats for customer: ${customerId}`);
      const result = await getCustomerPaymentStatsApi(customerId);
      console.log(`✅ [Thunk] Payment stats:`, result);
      return result;
    } catch (err) {
      console.error(`❌ [Thunk] Fetch payment stats failed:`, err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Failed to fetch payment stats" });
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    currentCustomer: null,
    customers: [],
    // ✅ NEW: Payment-related state
    customerPayments: [],
    customerOrders: [],
    customerPaymentStats: {
      totalPaid: 0,
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      paymentCount: 0,
      recentPayments: []
    },
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearCustomerState: (state) => {
      console.log("🧹 [Reducer] Clearing customer state");
      state.currentCustomer = null;
      state.customerPayments = [];
      state.customerOrders = [];
      state.customerPaymentStats = {
        totalPaid: 0,
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        paymentCount: 0,
        recentPayments: []
      };
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    // ✅ NEW: Clear customer payments
    clearCustomerPayments: (state) => {
      state.customerPayments = [];
    },
    // ✅ NEW: Clear customer orders
    clearCustomerOrders: (state) => {
      state.customerOrders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Search by Phone Actions
      .addCase(searchCustomerByPhone.pending, (state) => {
        console.log("🟡 [Reducer] searchCustomerByPhone pending");
        state.loading = true;
        state.error = null;
        state.currentCustomer = null;
      })
      .addCase(searchCustomerByPhone.fulfilled, (state, action) => {
        console.log("✅ [Reducer] searchCustomerByPhone fulfilled");
        state.loading = false;
        state.currentCustomer = action.payload;
        state.error = null;
      })
      .addCase(searchCustomerByPhone.rejected, (state, action) => {
        console.error("❌ [Reducer] searchCustomerByPhone rejected:", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Search failed";
        state.currentCustomer = null;
      })
      
      // Search by Customer ID Actions
      .addCase(searchCustomerByCustomerId.pending, (state) => {
        console.log("🟡 [Reducer] searchCustomerByCustomerId pending");
        state.loading = true;
        state.error = null;
        state.currentCustomer = null;
      })
      .addCase(searchCustomerByCustomerId.fulfilled, (state, action) => {
        console.log("✅ [Reducer] searchCustomerByCustomerId fulfilled");
        state.loading = false;
        state.currentCustomer = action.payload;
        state.error = null;
      })
      .addCase(searchCustomerByCustomerId.rejected, (state, action) => {
        console.error("❌ [Reducer] searchCustomerByCustomerId rejected:", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Search failed";
        state.currentCustomer = null;
      })
      
      // Create Actions
      .addCase(createNewCustomer.pending, (state) => {
        console.log("🟡 [Reducer] createNewCustomer pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewCustomer.fulfilled, (state, action) => {
        console.log("✅ [Reducer] createNewCustomer fulfilled");
        console.log("📦 Response data:", action.payload);
        state.loading = false;
        state.success = true;
        state.currentCustomer = action.payload.customer || action.payload;
        state.customers = [state.currentCustomer, ...state.customers];
        state.error = null;
      })
      .addCase(createNewCustomer.rejected, (state, action) => {
        console.error("❌ [Reducer] createNewCustomer rejected:", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Creation failed";
      })

      // Fetch All Customers
      .addCase(fetchAllCustomers.pending, (state) => {
        console.log("🟡 [Reducer] fetchAllCustomers pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        console.log(`✅ [Reducer] fetchAllCustomers fulfilled: ${action.payload?.length} customers`);
        state.loading = false;
        state.customers = action.payload;
        state.error = null;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        console.error("❌ [Reducer] fetchAllCustomers rejected:", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch customers";
      })

      // Fetch Customer By MongoDB ID (UPDATED)
      .addCase(fetchCustomerById.pending, (state) => {
        console.log("🟡 [Reducer] fetchCustomerById pending");
        state.loading = true;
        state.error = null;
        state.customerPayments = [];
        state.customerOrders = [];
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        console.log("✅ [Reducer] fetchCustomerById fulfilled");
        state.loading = false;
        state.currentCustomer = action.payload.customer;
        state.customerPayments = action.payload.payments || [];
        state.customerOrders = action.payload.orders || [];
        state.customerPaymentStats = action.payload.paymentSummary || {
          totalPaid: 0,
          totalOrders: state.customerOrders.length,
          completedOrders: state.customerOrders.filter(o => o.status === 'delivered').length,
          pendingOrders: state.customerOrders.filter(o => o.status !== 'delivered').length,
          paymentCount: state.customerPayments.length,
          recentPayments: state.customerPayments.slice(0, 5)
        };
        state.error = null;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        console.error("❌ [Reducer] fetchCustomerById rejected:", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch customer";
        state.currentCustomer = null;
        state.customerPayments = [];
        state.customerOrders = [];
      })

      // ✅ NEW: Fetch Customer Payments
      .addCase(fetchCustomerPayments.pending, (state) => {
        console.log("🟡 [Reducer] fetchCustomerPayments pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerPayments.fulfilled, (state, action) => {
        console.log("✅ [Reducer] fetchCustomerPayments fulfilled");
        state.loading = false;
        state.customerPayments = action.payload.payments || [];
        state.error = null;
      })
      .addCase(fetchCustomerPayments.rejected, (state, action) => {
        console.error("❌ [Reducer] fetchCustomerPayments rejected:", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch payments";
      })

      // ✅ NEW: Fetch Customer Orders
      .addCase(fetchCustomerOrders.pending, (state) => {
        console.log("🟡 [Reducer] fetchCustomerOrders pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        console.log("✅ [Reducer] fetchCustomerOrders fulfilled");
        state.loading = false;
        state.customerOrders = action.payload.orders || [];
        state.error = null;
      })
      .addCase(fetchCustomerOrders.rejected, (state, action) => {
        console.error("❌ [Reducer] fetchCustomerOrders rejected:", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })

      // ✅ NEW: Fetch Customer Payment Stats
      .addCase(fetchCustomerPaymentStats.pending, (state) => {
        console.log("🟡 [Reducer] fetchCustomerPaymentStats pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerPaymentStats.fulfilled, (state, action) => {
        console.log("✅ [Reducer] fetchCustomerPaymentStats fulfilled");
        state.loading = false;
        state.customerPaymentStats = action.payload;
        state.error = null;
      })
      .addCase(fetchCustomerPaymentStats.rejected, (state, action) => {
        console.error("❌ [Reducer] fetchCustomerPaymentStats rejected:", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch payment stats";
      })

      // Update Customer
      .addCase(updateCustomer.pending, (state) => {
        console.log("🟡 [Reducer] updateCustomer pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        console.log("✅ [Reducer] updateCustomer fulfilled");
        state.loading = false;
        state.currentCustomer = action.payload.customer || action.payload;
        // Update in customers list
        const index = state.customers.findIndex(c => c._id === state.currentCustomer._id);
        if (index !== -1) {
          state.customers[index] = state.currentCustomer;
          console.log(`✅ Updated customer at index ${index}`);
        }
        state.success = true;
        state.error = null;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        console.error("❌ [Reducer] updateCustomer rejected:", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Failed to update customer";
      })

      // Delete Customer
      .addCase(deleteCustomer.pending, (state) => {
        console.log("🟡 [Reducer] deleteCustomer pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        console.log("✅ [Reducer] deleteCustomer fulfilled, ID:", action.meta.arg);
        state.loading = false;
        state.currentCustomer = null;
        state.customerPayments = [];
        state.customerOrders = [];
        // Remove from customers list
        state.customers = state.customers.filter(c => c._id !== action.meta.arg);
        state.success = true;
        state.error = null;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        console.error("❌ [Reducer] deleteCustomer rejected:", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete customer";
      });
  },
});

// ===== SELECTORS =====
export const selectCustomer = (state) => state.customer.currentCustomer;
export const selectCustomers = (state) => state.customer.customers;
export const selectCustomerPayments = (state) => state.customer.customerPayments; // ✅ NEW
export const selectCustomerOrders = (state) => state.customer.customerOrders; // ✅ NEW
export const selectCustomerPaymentStats = (state) => state.customer.customerPaymentStats; // ✅ NEW
export const selectCustomerLoading = (state) => state.customer.loading;
export const selectCustomerError = (state) => state.customer.error;
export const selectCustomerSuccess = (state) => state.customer.success;

export const { clearCustomerState, clearCustomerPayments, clearCustomerOrders } = customerSlice.actions;
export default customerSlice.reducer;