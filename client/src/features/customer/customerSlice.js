// // frontend/src/features/customer/customerSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   createCustomerApi,
//   getAllCustomersApi,
//   getCustomersWithPaymentsApi,
//   getCustomerByIdApi,
//   searchCustomerByPhoneApi,
//   searchCustomerByCustomerIdApi,
//   updateCustomerApi,
//   deleteCustomerApi,
//   getCustomerPaymentsApi,
//   getCustomerOrdersApi,
//   getCustomerPaymentStatsApi,
//   getCustomerStatsApi
// } from "./customerApi";
// import showToast from "../../utils/toast";

// // ==================== INITIAL STATE ====================
// const initialState = {
//   customers: [],
//   currentCustomer: null,
//   customerPayments: [],
//   customerOrders: [],
//   paymentStats: null,
//   loading: false,
//   error: null,
//   searchResults: [],
//   stats: null
// };

// // ==================== ASYNC THUNKS ====================

// // 🆕 Create Customer
// export const createNewCustomer = createAsyncThunk(
//   "customer/create",
//   async (customerData, { rejectWithValue }) => {
//     try {
//       const response = await createCustomerApi(customerData);
//       showToast.success("✅ Customer created successfully!");
//       return response.customer;
//     } catch (error) {
//       showToast.error(error.message || "Failed to create customer");
//       return rejectWithValue(error.message || "Failed to create customer");
//     }
//   }
// );

// // 📋 Get All Customers
// export const fetchAllCustomers = createAsyncThunk(
//   "customer/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getAllCustomersApi();
//       return response.customers || response;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch customers");
//     }
//   }
// );

// // 📋 Get Customers with Payments
// export const fetchCustomersWithPayments = createAsyncThunk(
//   "customer/fetchWithPayments",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getCustomersWithPaymentsApi();
//       return response.customers || response;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch customers with payments");
//     }
//   }
// );

// // 🔍 Get Customer by ID
// export const fetchCustomerById = createAsyncThunk(
//   "customer/fetchById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await getCustomerByIdApi(id);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch customer");
//     }
//   }
// );

// // 🔍 Search Customer by Phone
// export const searchCustomerByPhone = createAsyncThunk(
//   "customer/searchByPhone",
//   async (phone, { rejectWithValue }) => {
//     try {
//       const response = await searchCustomerByPhoneApi(phone);
//       return response.customer;
//     } catch (error) {
//       return rejectWithValue(error.message || "Customer not found");
//     }
//   }
// );

// // 🔍 Search Customer by Customer ID
// export const searchCustomerByCustomerId = createAsyncThunk(
//   "customer/searchById",
//   async (customerId, { rejectWithValue }) => {
//     try {
//       const response = await searchCustomerByCustomerIdApi(customerId);
//       return response.customer;
//     } catch (error) {
//       return rejectWithValue(error.message || "Customer not found");
//     }
//   }
// );

// // ✏️ Update Customer
// export const updateCustomer = createAsyncThunk(
//   "customer/update",
//   async ({ id, customerData }, { rejectWithValue }) => {
//     try {
//       const response = await updateCustomerApi(id, customerData);
//       showToast.success("✅ Customer updated successfully!");
//       return response.customer;
//     } catch (error) {
//       showToast.error(error.message || "Failed to update customer");
//       return rejectWithValue(error.message || "Failed to update customer");
//     }
//   }
// );

// // 🗑️ Delete Customer
// export const deleteCustomer = createAsyncThunk(
//   "customer/delete",
//   async (id, { rejectWithValue }) => {
//     try {
//       await deleteCustomerApi(id);
//       showToast.success("✅ Customer deleted successfully!");
//       return id;
//     } catch (error) {
//       showToast.error(error.message || "Failed to delete customer");
//       return rejectWithValue(error.message || "Failed to delete customer");
//     }
//   }
// );

// // 💰 Get Customer Payments
// export const fetchCustomerPayments = createAsyncThunk(
//   "customer/fetchPayments",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await getCustomerPaymentsApi(id);
//       return response.payments;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch payments");
//     }
//   }
// );

// // 📦 Get Customer Orders
// export const fetchCustomerOrders = createAsyncThunk(
//   "customer/fetchOrders",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await getCustomerOrdersApi(id);
//       return response.orders;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch orders");
//     }
//   }
// );

