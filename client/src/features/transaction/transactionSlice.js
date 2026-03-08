// // // features/transaction/transactionSlice.js
// // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import showToast from '../../utils/toast';
// // import * as transactionApi from './transactionApi';

// // const initialState = {
// //   // Separate states for different views
// //   allTransactions: [],        // For overview (both income & expense)
// //   incomeTransactions: [],     // For income page
// //   expenseTransactions: [],    // For expense page
// //   currentTransaction: null,
  
// //   summary: {
// //     totalIncome: 0,
// //     totalExpense: 0,
// //     netBalance: 0,
// //     handCash: {
// //       income: 0,
// //       expense: 0,
// //       balance: 0
// //     },
// //     bank: {
// //       income: 0,
// //       expense: 0,
// //       balance: 0
// //     },
// //     totalBalance: 0
// //   },
  
// //   pagination: {
// //     page: 1,
// //     limit: 20,
// //     total: 0,
// //     pages: 0
// //   },
  
// //   loading: false,
// //   error: null,
  
// //   filters: {
// //     type: '',
// //     accountType: '',
// //     category: '',
// //     startDate: '',
// //     endDate: '',
// //     page: 1,
// //     limit: 20,
// //     sortBy: 'transactionDate',
// //     sortOrder: 'desc'
// //   }
// // };

// // // ✅ Fetch ALL transactions (for overview - no type filter)
// // export const fetchAllTransactions = createAsyncThunk(
// //   'transaction/fetchAllTransactions',
// //   async (params = {}, { rejectWithValue }) => {
// //     try {
// //       const response = await transactionApi.getTransactions({ 
// //         ...params,
// //         limit: params.limit || 20 
// //       });
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
// //     }
// //   }
// // );

// // // ✅ Fetch ONLY income transactions
// // export const fetchIncomeTransactions = createAsyncThunk(
// //   'transaction/fetchIncomeTransactions',
// //   async (filters = {}, { rejectWithValue, getState }) => {
// //     try {
// //       const { transaction } = getState();
// //       const currentFilters = { 
// //         ...transaction.filters, 
// //         ...filters, 
// //         type: 'income' 
// //       };
// //       const response = await transactionApi.getTransactions(currentFilters);
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(error.response?.data?.message || 'Failed to fetch income');
// //     }
// //   }
// // );

// // // ✅ Fetch ONLY expense transactions
// // export const fetchExpenseTransactions = createAsyncThunk(
// //   'transaction/fetchExpenseTransactions',
// //   async (filters = {}, { rejectWithValue, getState }) => {
// //     try {
// //       const { transaction } = getState();
// //       const currentFilters = { 
// //         ...transaction.filters, 
// //         ...filters, 
// //         type: 'expense' 
// //       };
// //       const response = await transactionApi.getTransactions(currentFilters);
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(error.response?.data?.message || 'Failed to fetch expense');
// //     }
// //   }
// // );

// // // ✅ Fetch transaction summary
// // export const fetchTransactionSummary = createAsyncThunk(
// //   'transaction/fetchTransactionSummary',
// //   async (period = 'month', { rejectWithValue }) => {
// //     try {
// //       const response = await transactionApi.getTransactionSummary(period);
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(error.response?.data?.message);
// //     }
// //   }
// // );

// // // ✅ Create new transaction
// // export const createNewTransaction = createAsyncThunk(
// //   'transaction/createNewTransaction',
// //   async (transactionData, { rejectWithValue, dispatch }) => {
// //     try {
// //       const response = await transactionApi.createTransaction(transactionData);
// //       showToast.success(response.message);
      
// //       // Refresh all relevant data
// //       dispatch(fetchAllTransactions({ limit: 20 }));
// //       dispatch(fetchTransactionSummary());
      
// //       // Also refresh specific type if needed
// //       if (transactionData.type === 'income') {
// //         dispatch(fetchIncomeTransactions());
// //       } else if (transactionData.type === 'expense') {
// //         dispatch(fetchExpenseTransactions());
// //       }
      
// //       return response.data;
// //     } catch (error) {
// //       showToast.error(error.response?.data?.message || 'Failed to create transaction');
// //       return rejectWithValue(error.response?.data?.message);
// //     }
// //   }
// // );

// // // ✅ Delete transaction
// // export const deleteExistingTransaction = createAsyncThunk(
// //   'transaction/deleteExistingTransaction',
// //   async (id, { rejectWithValue, dispatch, getState }) => {
// //     try {
// //       const response = await transactionApi.deleteTransaction(id);
// //       showToast.success(response.message);
      
// //       // Get current type from state or fetch both
// //       const { transaction } = getState();
      
// //       // Refresh all data
// //       dispatch(fetchAllTransactions({ limit: 20 }));
// //       dispatch(fetchTransactionSummary());
      
// //       // Also refresh specific lists
// //       dispatch(fetchIncomeTransactions());
// //       dispatch(fetchExpenseTransactions());
      
// //       return id;
// //     } catch (error) {
// //       showToast.error(error.response?.data?.message || 'Failed to delete transaction');
// //       return rejectWithValue(error.response?.data?.message);
// //     }
// //   }
// // );

// // const transactionSlice = createSlice({
// //   name: 'transaction',
// //   initialState,
// //   reducers: {
// //     setFilters: (state, action) => {
// //       state.filters = { ...state.filters, ...action.payload };
// //     },
// //     resetFilters: (state) => {
// //       state.filters = initialState.filters;
// //     },
// //     clearTransactions: (state) => {
// //       state.allTransactions = [];
// //       state.incomeTransactions = [];
// //       state.expenseTransactions = [];
// //     }
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       // Fetch All Transactions
// //       .addCase(fetchAllTransactions.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetchAllTransactions.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.allTransactions = action.payload.transactions || [];
// //         state.pagination = action.payload.pagination || initialState.pagination;
// //       })
// //       .addCase(fetchAllTransactions.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //       })
      
// //       // Fetch Income Transactions
// //       .addCase(fetchIncomeTransactions.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetchIncomeTransactions.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.incomeTransactions = action.payload.transactions || [];
// //         state.pagination = action.payload.pagination || initialState.pagination;
// //       })
// //       .addCase(fetchIncomeTransactions.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //       })
      
// //       // Fetch Expense Transactions
// //       .addCase(fetchExpenseTransactions.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetchExpenseTransactions.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.expenseTransactions = action.payload.transactions || [];
// //         state.pagination = action.payload.pagination || initialState.pagination;
// //       })
// //       .addCase(fetchExpenseTransactions.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //       })
      
// //       // Create Transaction
// //       .addCase(createNewTransaction.pending, (state) => {
// //         state.loading = true;
// //       })
// //       .addCase(createNewTransaction.fulfilled, (state) => {
// //         state.loading = false;
// //       })
// //       .addCase(createNewTransaction.rejected, (state) => {
// //         state.loading = false;
// //       })
      
// //       // Delete Transaction
// //       .addCase(deleteExistingTransaction.pending, (state) => {
// //         state.loading = true;
// //       })
// //       .addCase(deleteExistingTransaction.fulfilled, (state) => {
// //         state.loading = false;
// //       })
// //       .addCase(deleteExistingTransaction.rejected, (state) => {
// //         state.loading = false;
// //       })
      
// //       // Fetch Summary
// //       .addCase(fetchTransactionSummary.pending, (state) => {
// //         state.loading = true;
// //       })
// //       .addCase(fetchTransactionSummary.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.summary = { ...state.summary, ...action.payload };
// //       })
// //       .addCase(fetchTransactionSummary.rejected, (state) => {
// //         state.loading = false;
// //       });
// //   }
// // });

// // export const { setFilters, resetFilters, clearTransactions } = transactionSlice.actions;

