// // src/features/cuttingMaster/cuttingMasterSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import * as cuttingMasterApi from "./cuttingMasterApi";

// // ===== ASYNC THUNKS =====
// export const fetchAllCuttingMasters = createAsyncThunk(
//   "cuttingMaster/fetchAll",
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const response = await cuttingMasterApi.getAllCuttingMastersApi(params);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch cutting masters");
//     }
//   }
// );

// export const fetchCuttingMasterById = createAsyncThunk(
//   "cuttingMaster/fetchById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await cuttingMasterApi.getCuttingMasterByIdApi(id);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch cutting master");
//     }
//   }
// );

// export const createCuttingMaster = createAsyncThunk(
//   "cuttingMaster/create",
//   async (cuttingMasterData, { rejectWithValue }) => {
//     try {
//       const response = await cuttingMasterApi.createCuttingMasterApi(cuttingMasterData);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to create cutting master");
//     }
//   }
// );

// export const updateCuttingMaster = createAsyncThunk(
//   "cuttingMaster/update",
//   async ({ id, cuttingMasterData }, { rejectWithValue }) => {
//     try {
//       const response = await cuttingMasterApi.updateCuttingMasterApi(id, cuttingMasterData);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to update cutting master");
//     }
//   }
// );

// export const deleteCuttingMaster = createAsyncThunk(
//   "cuttingMaster/delete",
//   async (id, { rejectWithValue }) => {
//     try {
//       await cuttingMasterApi.deleteCuttingMasterApi(id);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to delete cutting master");
//     }
//   }
// );

// export const fetchCuttingMasterStats = createAsyncThunk(
//   "cuttingMaster/fetchStats",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await cuttingMasterApi.getCuttingMasterStatsApi();
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
//     }
//   }
// );

// const cuttingMasterSlice = createSlice({
//   name: "cuttingMaster",
//   initialState: {
//     cuttingMasters: [],
//     currentCuttingMaster: null,
//     works: [],
//     workStats: {},
//     stats: {},
//     loading: false,
//     error: null,
//     pagination: {
//       page: 1,
//       limit: 10,
//       total: 0,
//       pages: 1
//     }
//   },
//   reducers: {
//     clearCurrentCuttingMaster: (state) => {
//       state.currentCuttingMaster = null;
//       state.works = [];
//       state.workStats = {};
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//     setPage: (state, action) => {
//       state.pagination.page = action.payload;
//     },
//     setLimit: (state, action) => {
//       state.pagination.limit = action.payload;
//       state.pagination.page = 1;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // ===== FETCH ALL =====
//       .addCase(fetchAllCuttingMasters.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllCuttingMasters.fulfilled, (state, action) => {
//         state.loading = false;
//         if (Array.isArray(action.payload)) {
//           state.cuttingMasters = action.payload;
//         } else {
//           state.cuttingMasters = action.payload.cuttingMasters || action.payload;
//           state.pagination = { ...state.pagination, ...(action.payload.pagination || {}) };
//         }
//       })
//       .addCase(fetchAllCuttingMasters.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== FETCH BY ID =====
//       .addCase(fetchCuttingMasterById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCuttingMasterById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentCuttingMaster = action.payload.cuttingMaster;
//         state.works = action.payload.works || [];
//         state.workStats = action.payload.workStats || {};
//       })
//       .addCase(fetchCuttingMasterById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== CREATE =====
//       .addCase(createCuttingMaster.fulfilled, (state, action) => {
//         state.cuttingMasters = [action.payload.cuttingMaster, ...state.cuttingMasters];
//       })

//       // ===== UPDATE =====
//       .addCase(updateCuttingMaster.fulfilled, (state, action) => {
//         const updated = action.payload.cuttingMaster;
//         const index = state.cuttingMasters.findIndex(c => c._id === updated._id);
//         if (index !== -1) state.cuttingMasters[index] = updated;
//         if (state.currentCuttingMaster?._id === updated._id) {
//           state.currentCuttingMaster = updated;
//         }
//       })