// // 📊 Get Customer Payment Stats
// export const fetchCustomerPaymentStats = createAsyncThunk(
//   "customer/fetchPaymentStats",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await getCustomerPaymentStatsApi(id);
//       return response.stats;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch payment stats");
//     }
//   }
// );

// // 📊 Get Overall Customer Stats
// export const fetchCustomerStats = createAsyncThunk(
//   "customer/fetchStats",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getCustomerStatsApi();
//       return response.stats;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch stats");
//     }
//   }
// );

// // ==================== SLICE ====================
// const customerSlice = createSlice({
//   name: "customer",
//   initialState,
//   reducers: {
//     clearCustomerState: (state) => {
//       state.customers = [];
//       state.currentCustomer = null;
//       state.customerPayments = [];
//       state.customerOrders = [];
//       state.paymentStats = null;
//       state.error = null;
//       state.searchResults = [];
//     },
//     clearCurrentCustomer: (state) => {
//       state.currentCustomer = null;
//       state.customerPayments = [];
//       state.customerOrders = [];
//       state.paymentStats = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // ===== CREATE CUSTOMER =====
//       .addCase(createNewCustomer.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createNewCustomer.fulfilled, (state, action) => {
//         state.loading = false;
//         state.customers = [action.payload, ...state.customers];
//         state.currentCustomer = action.payload;
//       })
//       .addCase(createNewCustomer.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== GET ALL CUSTOMERS =====
//       .addCase(fetchAllCustomers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllCustomers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.customers = action.payload;
//       })
//       .addCase(fetchAllCustomers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== GET CUSTOMERS WITH PAYMENTS =====
//       .addCase(fetchCustomersWithPayments.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCustomersWithPayments.fulfilled, (state, action) => {
//         state.loading = false;
//         state.customers = action.payload;
//       })
//       .addCase(fetchCustomersWithPayments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== GET CUSTOMER BY ID =====
//       .addCase(fetchCustomerById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCustomerById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentCustomer = action.payload.customer;
//         state.customerPayments = action.payload.payments || [];
//         state.customerOrders = action.payload.orders || [];
//         state.paymentStats = action.payload.paymentSummary || null;
//       })
//       .addCase(fetchCustomerById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== SEARCH BY PHONE =====
//       .addCase(searchCustomerByPhone.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(searchCustomerByPhone.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentCustomer = action.payload;
//         state.searchResults = [action.payload];
//       })
//       .addCase(searchCustomerByPhone.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.currentCustomer = null;
//         state.searchResults = [];
//       })

//       // ===== SEARCH BY CUSTOMER ID =====
//       .addCase(searchCustomerByCustomerId.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(searchCustomerByCustomerId.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentCustomer = action.payload;
//         state.searchResults = [action.payload];
//       })
//       .addCase(searchCustomerByCustomerId.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.currentCustomer = null;
//         state.searchResults = [];
//       })

//       // ===== UPDATE CUSTOMER =====
//       .addCase(updateCustomer.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateCustomer.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentCustomer = action.payload;
//         state.customers = state.customers.map(c => 
//           c._id === action.payload._id ? action.payload : c
//         );
//       })
//       .addCase(updateCustomer.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== DELETE CUSTOMER =====
//       .addCase(deleteCustomer.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteCustomer.fulfilled, (state, action) => {
//         state.loading = false;
//         state.customers = state.customers.filter(c => c._id !== action.payload);
//         if (state.currentCustomer?._id === action.payload) {
//           state.currentCustomer = null;
//           state.customerPayments = [];
//           state.customerOrders = [];
//         }
//       })
//       .addCase(deleteCustomer.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== GET CUSTOMER PAYMENTS =====
//       .addCase(fetchCustomerPayments.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCustomerPayments.fulfilled, (state, action) => {
//         state.loading = false;
//         state.customerPayments = action.payload;
//       })
//       .addCase(fetchCustomerPayments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== GET CUSTOMER ORDERS =====
//       .addCase(fetchCustomerOrders.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
//         state.loading = false;
//         state.customerOrders = action.payload;
//       })
//       .addCase(fetchCustomerOrders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== GET PAYMENT STATS =====
//       .addCase(fetchCustomerPaymentStats.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCustomerPaymentStats.fulfilled, (state, action) => {
//         state.loading = false;
//         state.paymentStats = action.payload;
//       })
//       .addCase(fetchCustomerPaymentStats.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== GET OVERALL STATS =====
//       .addCase(fetchCustomerStats.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCustomerStats.fulfilled, (state, action) => {
//         state.loading = false;
//         state.stats = action.payload;
//       })
//       .addCase(fetchCustomerStats.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   }
// });