// // // Selectors
// // export const selectAllTransactions = (state) => state.transaction.allTransactions;
// // export const selectIncomeTransactions = (state) => state.transaction.incomeTransactions;
// // export const selectExpenseTransactions = (state) => state.transaction.expenseTransactions;
// // export const selectTransactionSummary = (state) => state.transaction.summary;
// // export const selectTransactionFilters = (state) => state.transaction.filters;
// // export const selectTransactionPagination = (state) => state.transaction.pagination;
// // export const selectTransactionLoading = (state) => state.transaction.loading;

// // export default transactionSlice.reducer;
















// // features/transaction/transactionSlice.js - UPDATED VERSION
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import showToast from '../../utils/toast';
// import * as transactionApi from './transactionApi';

// const initialState = {
//   // Separate states for different views
//   allTransactions: [],        // For overview (both income & expense)
//   incomeTransactions: [],     // For income page
//   expenseTransactions: [],    // For expense page
//   currentTransaction: null,
  
//   // 👇 NEW: Auto-income states
//   autoIncomes: [],            // List of auto-income schedules
//   currentAutoIncome: null,    // Selected auto-income for edit
//   upcomingAutoIncomes: [],    // Next 30 days auto incomes
//   autoIncomeStats: {},        // Stats for auto incomes
  
//   summary: {
//     totalIncome: 0,
//     totalExpense: 0,
//     netBalance: 0,
//     handCash: {
//       income: 0,
//       expense: 0,
//       balance: 0
//     },
//     bank: {
//       income: 0,
//       expense: 0,
//       balance: 0
//     },
//     totalBalance: 0
//   },
  
//   pagination: {
//     page: 1,
//     limit: 20,
//     total: 0,
//     pages: 0
//   },
  
//   loading: false,
//   autoIncomeLoading: false,   // 👈 NEW: Separate loading for auto-income
//   error: null,
  
//   filters: {
//     type: '',
//     accountType: '',
//     category: '',
//     startDate: '',
//     endDate: '',
//     page: 1,
//     limit: 20,
//     sortBy: 'transactionDate',
//     sortOrder: 'desc'
//   }
// };

// // ============================================
// // ✅ EXISTING TRANSACTION ACTIONS
// // ============================================