//       // ===== DELETE =====
//       .addCase(deleteCuttingMaster.fulfilled, (state, action) => {
//         state.cuttingMasters = state.cuttingMasters.filter(c => c._id !== action.payload);
//         if (state.currentCuttingMaster?._id === action.payload) {
//           state.currentCuttingMaster = null;
//           state.works = [];
//           state.workStats = {};
//         }
//       })

//       // ===== FETCH STATS =====
//       .addCase(fetchCuttingMasterStats.fulfilled, (state, action) => {
//         state.stats = action.payload.cuttingMasterStats || {};
//       });
//   }
// });

// export const { clearCurrentCuttingMaster, clearError, setPage, setLimit } = cuttingMasterSlice.actions;
// export default cuttingMasterSlice.reducer;

















// src/features/cuttingMaster/cuttingMasterSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cuttingMasterApi from "./cuttingMasterApi";

// ===== ASYNC THUNKS =====

// 📋 CRUD Operations
export const fetchAllCuttingMasters = createAsyncThunk(
  "cuttingMaster/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.getAllCuttingMastersApi(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cutting masters");
    }
  }
);

export const fetchCuttingMasterById = createAsyncThunk(
  "cuttingMaster/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.getCuttingMasterByIdApi(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cutting master");
    }
  }
);

export const createCuttingMaster = createAsyncThunk(
  "cuttingMaster/create",
  async (cuttingMasterData, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.createCuttingMasterApi(cuttingMasterData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create cutting master");
    }
  }
);

export const updateCuttingMaster = createAsyncThunk(
  "cuttingMaster/update",
  async ({ id, cuttingMasterData }, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.updateCuttingMasterApi(id, cuttingMasterData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update cutting master");
    }
  }
);

export const deleteCuttingMaster = createAsyncThunk(
  "cuttingMaster/delete",
  async (id, { rejectWithValue }) => {
    try {
      await cuttingMasterApi.deleteCuttingMasterApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete cutting master");
    }
  }
);

export const fetchCuttingMasterStats = createAsyncThunk(
  "cuttingMaster/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.getCuttingMasterStatsApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

// ============================================
// 📊 DASHBOARD API THUNKS
// ============================================

/**
 * 📊 1. Fetch Dashboard Stats (KPI Cards)
 * GET /api/cutting-masters/dashboard/stats
 */
export const fetchDashboardStats = createAsyncThunk(
  "cuttingMaster/dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.getDashboardStatsApi();
      return response.data; // { totalWork, completedWork, inProgressWork, overdueWork, pendingWork }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard stats");
    }
  }
);

/**
 * 📈 2. Fetch Work Status Breakdown (Pie Chart)
 * GET /api/cutting-masters/dashboard/work-status
 */
export const fetchWorkStatusBreakdown = createAsyncThunk(
  "cuttingMaster/dashboard/fetchWorkStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.getWorkStatusBreakdownApi();
      return response.data; // Array of { name, value, status, color }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch work status");
    }
  }
);

/**
 * 👥 3. Fetch Tailor Performance
 * GET /api/cutting-masters/dashboard/tailor-performance
 */
export const fetchTailorPerformance = createAsyncThunk(
  "cuttingMaster/dashboard/fetchTailorPerformance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.getTailorPerformanceApi();
      return response.data; // { tailors, count }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tailor performance");
    }
  }
);

/**
 * 🟢 4. Fetch Available Tailors
 * GET /api/cutting-masters/dashboard/available-tailors
 */
export const fetchAvailableTailors = createAsyncThunk(
  "cuttingMaster/dashboard/fetchAvailableTailors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.getAvailableTailorsApi();
      return response.data; // { summary, availableTailors, count }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch available tailors");
    }
  }
);

/**
 * 📋 5. Fetch Work Queue
 * GET /api/cutting-masters/dashboard/work-queue
 * @param {Object} params - { status, search, date, page, limit }
 */
export const fetchWorkQueue = createAsyncThunk(
  "cuttingMaster/dashboard/fetchWorkQueue",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.getWorkQueueApi(params);
      return response.data; // { works, total, page, limit, totalPages, counts }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch work queue");
    }
  }
);

/**
 * ✅ 6. Update Work Status
 * PUT /api/cutting-masters/dashboard/update-status/:workId
 * @param {Object} data - { workId, status, notes }
 */