// // ==================== EXPORTS ====================
// export const { clearCustomerState, clearCurrentCustomer, clearError } = customerSlice.actions;
// export default customerSlice.reducer;


// frontend/src/features/customer/customerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCustomerApi,
  getAllCustomersApi,
  getCustomersWithPaymentsApi,
  getCustomerByIdApi,
  searchCustomerByPhoneApi,
  searchCustomerByCustomerIdApi,
  updateCustomerApi,
  deleteCustomerApi,
  getCustomerPaymentsApi,
  getCustomerOrdersApi,
  getCustomerPaymentStatsApi,
  getCustomerStatsApi,
  // ✅ NEW: Template API imports
  saveMeasurementTemplateApi,
  getCustomerTemplatesApi,
  getTemplateByIdApi,
  updateTemplateApi,
  deleteTemplateApi,
  useTemplateApi
} from "./customerApi";
import showToast from "../../utils/toast";

// ==================== INITIAL STATE ====================
const initialState = {
  customers: [],
  currentCustomer: null,
  customerPayments: [],
  customerOrders: [],
  paymentStats: null,
  loading: false,
  error: null,
  searchResults: [],
  stats: null,
  // ✅ NEW: Template state
  customerTemplates: [],
  currentTemplate: null,
  templatesLoading: false
};

// ==================== ASYNC THUNKS ====================

// 🆕 Create Customer
export const createNewCustomer = createAsyncThunk(
  "customer/create",
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await createCustomerApi(customerData);
      showToast.success("✅ Customer created successfully!");
      return response.customer;
    } catch (error) {
      showToast.error(error.message || "Failed to create customer");
      return rejectWithValue(error.message || "Failed to create customer");
    }
  }
);

// 📋 Get All Customers
export const fetchAllCustomers = createAsyncThunk(
  "customer/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllCustomersApi();
      return response.customers || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch customers");
    }
  }
);

// 📋 Get Customers with Payments
export const fetchCustomersWithPayments = createAsyncThunk(
  "customer/fetchWithPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCustomersWithPaymentsApi();
      return response.customers || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch customers with payments");
    }
  }
);

// 🔍 Get Customer by ID
export const fetchCustomerById = createAsyncThunk(
  "customer/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getCustomerByIdApi(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch customer");
    }
  }
);

// 🔍 Search Customer by Phone
export const searchCustomerByPhone = createAsyncThunk(
  "customer/searchByPhone",
  async (phone, { rejectWithValue }) => {
    try {
      const response = await searchCustomerByPhoneApi(phone);
      return response.customer;
    } catch (error) {
      return rejectWithValue(error.message || "Customer not found");
    }
  }
);

// 🔍 Search Customer by Customer ID
export const searchCustomerByCustomerId = createAsyncThunk(
  "customer/searchById",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await searchCustomerByCustomerIdApi(customerId);
      return response.customer;
    } catch (error) {
      return rejectWithValue(error.message || "Customer not found");
    }
  }
);

// ✏️ Update Customer
export const updateCustomer = createAsyncThunk(
  "customer/update",
  async ({ id, customerData }, { rejectWithValue }) => {
    try {
      const response = await updateCustomerApi(id, customerData);
      showToast.success("✅ Customer updated successfully!");
      return response.customer;
    } catch (error) {
      showToast.error(error.message || "Failed to update customer");
      return rejectWithValue(error.message || "Failed to update customer");
    }
  }
);

// 🗑️ Delete Customer
export const deleteCustomer = createAsyncThunk(
  "customer/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCustomerApi(id);
      showToast.success("✅ Customer deleted successfully!");
      return id;
    } catch (error) {
      showToast.error(error.message || "Failed to delete customer");
      return rejectWithValue(error.message || "Failed to delete customer");
    }
  }
);

// 💰 Get Customer Payments
export const fetchCustomerPayments = createAsyncThunk(
  "customer/fetchPayments",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getCustomerPaymentsApi(id);
      return response.payments;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch payments");
    }
  }
);