// // Fetch ALL transactions (for overview - no type filter)
// export const fetchAllTransactions = createAsyncThunk(
//   'transaction/fetchAllTransactions',
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getTransactions({ 
//         ...params,
//         limit: params.limit || 20 
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
//     }
//   }
// );

// // Fetch ONLY income transactions
// export const fetchIncomeTransactions = createAsyncThunk(
//   'transaction/fetchIncomeTransactions',
//   async (filters = {}, { rejectWithValue, getState }) => {
//     try {
//       const { transaction } = getState();
//       const currentFilters = { 
//         ...transaction.filters, 
//         ...filters, 
//         type: 'income' 
//       };
//       const response = await transactionApi.getTransactions(currentFilters);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch income');
//     }
//   }
// );

// // Fetch ONLY expense transactions
// export const fetchExpenseTransactions = createAsyncThunk(
//   'transaction/fetchExpenseTransactions',
//   async (filters = {}, { rejectWithValue, getState }) => {
//     try {
//       const { transaction } = getState();
//       const currentFilters = { 
//         ...transaction.filters, 
//         ...filters, 
//         type: 'expense' 
//       };
//       const response = await transactionApi.getTransactions(currentFilters);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch expense');
//     }
//   }
// );

// // Fetch transaction summary
// export const fetchTransactionSummary = createAsyncThunk(
//   'transaction/fetchTransactionSummary',
//   async (period = 'month', { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getTransactionSummary(period);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// // Create new transaction
// export const createNewTransaction = createAsyncThunk(
//   'transaction/createNewTransaction',
//   async (transactionData, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await transactionApi.createTransaction(transactionData);
//       showToast.success(response.message);
      
//       // Refresh all relevant data
//       dispatch(fetchAllTransactions({ limit: 20 }));
//       dispatch(fetchTransactionSummary());
      
//       // Also refresh specific type if needed
//       if (transactionData.type === 'income') {
//         dispatch(fetchIncomeTransactions());
//       } else if (transactionData.type === 'expense') {
//         dispatch(fetchExpenseTransactions());
//       }
      
//       return response.data;
//     } catch (error) {
//       showToast.error(error.response?.data?.message || 'Failed to create transaction');
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// // Delete transaction
// export const deleteExistingTransaction = createAsyncThunk(
//   'transaction/deleteExistingTransaction',
//   async (id, { rejectWithValue, dispatch, getState }) => {
//     try {
//       const response = await transactionApi.deleteTransaction(id);
//       showToast.success(response.message);
      
//       // Get current type from state or fetch both
//       const { transaction } = getState();
      
//       // Refresh all data
//       dispatch(fetchAllTransactions({ limit: 20 }));
//       dispatch(fetchTransactionSummary());
      
//       // Also refresh specific lists
//       dispatch(fetchIncomeTransactions());
//       dispatch(fetchExpenseTransactions());
      
//       return id;
//     } catch (error) {
//       showToast.error(error.response?.data?.message || 'Failed to delete transaction');
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// // ============================================
// // ✅ NEW: AUTO-INCOME ACTIONS
// // ============================================

// // Fetch all auto incomes
// export const fetchAutoIncomes = createAsyncThunk(
//   'transaction/fetchAutoIncomes',
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getAutoIncomes(params);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch auto incomes');
//     }
//   }
// );

// // Setup new auto income
// export const setupNewAutoIncome = createAsyncThunk(
//   'transaction/setupNewAutoIncome',
//   async (autoIncomeData, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await transactionApi.setupAutoIncome(autoIncomeData);
//       showToast.success('Auto income setup successfully');
      
//       // Refresh auto incomes list
//       dispatch(fetchAutoIncomes());
      
//       return response.data;
//     } catch (error) {
//       showToast.error(error.response?.data?.message || 'Failed to setup auto income');
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// // Update auto income
// export const updateAutoIncome = createAsyncThunk(
//   'transaction/updateAutoIncome',
//   async ({ id, data }, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await transactionApi.updateAutoIncome(id, data);
//       showToast.success('Auto income updated successfully');
      
//       // Refresh auto incomes list
//       dispatch(fetchAutoIncomes());
      
//       return response.data;
//     } catch (error) {
//       showToast.error(error.response?.data?.message || 'Failed to update auto income');
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// // Delete auto income
// export const deleteAutoIncome = createAsyncThunk(
//   'transaction/deleteAutoIncome',
//   async (id, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await transactionApi.deleteAutoIncome(id);
//       showToast.success('Auto income deleted successfully');
      
//       // Refresh auto incomes list
//       dispatch(fetchAutoIncomes());
      
//       return id;
//     } catch (error) {
//       showToast.error(error.response?.data?.message || 'Failed to delete auto income');
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// // Pause auto income
// export const pauseAutoIncome = createAsyncThunk(
//   'transaction/pauseAutoIncome',
//   async (id, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await transactionApi.pauseAutoIncome(id);
//       showToast.success('Auto income paused successfully');
      
//       // Refresh auto incomes list
//       dispatch(fetchAutoIncomes());
      
//       return response.data;
//     } catch (error) {
//       showToast.error(error.response?.data?.message || 'Failed to pause auto income');
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// // Resume auto income
// export const resumeAutoIncome = createAsyncThunk(
//   'transaction/resumeAutoIncome',
//   async (id, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await transactionApi.resumeAutoIncome(id);
//       showToast.success('Auto income resumed successfully');
      
//       // Refresh auto incomes list
//       dispatch(fetchAutoIncomes());
      
//       return response.data;
//     } catch (error) {
//       showToast.error(error.response?.data?.message || 'Failed to resume auto income');
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// // Get upcoming auto incomes
// export const fetchUpcomingAutoIncomes = createAsyncThunk(
//   'transaction/fetchUpcomingAutoIncomes',
//   async (days = 30, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getUpcomingAutoIncomes(days);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch upcoming incomes');
//     }
//   }
// );

// // Get auto income stats
// export const fetchAutoIncomeStats = createAsyncThunk(
//   'transaction/fetchAutoIncomeStats',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getAutoIncomeStats();
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch auto income stats');
//     }
//   }
// );

// // ============================================
// // ✅ NEW: TRANSACTION DETAIL ACTIONS
// // ============================================

// // Fetch transaction by ID
// export const fetchTransactionById = createAsyncThunk(
//   'transaction/fetchTransactionById',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getTransactionById(id);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch transaction');
//     }
//   }
// );

// // Fetch transactions by order
// export const fetchTransactionsByOrder = createAsyncThunk(
//   'transaction/fetchTransactionsByOrder',
//   async (orderId, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getTransactionsByOrder(orderId);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch order transactions');
//     }
//   }
// );

// // Fetch transactions by customer
// export const fetchTransactionsByCustomer = createAsyncThunk(
//   'transaction/fetchTransactionsByCustomer',
//   async ({ customerId, params }, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getTransactionsByCustomer(customerId, params);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer transactions');
//     }
//   }
// );

// // Export transactions
// export const exportTransactions = createAsyncThunk(
//   'transaction/exportTransactions',
//   async (filters = {}, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.exportTransactions(filters);
//       showToast.success('Transactions exported successfully');
//       return response.data;
//     } catch (error) {
//       showToast.error(error.response?.data?.message || 'Failed to export transactions');
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// const transactionSlice = createSlice({
//   name: 'transaction',
//   initialState,
//   reducers: {
//     setFilters: (state, action) => {
//       state.filters = { ...state.filters, ...action.payload };
//     },
//     resetFilters: (state) => {
//       state.filters = initialState.filters;
//     },
//     clearTransactions: (state) => {
//       state.allTransactions = [];
//       state.incomeTransactions = [];
//       state.expenseTransactions = [];
//     },
//     // 👇 NEW: Clear auto incomes
//     clearAutoIncomes: (state) => {
//       state.autoIncomes = [];
//       state.upcomingAutoIncomes = [];
//     },
//     // 👇 NEW: Set current auto income
//     setCurrentAutoIncome: (state, action) => {
//       state.currentAutoIncome = action.payload;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // ============================================
//       // EXISTING REDUCERS
//       // ============================================
      
//       // Fetch All Transactions
//       .addCase(fetchAllTransactions.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllTransactions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.allTransactions = action.payload.transactions || [];
//         state.pagination = action.payload.pagination || initialState.pagination;
//       })
//       .addCase(fetchAllTransactions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Fetch Income Transactions
//       .addCase(fetchIncomeTransactions.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchIncomeTransactions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.incomeTransactions = action.payload.transactions || [];
//         state.pagination = action.payload.pagination || initialState.pagination;
//       })
//       .addCase(fetchIncomeTransactions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Fetch Expense Transactions
//       .addCase(fetchExpenseTransactions.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchExpenseTransactions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.expenseTransactions = action.payload.transactions || [];
//         state.pagination = action.payload.pagination || initialState.pagination;
//       })
//       .addCase(fetchExpenseTransactions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Create Transaction
//       .addCase(createNewTransaction.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createNewTransaction.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(createNewTransaction.rejected, (state) => {
//         state.loading = false;
//       })
      
//       // Delete Transaction
//       .addCase(deleteExistingTransaction.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(deleteExistingTransaction.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(deleteExistingTransaction.rejected, (state) => {
//         state.loading = false;
//       })
      
//       // Fetch Summary
//       .addCase(fetchTransactionSummary.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchTransactionSummary.fulfilled, (state, action) => {
//         state.loading = false;
//         state.summary = { ...state.summary, ...action.payload };
//       })
//       .addCase(fetchTransactionSummary.rejected, (state) => {
//         state.loading = false;
//       })
      
//       // ============================================
//       // NEW: AUTO-INCOME REDUCERS
//       // ============================================
      
//       // Fetch Auto Incomes
//       .addCase(fetchAutoIncomes.pending, (state) => {
//         state.autoIncomeLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchAutoIncomes.fulfilled, (state, action) => {
//         state.autoIncomeLoading = false;
//         state.autoIncomes = action.payload.autoIncomes || [];
//       })
//       .addCase(fetchAutoIncomes.rejected, (state, action) => {
//         state.autoIncomeLoading = false;
//         state.error = action.payload;
//       })
      
//       // Setup Auto Income
//       .addCase(setupNewAutoIncome.pending, (state) => {
//         state.autoIncomeLoading = true;
//       })
//       .addCase(setupNewAutoIncome.fulfilled, (state) => {
//         state.autoIncomeLoading = false;
//       })
//       .addCase(setupNewAutoIncome.rejected, (state) => {
//         state.autoIncomeLoading = false;
//       })
      
//       // Update Auto Income
//       .addCase(updateAutoIncome.pending, (state) => {
//         state.autoIncomeLoading = true;
//       })
//       .addCase(updateAutoIncome.fulfilled, (state) => {
//         state.autoIncomeLoading = false;
//       })
//       .addCase(updateAutoIncome.rejected, (state) => {
//         state.autoIncomeLoading = false;
//       })
      
//       // Delete Auto Income
//       .addCase(deleteAutoIncome.pending, (state) => {
//         state.autoIncomeLoading = true;
//       })
//       .addCase(deleteAutoIncome.fulfilled, (state) => {
//         state.autoIncomeLoading = false;
//       })
//       .addCase(deleteAutoIncome.rejected, (state) => {
//         state.autoIncomeLoading = false;
//       })
      
//       // Pause Auto Income
//       .addCase(pauseAutoIncome.pending, (state) => {
//         state.autoIncomeLoading = true;
//       })
//       .addCase(pauseAutoIncome.fulfilled, (state) => {
//         state.autoIncomeLoading = false;
//       })
//       .addCase(pauseAutoIncome.rejected, (state) => {
//         state.autoIncomeLoading = false;
//       })
      
//       // Resume Auto Income
//       .addCase(resumeAutoIncome.pending, (state) => {
//         state.autoIncomeLoading = true;
//       })
//       .addCase(resumeAutoIncome.fulfilled, (state) => {
//         state.autoIncomeLoading = false;
//       })
//       .addCase(resumeAutoIncome.rejected, (state) => {
//         state.autoIncomeLoading = false;
//       })
      
//       // Fetch Upcoming Auto Incomes
//       .addCase(fetchUpcomingAutoIncomes.pending, (state) => {
//         state.autoIncomeLoading = true;
//       })
//       .addCase(fetchUpcomingAutoIncomes.fulfilled, (state, action) => {
//         state.autoIncomeLoading = false;
//         state.upcomingAutoIncomes = action.payload.upcoming || [];
//       })
//       .addCase(fetchUpcomingAutoIncomes.rejected, (state) => {
//         state.autoIncomeLoading = false;
//       })
      
//       // Fetch Auto Income Stats
//       .addCase(fetchAutoIncomeStats.pending, (state) => {
//         state.autoIncomeLoading = true;
//       })
//       .addCase(fetchAutoIncomeStats.fulfilled, (state, action) => {
//         state.autoIncomeLoading = false;
//         state.autoIncomeStats = action.payload;
//       })
//       .addCase(fetchAutoIncomeStats.rejected, (state) => {
//         state.autoIncomeLoading = false;
//       })
      
//       // ============================================
//       // NEW: TRANSACTION DETAIL REDUCERS
//       // ============================================
      
//       // Fetch Transaction By ID
//       .addCase(fetchTransactionById.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchTransactionById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentTransaction = action.payload;
//       })
//       .addCase(fetchTransactionById.rejected, (state) => {
//         state.loading = false;
//       })
      
//       // Fetch Transactions By Order
//       .addCase(fetchTransactionsByOrder.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchTransactionsByOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         // Store in allTransactions for now
//         state.allTransactions = action.payload.transactions || [];
//       })
//       .addCase(fetchTransactionsByOrder.rejected, (state) => {
//         state.loading = false;
//       });
//   }
// });

// export const { 
//   setFilters, 
//   resetFilters, 
//   clearTransactions,
//   clearAutoIncomes,
//   setCurrentAutoIncome
// } = transactionSlice.actions;

// // ============================================
// // SELECTORS
// // ============================================

// // Existing selectors
// export const selectAllTransactions = (state) => state.transaction.allTransactions;
// export const selectIncomeTransactions = (state) => state.transaction.incomeTransactions;
// export const selectExpenseTransactions = (state) => state.transaction.expenseTransactions;
// export const selectTransactionSummary = (state) => state.transaction.summary;
// export const selectTransactionFilters = (state) => state.transaction.filters;
// export const selectTransactionPagination = (state) => state.transaction.pagination;
// export const selectTransactionLoading = (state) => state.transaction.loading;
// export const selectCurrentTransaction = (state) => state.transaction.currentTransaction;

// // 👇 NEW: Auto-income selectors
// export const selectAutoIncomes = (state) => state.transaction.autoIncomes;
// export const selectCurrentAutoIncome = (state) => state.transaction.currentAutoIncome;
// export const selectUpcomingAutoIncomes = (state) => state.transaction.upcomingAutoIncomes;
// export const selectAutoIncomeStats = (state) => state.transaction.autoIncomeStats;
// export const selectAutoIncomeLoading = (state) => state.transaction.autoIncomeLoading;

// export default transactionSlice.reducer;







// // features/transaction/transactionSlice.js - COMPLETE FIXED VERSION
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import showToast from '../../utils/toast';
// import * as transactionApi from './transactionApi';

// const initialState = {
//   // Separate states for different views
//   allTransactions: [],        // For overview (both income & expense)
//   incomeTransactions: [],     // For income page
//   expenseTransactions: [],    // For expense page
//   currentTransaction: null,
  
//   // 👇 NEW: Today's transactions for dashboard
//   todayTransactions: {
//     transactions: [],
//     summary: {
//       totalIncome: 0,
//       totalExpense: 0,
//       netAmount: 0,
//       count: 0,
//       handCash: { income: 0, expense: 0, balance: 0 },
//       bank: { income: 0, expense: 0, balance: 0 }
//     },
//     loading: false
//   },
  
//   // Auto-income states
//   autoIncomes: [],            // List of auto-income schedules
//   currentAutoIncome: null,    // Selected auto-income for edit
//   upcomingAutoIncomes: [],    // Next 30 days auto incomes
//   autoIncomeStats: {},        // Stats for auto incomes
  
//   summary: {
//     totalIncome: 0,
//     totalExpense: 0,
//     netBalance: 0,
//     handCash: {
//       income: 0,
//       expense: 0,
//       balance: 0
//     },
//     bank: {
//       income: 0,
//       expense: 0,
//       balance: 0
//     },
//     totalBalance: 0
//   },
  
//   pagination: {
//     page: 1,
//     limit: 20,
//     total: 0,
//     pages: 0
//   },
  
//   loading: false,
//   autoIncomeLoading: false,
//   error: null,
  
//   filters: {
//     type: '',
//     accountType: '',
//     category: '',
//     startDate: '',
//     endDate: '',
//     page: 1,
//     limit: 20,
//     sortBy: 'transactionDate',
//     sortOrder: 'desc'
//   }
// };

// // ============================================
// // ✅ EXISTING TRANSACTION ACTIONS
// // ============================================

// // Fetch ALL transactions (for overview - no type filter)
// export const fetchAllTransactions = createAsyncThunk(
//   'transaction/fetchAllTransactions',
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getTransactions({ 
//         ...params,
//         limit: params.limit || 20 
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
//     }
//   }
// );

// // Fetch ONLY income transactions
// export const fetchIncomeTransactions = createAsyncThunk(
//   'transaction/fetchIncomeTransactions',
//   async (filters = {}, { rejectWithValue, getState }) => {
//     try {
//       const { transaction } = getState();
//       const currentFilters = { 
//         ...transaction.filters, 
//         ...filters, 
//         type: 'income' 
//       };
//       const response = await transactionApi.getTransactions(currentFilters);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch income');
//     }
//   }
// );

// // Fetch ONLY expense transactions
// export const fetchExpenseTransactions = createAsyncThunk(
//   'transaction/fetchExpenseTransactions',
//   async (filters = {}, { rejectWithValue, getState }) => {
//     try {
//       const { transaction } = getState();
//       const currentFilters = { 
//         ...transaction.filters, 
//         ...filters, 
//         type: 'expense' 
//       };
//       const response = await transactionApi.getTransactions(currentFilters);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch expense');
//     }
//   }
// );

// // Fetch transaction summary
// export const fetchTransactionSummary = createAsyncThunk(
//   'transaction/fetchTransactionSummary',
//   async (period = 'month', { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getTransactionSummary(period);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// // ✅ NEW: Fetch today's transactions for dashboard
// export const fetchTodayTransactions = createAsyncThunk(
//   'transaction/fetchTodayTransactions',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getTodayTransactions();
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch today\'s transactions');
//     }
//   }
// );

// // Create new transaction
// export const createNewTransaction = createAsyncThunk(
//   'transaction/createNewTransaction',
//   async (transactionData, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await transactionApi.createTransaction(transactionData);
//       showToast.success(response.message);
      
//       // Refresh all relevant data
//       dispatch(fetchAllTransactions({ limit: 20 }));
//       dispatch(fetchTransactionSummary());
//       dispatch(fetchTodayTransactions()); // ✅ Refresh today's transactions
      
//       // Also refresh specific type if needed
//       if (transactionData.type === 'income') {
//         dispatch(fetchIncomeTransactions());
//       } else if (transactionData.type === 'expense') {
//         dispatch(fetchExpenseTransactions());
//       }
      
//       return response.data;
//     } catch (error) {
//       showToast.error(error.response?.data?.message || 'Failed to create transaction');
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// // Delete transaction
// export const deleteExistingTransaction = createAsyncThunk(
//   'transaction/deleteExistingTransaction',
//   async (id, { rejectWithValue, dispatch, getState }) => {
//     try {
//       const response = await transactionApi.deleteTransaction(id);
//       showToast.success(response.message);
      
//       // Get current type from state or fetch both
//       const { transaction } = getState();
      
//       // Refresh all data
//       dispatch(fetchAllTransactions({ limit: 20 }));
//       dispatch(fetchTransactionSummary());
//       dispatch(fetchTodayTransactions()); // ✅ Refresh today's transactions
      
//       // Also refresh specific lists
//       dispatch(fetchIncomeTransactions());
//       dispatch(fetchExpenseTransactions());
      
//       return id;
//     } catch (error) {
//       showToast.error(error.response?.data?.message || 'Failed to delete transaction');
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// // ============================================
// // ✅ AUTO-INCOME ACTIONS
// // ============================================

// // Fetch all auto incomes
// export const fetchAutoIncomes = createAsyncThunk(
//   'transaction/fetchAutoIncomes',
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getAutoIncomes(params);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch auto incomes');
//     }
//   }
// );

// // Setup new auto income
// export const setupNewAutoIncome = createAsyncThunk(
//   'transaction/setupNewAutoIncome',
//   async (autoIncomeData, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await transactionApi.setupAutoIncome(autoIncomeData);
//       showToast.success('Auto income setup successfully');
      
//       // Refresh auto incomes list
//       dispatch(fetchAutoIncomes());
      
//       return response.data;
//     } catch (error) {
//       showToast.error(error.response?.data?.message || 'Failed to setup auto income');
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// // Update auto income
// export const updateAutoIncome = createAsyncThunk(
//   'transaction/updateAutoIncome',
//   async ({ id, data }, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await transactionApi.updateAutoIncome(id, data);
//       showToast.success('Auto income updated successfully');
      
//       // Refresh auto incomes list
//       dispatch(fetchAutoIncomes());
      
//       return response.data;
//     } catch (error) {
//       showToast.error(error.response?.data?.message || 'Failed to update auto income');
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// // Delete auto income
// export const deleteAutoIncome = createAsyncThunk(
//   'transaction/deleteAutoIncome',
//   async (id, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await transactionApi.deleteAutoIncome(id);
//       showToast.success('Auto income deleted successfully');
      
//       // Refresh auto incomes list
//       dispatch(fetchAutoIncomes());
      
//       return id;
//     } catch (error) {
//       showToast.error(error.response?.data?.message || 'Failed to delete auto income');
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// // Pause auto income
// export const pauseAutoIncome = createAsyncThunk(
//   'transaction/pauseAutoIncome',
//   async (id, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await transactionApi.pauseAutoIncome(id);
//       showToast.success('Auto income paused successfully');
      
//       // Refresh auto incomes list
//       dispatch(fetchAutoIncomes());
      
//       return response.data;
//     } catch (error) {
//       showToast.error(error.response?.data?.message || 'Failed to pause auto income');
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// // Resume auto income
// export const resumeAutoIncome = createAsyncThunk(
//   'transaction/resumeAutoIncome',
//   async (id, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await transactionApi.resumeAutoIncome(id);
//       showToast.success('Auto income resumed successfully');
      
//       // Refresh auto incomes list
//       dispatch(fetchAutoIncomes());
      
//       return response.data;
//     } catch (error) {
//       showToast.error(error.response?.data?.message || 'Failed to resume auto income');
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// // Get upcoming auto incomes
// export const fetchUpcomingAutoIncomes = createAsyncThunk(
//   'transaction/fetchUpcomingAutoIncomes',
//   async (days = 30, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getUpcomingAutoIncomes(days);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch upcoming incomes');
//     }
//   }
// );

// // Get auto income stats
// export const fetchAutoIncomeStats = createAsyncThunk(
//   'transaction/fetchAutoIncomeStats',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getAutoIncomeStats();
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch auto income stats');
//     }
//   }
// );

// // ============================================
// // ✅ TRANSACTION DETAIL ACTIONS
// // ============================================

// // Fetch transaction by ID
// export const fetchTransactionById = createAsyncThunk(
//   'transaction/fetchTransactionById',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getTransactionById(id);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch transaction');
//     }
//   }
// );

// // Fetch transactions by order
// export const fetchTransactionsByOrder = createAsyncThunk(
//   'transaction/fetchTransactionsByOrder',
//   async (orderId, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getTransactionsByOrder(orderId);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch order transactions');
//     }
//   }
// );

// // Fetch transactions by customer
// export const fetchTransactionsByCustomer = createAsyncThunk(
//   'transaction/fetchTransactionsByCustomer',
//   async ({ customerId, params }, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.getTransactionsByCustomer(customerId, params);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer transactions');
//     }
//   }
// );

// // Export transactions
// export const exportTransactions = createAsyncThunk(
//   'transaction/exportTransactions',
//   async (filters = {}, { rejectWithValue }) => {
//     try {
//       const response = await transactionApi.exportTransactions(filters);
//       showToast.success('Transactions exported successfully');
//       return response.data;
//     } catch (error) {
//       showToast.error(error.response?.data?.message || 'Failed to export transactions');
//       return rejectWithValue(error.response?.data?.message);
//     }
//   }
// );

// const transactionSlice = createSlice({
//   name: 'transaction',
//   initialState,
//   reducers: {
//     setFilters: (state, action) => {
//       state.filters = { ...state.filters, ...action.payload };
//     },
//     resetFilters: (state) => {
//       state.filters = initialState.filters;
//     },
//     clearTransactions: (state) => {
//       state.allTransactions = [];
//       state.incomeTransactions = [];
//       state.expenseTransactions = [];
//     },
//     clearAutoIncomes: (state) => {
//       state.autoIncomes = [];
//       state.upcomingAutoIncomes = [];
//     },
//     setCurrentAutoIncome: (state, action) => {
//       state.currentAutoIncome = action.payload;
//     },
//     // ✅ NEW: Clear today's transactions
//     clearTodayTransactions: (state) => {
//       state.todayTransactions = {
//         transactions: [],
//         summary: {
//           totalIncome: 0,
//           totalExpense: 0,
//           netAmount: 0,
//           count: 0,
//           handCash: { income: 0, expense: 0, balance: 0 },
//           bank: { income: 0, expense: 0, balance: 0 }
//         },
//         loading: false
//       };
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // ============================================
//       // EXISTING REDUCERS
//       // ============================================
      
//       // Fetch All Transactions
//       .addCase(fetchAllTransactions.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllTransactions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.allTransactions = action.payload.transactions || [];
//         state.pagination = action.payload.pagination || initialState.pagination;
//       })
//       .addCase(fetchAllTransactions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Fetch Income Transactions
//       .addCase(fetchIncomeTransactions.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchIncomeTransactions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.incomeTransactions = action.payload.transactions || [];
//         state.pagination = action.payload.pagination || initialState.pagination;
//       })
//       .addCase(fetchIncomeTransactions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Fetch Expense Transactions
//       .addCase(fetchExpenseTransactions.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchExpenseTransactions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.expenseTransactions = action.payload.transactions || [];
//         state.pagination = action.payload.pagination || initialState.pagination;
//       })
//       .addCase(fetchExpenseTransactions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // ✅ NEW: Fetch Today's Transactions
//       .addCase(fetchTodayTransactions.pending, (state) => {
//         state.todayTransactions.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchTodayTransactions.fulfilled, (state, action) => {
//         state.todayTransactions.loading = false;
//         state.todayTransactions.transactions = action.payload.transactions || [];
//         state.todayTransactions.summary = action.payload.summary || {
//           totalIncome: 0,
//           totalExpense: 0,
//           netAmount: 0,
//           count: 0,
//           handCash: { income: 0, expense: 0, balance: 0 },
//           bank: { income: 0, expense: 0, balance: 0 }
//         };
//       })
//       .addCase(fetchTodayTransactions.rejected, (state, action) => {
//         state.todayTransactions.loading = false;
//         state.error = action.payload;
//       })
      
//       // Create Transaction
//       .addCase(createNewTransaction.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createNewTransaction.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(createNewTransaction.rejected, (state) => {
//         state.loading = false;
//       })
      
//       // Delete Transaction
//       .addCase(deleteExistingTransaction.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(deleteExistingTransaction.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(deleteExistingTransaction.rejected, (state) => {
//         state.loading = false;
//       })
      
//       // Fetch Summary
//       .addCase(fetchTransactionSummary.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchTransactionSummary.fulfilled, (state, action) => {
//         state.loading = false;
//         state.summary = { ...state.summary, ...action.payload };
//       })
//       .addCase(fetchTransactionSummary.rejected, (state) => {
//         state.loading = false;
//       })
      
//       // ============================================
//       // AUTO-INCOME REDUCERS
//       // ============================================
      
//       // Fetch Auto Incomes
//       .addCase(fetchAutoIncomes.pending, (state) => {
//         state.autoIncomeLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchAutoIncomes.fulfilled, (state, action) => {
//         state.autoIncomeLoading = false;
//         state.autoIncomes = action.payload.autoIncomes || [];
//       })
//       .addCase(fetchAutoIncomes.rejected, (state, action) => {
//         state.autoIncomeLoading = false;
//         state.error = action.payload;
//       })
      
//       // Setup Auto Income
//       .addCase(setupNewAutoIncome.pending, (state) => {
//         state.autoIncomeLoading = true;
//       })
//       .addCase(setupNewAutoIncome.fulfilled, (state) => {
//         state.autoIncomeLoading = false;
//       })
//       .addCase(setupNewAutoIncome.rejected, (state) => {
//         state.autoIncomeLoading = false;
//       })
      
//       // Update Auto Income
//       .addCase(updateAutoIncome.pending, (state) => {
//         state.autoIncomeLoading = true;
//       })
//       .addCase(updateAutoIncome.fulfilled, (state) => {
//         state.autoIncomeLoading = false;
//       })
//       .addCase(updateAutoIncome.rejected, (state) => {
//         state.autoIncomeLoading = false;
//       })
      
//       // Delete Auto Income
//       .addCase(deleteAutoIncome.pending, (state) => {
//         state.autoIncomeLoading = true;
//       })
//       .addCase(deleteAutoIncome.fulfilled, (state) => {
//         state.autoIncomeLoading = false;
//       })
//       .addCase(deleteAutoIncome.rejected, (state) => {
//         state.autoIncomeLoading = false;
//       })
      
//       // Pause Auto Income
//       .addCase(pauseAutoIncome.pending, (state) => {
//         state.autoIncomeLoading = true;
//       })
//       .addCase(pauseAutoIncome.fulfilled, (state) => {
//         state.autoIncomeLoading = false;
//       })
//       .addCase(pauseAutoIncome.rejected, (state) => {
//         state.autoIncomeLoading = false;
//       })
      
//       // Resume Auto Income
//       .addCase(resumeAutoIncome.pending, (state) => {
//         state.autoIncomeLoading = true;
//       })
//       .addCase(resumeAutoIncome.fulfilled, (state) => {
//         state.autoIncomeLoading = false;
//       })
//       .addCase(resumeAutoIncome.rejected, (state) => {
//         state.autoIncomeLoading = false;
//       })
      
//       // Fetch Upcoming Auto Incomes
//       .addCase(fetchUpcomingAutoIncomes.pending, (state) => {
//         state.autoIncomeLoading = true;
//       })
//       .addCase(fetchUpcomingAutoIncomes.fulfilled, (state, action) => {
//         state.autoIncomeLoading = false;
//         state.upcomingAutoIncomes = action.payload.upcoming || [];
//       })
//       .addCase(fetchUpcomingAutoIncomes.rejected, (state) => {
//         state.autoIncomeLoading = false;
//       })
      
//       // Fetch Auto Income Stats
//       .addCase(fetchAutoIncomeStats.pending, (state) => {
//         state.autoIncomeLoading = true;
//       })
//       .addCase(fetchAutoIncomeStats.fulfilled, (state, action) => {
//         state.autoIncomeLoading = false;
//         state.autoIncomeStats = action.payload;
//       })
//       .addCase(fetchAutoIncomeStats.rejected, (state) => {
//         state.autoIncomeLoading = false;
//       })
      
//       // ============================================
//       // TRANSACTION DETAIL REDUCERS
//       // ============================================
      
//       // Fetch Transaction By ID
//       .addCase(fetchTransactionById.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchTransactionById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentTransaction = action.payload;
//       })
//       .addCase(fetchTransactionById.rejected, (state) => {
//         state.loading = false;
//       })
      
//       // Fetch Transactions By Order
//       .addCase(fetchTransactionsByOrder.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchTransactionsByOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.allTransactions = action.payload.transactions || [];
//       })
//       .addCase(fetchTransactionsByOrder.rejected, (state) => {
//         state.loading = false;
//       });
//   }
// });

// export const { 
//   setFilters, 
//   resetFilters, 
//   clearTransactions,
//   clearAutoIncomes,
//   setCurrentAutoIncome,
//   clearTodayTransactions // ✅ NEW
// } = transactionSlice.actions;

// // ============================================
// // SELECTORS
// // ============================================

// // Existing selectors
// export const selectAllTransactions = (state) => state.transaction.allTransactions;
// export const selectIncomeTransactions = (state) => state.transaction.incomeTransactions;
// export const selectExpenseTransactions = (state) => state.transaction.expenseTransactions;
// export const selectTransactionSummary = (state) => state.transaction.summary;
// export const selectTransactionFilters = (state) => state.transaction.filters;
// export const selectTransactionPagination = (state) => state.transaction.pagination;
// export const selectTransactionLoading = (state) => state.transaction.loading;
// export const selectCurrentTransaction = (state) => state.transaction.currentTransaction;

// // ✅ NEW: Today's transactions selectors
// export const selectTodayTransactions = (state) => state.transaction.todayTransactions.transactions;
// export const selectTodaySummary = (state) => state.transaction.todayTransactions.summary;
// export const selectTodayLoading = (state) => state.transaction.todayTransactions.loading;

// // Auto-income selectors
// export const selectAutoIncomes = (state) => state.transaction.autoIncomes;
// export const selectCurrentAutoIncome = (state) => state.transaction.currentAutoIncome;
// export const selectUpcomingAutoIncomes = (state) => state.transaction.upcomingAutoIncomes;
// export const selectAutoIncomeStats = (state) => state.transaction.autoIncomeStats;
// export const selectAutoIncomeLoading = (state) => state.transaction.autoIncomeLoading;

// export default transactionSlice.reducer;






// features/transaction/transactionSlice.js - COMPLETE FIXED VERSION WITH DAILY REVENUE
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import showToast from '../../utils/toast';
import * as transactionApi from './transactionApi';

const initialState = {
  // Separate states for different views
  allTransactions: [],        // For overview (both income & expense)
  incomeTransactions: [],     // For income page
  expenseTransactions: [],    // For expense page
  currentTransaction: null,
  
  // 👇 Today's transactions for dashboard
  todayTransactions: {
    transactions: [],
    summary: {
      totalIncome: 0,
      totalExpense: 0,
      netAmount: 0,
      count: 0,
      handCash: { income: 0, expense: 0, balance: 0 },
      bank: { income: 0, expense: 0, balance: 0 }
    },
    loading: false
  },
  
  // ✅ NEW: Daily revenue stats for charts
  dailyRevenue: {
    chartData: [],
    summary: {
      totalRevenue: 0,
      totalExpense: 0,
      netProfit: 0,
      period: 'month',
      dateRange: { start: null, end: null }
    },
    loading: false
  },
  
  // Auto-income states
  autoIncomes: [],            // List of auto-income schedules
  currentAutoIncome: null,    // Selected auto-income for edit
  upcomingAutoIncomes: [],    // Next 30 days auto incomes
  autoIncomeStats: {},        // Stats for auto incomes
  
  summary: {
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    handCash: {
      income: 0,
      expense: 0,
      balance: 0
    },
    bank: {
      income: 0,
      expense: 0,
      balance: 0
    },
    totalBalance: 0
  },
  
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },
  
  loading: false,
  autoIncomeLoading: false,
  error: null,
  
  filters: {
    type: '',
    accountType: '',
    category: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 20,
    sortBy: 'transactionDate',
    sortOrder: 'desc'
  }
};

// ============================================
// ✅ EXISTING TRANSACTION ACTIONS
// ============================================

// Fetch ALL transactions (for overview - no type filter)
export const fetchAllTransactions = createAsyncThunk(
  'transaction/fetchAllTransactions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getTransactions({ 
        ...params,
        limit: params.limit || 20 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

// Fetch ONLY income transactions
export const fetchIncomeTransactions = createAsyncThunk(
  'transaction/fetchIncomeTransactions',
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      const { transaction } = getState();
      const currentFilters = { 
        ...transaction.filters, 
        ...filters, 
        type: 'income' 
      };
      const response = await transactionApi.getTransactions(currentFilters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch income');
    }
  }
);

// Fetch ONLY expense transactions
export const fetchExpenseTransactions = createAsyncThunk(
  'transaction/fetchExpenseTransactions',
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      const { transaction } = getState();
      const currentFilters = { 
        ...transaction.filters, 
        ...filters, 
        type: 'expense' 
      };
      const response = await transactionApi.getTransactions(currentFilters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch expense');
    }
  }
);

// Fetch transaction summary
export const fetchTransactionSummary = createAsyncThunk(
  'transaction/fetchTransactionSummary',
  async (period = 'month', { rejectWithValue }) => {
    try {
      const response = await transactionApi.getTransactionSummary(period);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ✅ Fetch today's transactions for dashboard
export const fetchTodayTransactions = createAsyncThunk(
  'transaction/fetchTodayTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getTodayTransactions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch today\'s transactions');
    }
  }
);

// ✅ NEW: Fetch daily revenue stats for charts
export const fetchDailyRevenueStats = createAsyncThunk(
  'transaction/fetchDailyRevenueStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('📊 Fetching daily revenue stats with:', params);
      const response = await transactionApi.getDailyRevenueStats(params);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching daily revenue:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch daily revenue stats');
    }
  }
);