export const updateWorkStatus = createAsyncThunk(
  "cuttingMaster/dashboard/updateWorkStatus",
  async ({ workId, status, notes }, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.updateWorkStatusApi(workId, { status, notes });
      return response.data; // Updated work
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update work status");
    }
  }
);

/**
 * 📅 7. Fetch Today's Summary
 * GET /api/cutting-masters/dashboard/today-summary
 */
export const fetchTodaySummary = createAsyncThunk(
  "cuttingMaster/dashboard/fetchTodaySummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.getTodaySummaryApi();
      return response.data; // { dueToday, highPriority, completedToday }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch today summary");
    }
  }
);

/**
 * 🔴 8. Fetch High Priority Works
 * GET /api/cutting-masters/dashboard/high-priority
 */
export const fetchHighPriorityWorks = createAsyncThunk(
  "cuttingMaster/dashboard/fetchHighPriority",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.getHighPriorityWorksApi();
      return response.data; // { works, count }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch high priority works");
    }
  }
);

/**
 * ⚠️ 9. Fetch Overdue Works
 * GET /api/cutting-masters/dashboard/overdue-works
 */
export const fetchOverdueWorks = createAsyncThunk(
  "cuttingMaster/dashboard/fetchOverdueWorks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.getOverdueWorksApi();
      return response.data; // { works, count }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch overdue works");
    }
  }
);

/**
 * 📅 10. Fetch Monthly Schedule (Calendar)
 * GET /api/cutting-masters/dashboard/schedule
 * @param {Object} params - { year, month }
 */
export const fetchMonthlySchedule = createAsyncThunk(
  "cuttingMaster/dashboard/fetchSchedule",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.getMonthlyScheduleApi({ year, month });
      return response.data; // Schedule object with dates as keys
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch schedule");
    }
  }
);

/**
 * 📅 11. Fetch Works by Date
 * GET /api/cutting-masters/dashboard/works-by-date
 * @param {string} date - Date string YYYY-MM-DD
 */
export const fetchWorksByDate = createAsyncThunk(
  "cuttingMaster/dashboard/fetchWorksByDate",
  async (date, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.getWorksByDateApi(date);
      return response.data; // { total, completed, pending, works }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch works by date");
    }
  }
);

/**
 * 🚀 12. Fetch Complete Dashboard Summary
 * GET /api/cutting-masters/dashboard/summary
 */
export const fetchDashboardSummary = createAsyncThunk(
  "cuttingMaster/dashboard/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cuttingMasterApi.getDashboardSummaryApi();
      return response.data; // Complete dashboard data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard summary");
    }
  }
);

// ============================================
// 📊 INITIAL STATE
// ============================================
const initialState = {
  // CRUD Data
  cuttingMasters: [],
  currentCuttingMaster: null,
  works: [],
  workStats: {},
  stats: {},
  
  // Dashboard Data
  dashboardStats: {
    totalWork: 0,
    completedWork: 0,
    inProgressWork: 0,
    overdueWork: 0,
    pendingWork: 0
  },
  statusBreakdown: [],
  tailorPerformance: {
    tailors: [],
    count: 0
  },
  availableTailors: {
    summary: {
      total: 0,
      available: 0,
      onLeave: 0,
      availabilityRate: 0
    },
    availableTailors: [],
    count: 0
  },
  workQueue: {
    works: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
    counts: {}
  },
  todaySummary: {
    dueToday: 0,
    highPriority: 0,
    completedToday: 0
  },
  highPriorityWorks: {
    works: [],
    count: 0
  },
  overdueWorks: {
    works: [],
    count: 0
  },
  monthlySchedule: {},
  dateWiseWorks: {
    total: 0,
    completed: 0,
    pending: 0,
    works: []
  },
  dashboardSummary: null,

  // UI State
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  }
};

