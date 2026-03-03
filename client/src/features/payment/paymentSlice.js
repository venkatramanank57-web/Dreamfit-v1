// features/payment/paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentAPI from "./paymentapi";
import showToast from "../../utils/toast";

// Initial state
const initialState = {
  payments: [],
  currentPayment: null,
  paymentStats: {
    today: { total: 0, count: 0 },
    byMethod: [],
    byType: [],
    summary: { totalAmount: 0, totalCount: 0 }
  },
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  }
};

// ==================== ASYNC THUNKS ====================

// Get payment statistics
export const fetchPaymentStats = createAsyncThunk(
  "payment/fetchStats",
  async (params, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getPaymentStats(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch stats");
    }
  }
);

// Get all payments for an order
export const fetchOrderPayments = createAsyncThunk(
  "payment/fetchOrderPayments",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getOrderPayments(orderId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch payments");
    }
  }
);

// Get single payment
export const fetchPayment = createAsyncThunk(
  "payment/fetchPayment",
  async (id, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getPayment(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch payment");
    }
  }
);

// Create new payment
export const createPayment = createAsyncThunk(
  "payment/createPayment",
  async (paymentData, { rejectWithValue, dispatch }) => {
    try {
      const response = await paymentAPI.createPayment(paymentData);
      showToast.success("Payment added successfully");
      
      // Refresh data based on context
      if (paymentData.order) {
        dispatch(fetchOrderPayments(paymentData.order));
      }
      
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to create payment";
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Update payment
export const updatePayment = createAsyncThunk(
  "payment/updatePayment",
  async ({ id, data }, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await paymentAPI.updatePayment(id, data);
      showToast.success("Payment updated successfully");
      
      // Refresh data
      const state = getState();
      const currentPayment = state.payment.currentPayment;
      
      if (currentPayment?.order) {
        dispatch(fetchOrderPayments(currentPayment.order));
      }
      
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to update payment";
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Delete payment
export const deletePayment = createAsyncThunk(
  "payment/deletePayment",
  async (id, { rejectWithValue, dispatch, getState }) => {
    try {
      await paymentAPI.deletePayment(id);
      showToast.success("Payment deleted successfully");
      
      // Refresh data
      const state = getState();
      const currentPayment = state.payment.currentPayment;
      
      if (currentPayment?.order) {
        dispatch(fetchOrderPayments(currentPayment.order));
      }
      
      return id;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to delete payment";
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ==================== SLICE ====================
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPayments: (state) => {
      state.payments = [];
      state.currentPayment = null;
    },
    clearPaymentStats: (state) => {
      state.paymentStats = initialState.paymentStats;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPayment: (state, action) => {
      state.currentPayment = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchPaymentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStats = action.payload;
      })
      .addCase(fetchPaymentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Order Payments
      .addCase(fetchOrderPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchOrderPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Payment
      .addCase(fetchPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(fetchPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Payment
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        // Don't modify payments array here - will be refreshed by fetch
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Payment
      .addCase(updatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentPayment?._id === action.payload._id) {
          state.currentPayment = action.payload;
        }
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Payment
      .addCase(deletePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentPayment?._id === action.payload) {
          state.currentPayment = null;
        }
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// ==================== SELECTORS ====================
export const selectPayments = (state) => state.payment.payments;
export const selectCurrentPayment = (state) => state.payment.currentPayment;
export const selectPaymentStats = (state) => state.payment.paymentStats;
export const selectPaymentLoading = (state) => state.payment.loading;
export const selectPaymentError = (state) => state.payment.error;

// ==================== ACTIONS ====================
export const { 
  clearPayments, 
  clearPaymentStats, 
  clearError,
  setCurrentPayment 
} = paymentSlice.actions;

export default paymentSlice.reducer;