// 📦 Get Customer Orders
export const fetchCustomerOrders = createAsyncThunk(
  "customer/fetchOrders",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getCustomerOrdersApi(id);
      return response.orders;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch orders");
    }
  }
);

// 📊 Get Customer Payment Stats
export const fetchCustomerPaymentStats = createAsyncThunk(
  "customer/fetchPaymentStats",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getCustomerPaymentStatsApi(id);
      return response.stats;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch payment stats");
    }
  }
);

// 📊 Get Overall Customer Stats
export const fetchCustomerStats = createAsyncThunk(
  "customer/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCustomerStatsApi();
      return response.stats;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch stats");
    }
  }
);

// ==================== ✅ NEW: MEASUREMENT TEMPLATE THUNKS ====================

// 📏 Save Measurement Template
export const saveMeasurementTemplate = createAsyncThunk(
  "customer/saveTemplate",
  async ({ customerId, templateData }, { rejectWithValue }) => {
    try {
      const response = await saveMeasurementTemplateApi(customerId, templateData);
      showToast.success(`✅ Template "${templateData.templateName}" saved successfully!`);
      return response.template;
    } catch (error) {
      showToast.error(error.message || "Failed to save template");
      return rejectWithValue(error.message || "Failed to save template");
    }
  }
);

// 📋 Get Customer Templates
export const fetchCustomerTemplates = createAsyncThunk(
  "customer/fetchTemplates",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await getCustomerTemplatesApi(customerId);
      return response.templates;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch templates");
    }
  }
);

// 🔍 Get Template by ID
export const fetchTemplateById = createAsyncThunk(
  "customer/fetchTemplateById",
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await getTemplateByIdApi(templateId);
      return response.template;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch template");
    }
  }
);

// ✏️ Update Template
export const updateTemplate = createAsyncThunk(
  "customer/updateTemplate",
  async ({ templateId, templateData }, { rejectWithValue }) => {
    try {
      const response = await updateTemplateApi(templateId, templateData);
      showToast.success("✅ Template updated successfully!");
      return response.template;
    } catch (error) {
      showToast.error(error.message || "Failed to update template");
      return rejectWithValue(error.message || "Failed to update template");
    }
  }
);

// 🗑️ Delete Template
export const deleteTemplate = createAsyncThunk(
  "customer/deleteTemplate",
  async (templateId, { rejectWithValue }) => {
    try {
      await deleteTemplateApi(templateId);
      showToast.success("✅ Template deleted successfully!");
      return templateId;
    } catch (error) {
      showToast.error(error.message || "Failed to delete template");
      return rejectWithValue(error.message || "Failed to delete template");
    }
  }
);

// 📊 Use Template (increment usage count)
export const useTemplate = createAsyncThunk(
  "customer/useTemplate",
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await useTemplateApi(templateId);
      return response.template;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to use template");
    }
  }
);