// ============================================
// 📊 SLICE
// ============================================
const cuttingMasterSlice = createSlice({
  name: "cuttingMaster",
  initialState,
  reducers: {
    clearCurrentCuttingMaster: (state) => {
      state.currentCuttingMaster = null;
      state.works = [];
      state.workStats = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
    clearDashboardData: (state) => {
      // Reset dashboard data when needed
      state.dashboardStats = initialState.dashboardStats;
      state.statusBreakdown = [];
      state.tailorPerformance = initialState.tailorPerformance;
      state.availableTailors = initialState.availableTailors;
      state.workQueue = initialState.workQueue;
      state.todaySummary = initialState.todaySummary;
      state.highPriorityWorks = initialState.highPriorityWorks;
      state.overdueWorks = initialState.overdueWorks;
      state.monthlySchedule = {};
      state.dateWiseWorks = initialState.dateWiseWorks;
    },
    resetWorkQueueFilters: (state) => {
      state.workQueue = {
        ...initialState.workQueue,
        works: state.workQueue.works // Preserve works if any
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // ===== FETCH ALL CUTTING MASTERS =====
      .addCase(fetchAllCuttingMasters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCuttingMasters.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.cuttingMasters = action.payload;
        } else {
          state.cuttingMasters = action.payload.cuttingMasters || action.payload;
          state.pagination = { ...state.pagination, ...(action.payload.pagination || {}) };
        }
      })
      .addCase(fetchAllCuttingMasters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== FETCH BY ID =====
      .addCase(fetchCuttingMasterById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCuttingMasterById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCuttingMaster = action.payload.cuttingMaster;
        state.works = action.payload.works || [];
        state.workStats = action.payload.workStats || {};
      })
      .addCase(fetchCuttingMasterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== CREATE =====
      .addCase(createCuttingMaster.fulfilled, (state, action) => {
        state.cuttingMasters = [action.payload.cuttingMaster, ...state.cuttingMasters];
      })

      // ===== UPDATE =====
      .addCase(updateCuttingMaster.fulfilled, (state, action) => {
        const updated = action.payload.cuttingMaster;
        const index = state.cuttingMasters.findIndex(c => c._id === updated._id);
        if (index !== -1) state.cuttingMasters[index] = updated;
        if (state.currentCuttingMaster?._id === updated._id) {
          state.currentCuttingMaster = updated;
        }
      })

      // ===== DELETE =====
      .addCase(deleteCuttingMaster.fulfilled, (state, action) => {
        state.cuttingMasters = state.cuttingMasters.filter(c => c._id !== action.payload);
        if (state.currentCuttingMaster?._id === action.payload) {
          state.currentCuttingMaster = null;
          state.works = [];
          state.workStats = {};
        }
      })

      // ===== FETCH STATS =====
      .addCase(fetchCuttingMasterStats.fulfilled, (state, action) => {
        state.stats = action.payload.cuttingMasterStats || {};
      })

      // ============================================
      // 📊 DASHBOARD REDUCERS
      // ============================================

      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Work Status Breakdown
      .addCase(fetchWorkStatusBreakdown.fulfilled, (state, action) => {
        state.statusBreakdown = action.payload;
      })

      // Tailor Performance
      .addCase(fetchTailorPerformance.fulfilled, (state, action) => {
        state.tailorPerformance = action.payload;
      })

      // Available Tailors
      .addCase(fetchAvailableTailors.fulfilled, (state, action) => {
        state.availableTailors = action.payload;
      })

      // Work Queue
      .addCase(fetchWorkQueue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkQueue.fulfilled, (state, action) => {
        state.loading = false;
        state.workQueue = {
          ...state.workQueue,
          ...action.payload
        };
      })
      .addCase(fetchWorkQueue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Work Status
      .addCase(updateWorkStatus.fulfilled, (state, action) => {
        const updatedWork = action.payload;
        // Update in workQueue if present
        const index = state.workQueue.works.findIndex(w => w._id === updatedWork._id);
        if (index !== -1) {
          state.workQueue.works[index] = {
            ...state.workQueue.works[index],
            status: updatedWork.status,
            ...updatedWork
          };
        }
        // Update in highPriorityWorks if present
        const highPriorityIndex = state.highPriorityWorks.works.findIndex(w => w._id === updatedWork._id);
        if (highPriorityIndex !== -1) {
          state.highPriorityWorks.works[highPriorityIndex] = {
            ...state.highPriorityWorks.works[highPriorityIndex],
            status: updatedWork.status
          };
        }
        // Update in overdueWorks if present
        const overdueIndex = state.overdueWorks.works.findIndex(w => w._id === updatedWork._id);
        if (overdueIndex !== -1) {
          state.overdueWorks.works[overdueIndex] = {
            ...state.overdueWorks.works[overdueIndex],
            status: updatedWork.status
          };
        }
      })

      // Today Summary
      .addCase(fetchTodaySummary.fulfilled, (state, action) => {
        state.todaySummary = action.payload;
      })

      // High Priority Works
      .addCase(fetchHighPriorityWorks.fulfilled, (state, action) => {
        state.highPriorityWorks = action.payload;
      })

      // Overdue Works
      .addCase(fetchOverdueWorks.fulfilled, (state, action) => {
        state.overdueWorks = action.payload;
      })

      // Monthly Schedule
      .addCase(fetchMonthlySchedule.fulfilled, (state, action) => {
        state.monthlySchedule = action.payload;
      })

      // Works by Date
      .addCase(fetchWorksByDate.fulfilled, (state, action) => {
        state.dateWiseWorks = action.payload;
      })

      // Dashboard Summary
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardSummary = action.payload;
        
        // Also update individual slices for backward compatibility
        if (action.payload.stats) state.dashboardStats = action.payload.stats;
        if (action.payload.statusBreakdown) state.statusBreakdown = action.payload.statusBreakdown;
        if (action.payload.tailorPerformance) state.tailorPerformance = action.payload.tailorPerformance;
        if (action.payload.availableTailors) state.availableTailors = action.payload.availableTailors;
        if (action.payload.workQueue) state.workQueue = action.payload.workQueue;
        if (action.payload.todaySummary) state.todaySummary = action.payload.todaySummary;
        if (action.payload.highPriority) state.highPriorityWorks = action.payload.highPriority;
        if (action.payload.overdueWorks) state.overdueWorks = action.payload.overdueWorks;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// ============================================
// 📊 SELECTORS
// ============================================

// CRUD Selectors
export const selectAllCuttingMasters = (state) => state.cuttingMaster.cuttingMasters;
export const selectCurrentCuttingMaster = (state) => state.cuttingMaster.currentCuttingMaster;
export const selectCuttingMasterWorks = (state) => state.cuttingMaster.works;
export const selectCuttingMasterWorkStats = (state) => state.cuttingMaster.workStats;
export const selectCuttingMasterStats = (state) => state.cuttingMaster.stats;

// Dashboard Selectors
export const selectDashboardStats = (state) => state.cuttingMaster.dashboardStats;
export const selectStatusBreakdown = (state) => state.cuttingMaster.statusBreakdown;
export const selectTailorPerformance = (state) => state.cuttingMaster.tailorPerformance;
export const selectAvailableTailors = (state) => state.cuttingMaster.availableTailors;
export const selectWorkQueue = (state) => state.cuttingMaster.workQueue;
export const selectTodaySummary = (state) => state.cuttingMaster.todaySummary;
export const selectHighPriorityWorks = (state) => state.cuttingMaster.highPriorityWorks;
export const selectOverdueWorks = (state) => state.cuttingMaster.overdueWorks;
export const selectMonthlySchedule = (state) => state.cuttingMaster.monthlySchedule;
export const selectWorksByDate = (state) => state.cuttingMaster.dateWiseWorks;
export const selectDashboardSummary = (state) => state.cuttingMaster.dashboardSummary;

// UI State Selectors
export const selectCuttingMasterLoading = (state) => state.cuttingMaster.loading;
export const selectCuttingMasterError = (state) => state.cuttingMaster.error;
export const selectCuttingMasterPagination = (state) => state.cuttingMaster.pagination;

// ============================================
// 📊 ACTIONS EXPORT
// ============================================
export const { 
  clearCurrentCuttingMaster, 
  clearError, 
  setPage, 
  setLimit,
  clearDashboardData,
  resetWorkQueueFilters
} = cuttingMasterSlice.actions;

export default cuttingMasterSlice.reducer;