// Create new transaction
export const createNewTransaction = createAsyncThunk(
  'transaction/createNewTransaction',
  async (transactionData, { rejectWithValue, dispatch }) => {
    try {
      const response = await transactionApi.createTransaction(transactionData);
      showToast.success(response.message);
      
      // Refresh all relevant data
      dispatch(fetchAllTransactions({ limit: 20 }));
      dispatch(fetchTransactionSummary());
      dispatch(fetchTodayTransactions());
      
      // Also refresh specific type if needed
      if (transactionData.type === 'income') {
        dispatch(fetchIncomeTransactions());
      } else if (transactionData.type === 'expense') {
        dispatch(fetchExpenseTransactions());
      }
      
      return response.data;
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to create transaction');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Delete transaction
export const deleteExistingTransaction = createAsyncThunk(
  'transaction/deleteExistingTransaction',
  async (id, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await transactionApi.deleteTransaction(id);
      showToast.success(response.message);
      
      // Get current type from state or fetch both
      const { transaction } = getState();
      
      // Refresh all data
      dispatch(fetchAllTransactions({ limit: 20 }));
      dispatch(fetchTransactionSummary());
      dispatch(fetchTodayTransactions());
      
      // Also refresh specific lists
      dispatch(fetchIncomeTransactions());
      dispatch(fetchExpenseTransactions());
      
      return id;
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to delete transaction');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ============================================
// ✅ AUTO-INCOME ACTIONS
// ============================================

// Fetch all auto incomes
export const fetchAutoIncomes = createAsyncThunk(
  'transaction/fetchAutoIncomes',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getAutoIncomes(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch auto incomes');
    }
  }
);

// Setup new auto income
export const setupNewAutoIncome = createAsyncThunk(
  'transaction/setupNewAutoIncome',
  async (autoIncomeData, { rejectWithValue, dispatch }) => {
    try {
      const response = await transactionApi.setupAutoIncome(autoIncomeData);
      showToast.success('Auto income setup successfully');
      
      // Refresh auto incomes list
      dispatch(fetchAutoIncomes());
      
      return response.data;
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to setup auto income');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Update auto income
export const updateAutoIncome = createAsyncThunk(
  'transaction/updateAutoIncome',
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await transactionApi.updateAutoIncome(id, data);
      showToast.success('Auto income updated successfully');
      
      // Refresh auto incomes list
      dispatch(fetchAutoIncomes());
      
      return response.data;
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to update auto income');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Delete auto income
export const deleteAutoIncome = createAsyncThunk(
  'transaction/deleteAutoIncome',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await transactionApi.deleteAutoIncome(id);
      showToast.success('Auto income deleted successfully');
      
      // Refresh auto incomes list
      dispatch(fetchAutoIncomes());
      
      return id;
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to delete auto income');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Pause auto income
export const pauseAutoIncome = createAsyncThunk(
  'transaction/pauseAutoIncome',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await transactionApi.pauseAutoIncome(id);
      showToast.success('Auto income paused successfully');
      
      // Refresh auto incomes list
      dispatch(fetchAutoIncomes());
      
      return response.data;
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to pause auto income');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Resume auto income
export const resumeAutoIncome = createAsyncThunk(
  'transaction/resumeAutoIncome',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await transactionApi.resumeAutoIncome(id);
      showToast.success('Auto income resumed successfully');
      
      // Refresh auto incomes list
      dispatch(fetchAutoIncomes());
      
      return response.data;
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to resume auto income');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Get upcoming auto incomes
export const fetchUpcomingAutoIncomes = createAsyncThunk(
  'transaction/fetchUpcomingAutoIncomes',
  async (days = 30, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getUpcomingAutoIncomes(days);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch upcoming incomes');
    }
  }
);

// Get auto income stats
export const fetchAutoIncomeStats = createAsyncThunk(
  'transaction/fetchAutoIncomeStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getAutoIncomeStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch auto income stats');
    }
  }
);

// ============================================
// ✅ TRANSACTION DETAIL ACTIONS
// ============================================

// Fetch transaction by ID
export const fetchTransactionById = createAsyncThunk(
  'transaction/fetchTransactionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getTransactionById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transaction');
    }
  }
);

// Fetch transactions by order
export const fetchTransactionsByOrder = createAsyncThunk(
  'transaction/fetchTransactionsByOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getTransactionsByOrder(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order transactions');
    }
  }
);

// Fetch transactions by customer
export const fetchTransactionsByCustomer = createAsyncThunk(
  'transaction/fetchTransactionsByCustomer',
  async ({ customerId, params }, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getTransactionsByCustomer(customerId, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer transactions');
    }
  }
);

// Export transactions
export const exportTransactions = createAsyncThunk(
  'transaction/exportTransactions',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await transactionApi.exportTransactions(filters);
      showToast.success('Transactions exported successfully');
      return response.data;
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to export transactions');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearTransactions: (state) => {
      state.allTransactions = [];
      state.incomeTransactions = [];
      state.expenseTransactions = [];
    },
    clearAutoIncomes: (state) => {
      state.autoIncomes = [];
      state.upcomingAutoIncomes = [];
    },
    setCurrentAutoIncome: (state, action) => {
      state.currentAutoIncome = action.payload;
    },
    // ✅ Clear today's transactions
    clearTodayTransactions: (state) => {
      state.todayTransactions = {
        transactions: [],
        summary: {
          totalIncome: 0,
          totalExpense: 0,
          netAmount: 0,
          count: 0,
          handCash: { income: 0, expense: 0, balance: 0 },
          bank: { income: 0, expense: 0, balance: 0 }
        },
        loading: false
      };
    },
    // ✅ NEW: Clear daily revenue data
    clearDailyRevenue: (state) => {
      state.dailyRevenue = {
        chartData: [],
        summary: {
          totalRevenue: 0,
          totalExpense: 0,
          netProfit: 0,
          period: 'month',
          dateRange: { start: null, end: null }
        },
        loading: false
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // ============================================
      // EXISTING REDUCERS
      // ============================================
      
      // Fetch All Transactions
      .addCase(fetchAllTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.allTransactions = action.payload.transactions || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Income Transactions
      .addCase(fetchIncomeTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomeTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.incomeTransactions = action.payload.transactions || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchIncomeTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Expense Transactions
      .addCase(fetchExpenseTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseTransactions = action.payload.transactions || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchExpenseTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Today's Transactions
      .addCase(fetchTodayTransactions.pending, (state) => {
        state.todayTransactions.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayTransactions.fulfilled, (state, action) => {
        state.todayTransactions.loading = false;
        state.todayTransactions.transactions = action.payload.transactions || [];
        state.todayTransactions.summary = action.payload.summary || {
          totalIncome: 0,
          totalExpense: 0,
          netAmount: 0,
          count: 0,
          handCash: { income: 0, expense: 0, balance: 0 },
          bank: { income: 0, expense: 0, balance: 0 }
        };
      })
      .addCase(fetchTodayTransactions.rejected, (state, action) => {
        state.todayTransactions.loading = false;
        state.error = action.payload;
      })
      
      // ✅ NEW: Fetch Daily Revenue Stats
      .addCase(fetchDailyRevenueStats.pending, (state) => {
        state.dailyRevenue.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyRevenueStats.fulfilled, (state, action) => {
        state.dailyRevenue.loading = false;
        state.dailyRevenue.chartData = action.payload.chartData || [];
        state.dailyRevenue.summary = action.payload.summary || {
          totalRevenue: 0,
          totalExpense: 0,
          netProfit: 0,
          period: 'month',
          dateRange: { start: null, end: null }
        };
        console.log('✅ Daily revenue stats updated:', state.dailyRevenue);
      })
      .addCase(fetchDailyRevenueStats.rejected, (state, action) => {
        state.dailyRevenue.loading = false;
        state.error = action.payload;
        console.error('❌ Daily revenue stats rejected:', action.payload);
      })
      
      // Create Transaction
      .addCase(createNewTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewTransaction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createNewTransaction.rejected, (state) => {
        state.loading = false;
      })
      
      // Delete Transaction
      .addCase(deleteExistingTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExistingTransaction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteExistingTransaction.rejected, (state) => {
        state.loading = false;
      })
      
      // Fetch Summary
      .addCase(fetchTransactionSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactionSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = { ...state.summary, ...action.payload };
      })
      .addCase(fetchTransactionSummary.rejected, (state) => {
        state.loading = false;
      })
      
      // ============================================
      // AUTO-INCOME REDUCERS
      // ============================================
      
      // Fetch Auto Incomes
      .addCase(fetchAutoIncomes.pending, (state) => {
        state.autoIncomeLoading = true;
        state.error = null;
      })
      .addCase(fetchAutoIncomes.fulfilled, (state, action) => {
        state.autoIncomeLoading = false;
        state.autoIncomes = action.payload.autoIncomes || [];
      })
      .addCase(fetchAutoIncomes.rejected, (state, action) => {
        state.autoIncomeLoading = false;
        state.error = action.payload;
      })
      
      // Setup Auto Income
      .addCase(setupNewAutoIncome.pending, (state) => {
        state.autoIncomeLoading = true;
      })
      .addCase(setupNewAutoIncome.fulfilled, (state) => {
        state.autoIncomeLoading = false;
      })
      .addCase(setupNewAutoIncome.rejected, (state) => {
        state.autoIncomeLoading = false;
      })
      
      // Update Auto Income
      .addCase(updateAutoIncome.pending, (state) => {
        state.autoIncomeLoading = true;
      })
      .addCase(updateAutoIncome.fulfilled, (state) => {
        state.autoIncomeLoading = false;
      })
      .addCase(updateAutoIncome.rejected, (state) => {
        state.autoIncomeLoading = false;
      })
      
      // Delete Auto Income
      .addCase(deleteAutoIncome.pending, (state) => {
        state.autoIncomeLoading = true;
      })
      .addCase(deleteAutoIncome.fulfilled, (state) => {
        state.autoIncomeLoading = false;
      })
      .addCase(deleteAutoIncome.rejected, (state) => {
        state.autoIncomeLoading = false;
      })
      
      // Pause Auto Income
      .addCase(pauseAutoIncome.pending, (state) => {
        state.autoIncomeLoading = true;
      })
      .addCase(pauseAutoIncome.fulfilled, (state) => {
        state.autoIncomeLoading = false;
      })
      .addCase(pauseAutoIncome.rejected, (state) => {
        state.autoIncomeLoading = false;
      })
      
      // Resume Auto Income
      .addCase(resumeAutoIncome.pending, (state) => {
        state.autoIncomeLoading = true;
      })
      .addCase(resumeAutoIncome.fulfilled, (state) => {
        state.autoIncomeLoading = false;
      })
      .addCase(resumeAutoIncome.rejected, (state) => {
        state.autoIncomeLoading = false;
      })
      
      // Fetch Upcoming Auto Incomes
      .addCase(fetchUpcomingAutoIncomes.pending, (state) => {
        state.autoIncomeLoading = true;
      })
      .addCase(fetchUpcomingAutoIncomes.fulfilled, (state, action) => {
        state.autoIncomeLoading = false;
        state.upcomingAutoIncomes = action.payload.upcoming || [];
      })
      .addCase(fetchUpcomingAutoIncomes.rejected, (state) => {
        state.autoIncomeLoading = false;
      })
      
      // Fetch Auto Income Stats
      .addCase(fetchAutoIncomeStats.pending, (state) => {
        state.autoIncomeLoading = true;
      })
      .addCase(fetchAutoIncomeStats.fulfilled, (state, action) => {
        state.autoIncomeLoading = false;
        state.autoIncomeStats = action.payload;
      })
      .addCase(fetchAutoIncomeStats.rejected, (state) => {
        state.autoIncomeLoading = false;
      })
      
      // ============================================
      // TRANSACTION DETAIL REDUCERS
      // ============================================
      
      // Fetch Transaction By ID
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state) => {
        state.loading = false;
      })
      
      // Fetch Transactions By Order
      .addCase(fetchTransactionsByOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactionsByOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.allTransactions = action.payload.transactions || [];
      })
      .addCase(fetchTransactionsByOrder.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { 
  setFilters, 
  resetFilters, 
  clearTransactions,
  clearAutoIncomes,
  setCurrentAutoIncome,
  clearTodayTransactions,
  clearDailyRevenue // ✅ NEW
} = transactionSlice.actions;

// ============================================
// SELECTORS
// ============================================

// Existing selectors
export const selectAllTransactions = (state) => state.transaction.allTransactions;
export const selectIncomeTransactions = (state) => state.transaction.incomeTransactions;
export const selectExpenseTransactions = (state) => state.transaction.expenseTransactions;
export const selectTransactionSummary = (state) => state.transaction.summary;
export const selectTransactionFilters = (state) => state.transaction.filters;
export const selectTransactionPagination = (state) => state.transaction.pagination;
export const selectTransactionLoading = (state) => state.transaction.loading;
export const selectCurrentTransaction = (state) => state.transaction.currentTransaction;

// Today's transactions selectors
export const selectTodayTransactions = (state) => state.transaction.todayTransactions.transactions;
export const selectTodaySummary = (state) => state.transaction.todayTransactions.summary;
export const selectTodayLoading = (state) => state.transaction.todayTransactions.loading;

// ✅ NEW: Daily revenue selectors
export const selectDailyRevenueData = (state) => state.transaction.dailyRevenue.chartData;
export const selectDailyRevenueSummary = (state) => state.transaction.dailyRevenue.summary;
export const selectDailyRevenueLoading = (state) => state.transaction.dailyRevenue.loading;

// Auto-income selectors
export const selectAutoIncomes = (state) => state.transaction.autoIncomes;
export const selectCurrentAutoIncome = (state) => state.transaction.currentAutoIncome;
export const selectUpcomingAutoIncomes = (state) => state.transaction.upcomingAutoIncomes;
export const selectAutoIncomeStats = (state) => state.transaction.autoIncomeStats;
export const selectAutoIncomeLoading = (state) => state.transaction.autoIncomeLoading;

export default transactionSlice.reducer;