// ==================== SLICE ====================
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    clearCustomerState: (state) => {
      state.customers = [];
      state.currentCustomer = null;
      state.customerPayments = [];
      state.customerOrders = [];
      state.paymentStats = null;
      state.error = null;
      state.searchResults = [];
      state.customerTemplates = []; // ✅ Clear templates
      state.currentTemplate = null;
    },
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
      state.customerPayments = [];
      state.customerOrders = [];
      state.paymentStats = null;
      state.customerTemplates = []; // ✅ Clear templates
      state.currentTemplate = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // ✅ New: Clear templates
    clearTemplates: (state) => {
      state.customerTemplates = [];
      state.currentTemplate = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ===== CREATE CUSTOMER =====
      .addCase(createNewCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = [action.payload, ...state.customers];
        state.currentCustomer = action.payload;
      })
      .addCase(createNewCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET ALL CUSTOMERS =====
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET CUSTOMERS WITH PAYMENTS =====
      .addCase(fetchCustomersWithPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomersWithPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomersWithPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET CUSTOMER BY ID =====
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomer = action.payload.customer;
        state.customerPayments = action.payload.payments || [];
        state.customerOrders = action.payload.orders || [];
        state.paymentStats = action.payload.paymentSummary || null;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== SEARCH BY PHONE =====
      .addCase(searchCustomerByPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCustomerByPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomer = action.payload;
        state.searchResults = [action.payload];
      })
      .addCase(searchCustomerByPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentCustomer = null;
        state.searchResults = [];
      })

      // ===== SEARCH BY CUSTOMER ID =====
      .addCase(searchCustomerByCustomerId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCustomerByCustomerId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomer = action.payload;
        state.searchResults = [action.payload];
      })
      .addCase(searchCustomerByCustomerId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentCustomer = null;
        state.searchResults = [];
      })

      // ===== UPDATE CUSTOMER =====
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomer = action.payload;
        state.customers = state.customers.map(c => 
          c._id === action.payload._id ? action.payload : c
        );
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== DELETE CUSTOMER =====
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(c => c._id !== action.payload);
        if (state.currentCustomer?._id === action.payload) {
          state.currentCustomer = null;
          state.customerPayments = [];
          state.customerOrders = [];
          state.customerTemplates = []; // ✅ Clear templates when customer deleted
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET CUSTOMER PAYMENTS =====
      .addCase(fetchCustomerPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.customerPayments = action.payload;
      })
      .addCase(fetchCustomerPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET CUSTOMER ORDERS =====
      .addCase(fetchCustomerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.customerOrders = action.payload;
      })
      .addCase(fetchCustomerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET PAYMENT STATS =====
      .addCase(fetchCustomerPaymentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerPaymentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStats = action.payload;
      })
      .addCase(fetchCustomerPaymentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET OVERALL STATS =====
      .addCase(fetchCustomerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchCustomerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== ✅ NEW: SAVE TEMPLATE =====
      .addCase(saveMeasurementTemplate.pending, (state) => {
        state.templatesLoading = true;
        state.error = null;
      })
      .addCase(saveMeasurementTemplate.fulfilled, (state, action) => {
        state.templatesLoading = false;
        state.customerTemplates = [action.payload, ...state.customerTemplates];
      })
      .addCase(saveMeasurementTemplate.rejected, (state, action) => {
        state.templatesLoading = false;
        state.error = action.payload;
      })

      // ===== ✅ NEW: GET CUSTOMER TEMPLATES =====
      .addCase(fetchCustomerTemplates.pending, (state) => {
        state.templatesLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerTemplates.fulfilled, (state, action) => {
        state.templatesLoading = false;
        state.customerTemplates = action.payload;
      })
      .addCase(fetchCustomerTemplates.rejected, (state, action) => {
        state.templatesLoading = false;
        state.error = action.payload;
      })

      // ===== ✅ NEW: GET TEMPLATE BY ID =====
      .addCase(fetchTemplateById.pending, (state) => {
        state.templatesLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.templatesLoading = false;
        state.currentTemplate = action.payload;
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.templatesLoading = false;
        state.error = action.payload;
      })

      // ===== ✅ NEW: UPDATE TEMPLATE =====
      .addCase(updateTemplate.pending, (state) => {
        state.templatesLoading = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.templatesLoading = false;
        state.customerTemplates = state.customerTemplates.map(t => 
          t._id === action.payload._id ? action.payload : t
        );
        if (state.currentTemplate?._id === action.payload._id) {
          state.currentTemplate = action.payload;
        }
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.templatesLoading = false;
        state.error = action.payload;
      })

      // ===== ✅ NEW: DELETE TEMPLATE =====
      .addCase(deleteTemplate.pending, (state) => {
        state.templatesLoading = true;
        state.error = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.templatesLoading = false;
        state.customerTemplates = state.customerTemplates.filter(t => t._id !== action.payload);
        if (state.currentTemplate?._id === action.payload) {
          state.currentTemplate = null;
        }
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.templatesLoading = false;
        state.error = action.payload;
      })

      // ===== ✅ NEW: USE TEMPLATE =====
      .addCase(useTemplate.pending, (state) => {
        // No loading state needed for this simple action
      })
      .addCase(useTemplate.fulfilled, (state, action) => {
        state.customerTemplates = state.customerTemplates.map(t => 
          t._id === action.payload._id ? action.payload : t
        );
        if (state.currentTemplate?._id === action.payload._id) {
          state.currentTemplate = action.payload;
        }
      })
      .addCase(useTemplate.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

// ==================== EXPORTS ====================
export const { 
  clearCustomerState, 
  clearCurrentCustomer, 
  clearError,
  clearTemplates  // ✅ New export
} = customerSlice.actions;

export default customerSlice.reducer;