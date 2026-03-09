// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import * as garmentApi from "./garmentApi";

// // ===== ASYNC THUNKS =====
// export const createGarment = createAsyncThunk(
//   "garment/create",
//   async ({ orderId, garmentData }, { rejectWithValue }) => {
//     try {
//       console.log(`📝 Creating garment for order: ${orderId}`);
//       const response = await garmentApi.createGarmentApi(orderId, garmentData);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to create garment");
//     }
//   }
// );

// export const fetchGarmentsByOrder = createAsyncThunk(
//   "garment/fetchByOrder",
//   async (orderId, { rejectWithValue }) => {
//     try {
//       console.log(`📡 Fetching garments for order: ${orderId}`);
//       const response = await garmentApi.getGarmentsByOrderApi(orderId);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch garments");
//     }
//   }
// );

// export const fetchGarmentById = createAsyncThunk(
//   "garment/fetchById",
//   async (id, { rejectWithValue }) => {
//     try {
//       console.log(`📡 Fetching garment by ID: ${id}`);
//       const response = await garmentApi.getGarmentByIdApi(id);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch garment");
//     }
//   }
// );

// export const updateGarment = createAsyncThunk(
//   "garment/update",
//   async ({ id, garmentData }, { rejectWithValue }) => {
//     try {
//       console.log(`📝 Updating garment: ${id}`);
//       const response = await garmentApi.updateGarmentApi(id, garmentData);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to update garment");
//     }
//   }
// );

// export const updateGarmentImages = createAsyncThunk(
//   "garment/updateImages",
//   async ({ id, imageData }, { rejectWithValue }) => {
//     try {
//       console.log(`📸 Updating garment images: ${id}`);
//       const response = await garmentApi.updateGarmentImagesApi(id, imageData);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to update images");
//     }
//   }
// );

// export const deleteGarmentImage = createAsyncThunk(
//   "garment/deleteImage",
//   async ({ id, imageKey, imageType }, { rejectWithValue }) => {
//     try {
//       console.log(`🗑️ Deleting garment image: ${imageKey}`);
//       const response = await garmentApi.deleteGarmentImageApi(id, imageKey, imageType);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to delete image");
//     }
//   }
// );

// export const deleteGarment = createAsyncThunk(
//   "garment/delete",
//   async (id, { rejectWithValue }) => {
//     try {
//       console.log(`🗑️ Deleting garment: ${id}`);
//       await garmentApi.deleteGarmentApi(id);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to delete garment");
//     }
//   }
// );

// const garmentSlice = createSlice({
//   name: "garment",
//   initialState: {
//     garments: [],
//     currentGarment: null,
//     loading: false,
//     imageLoading: false, // ✅ NEW: Specific loading for image uploads
//     error: null,
//   },
//   reducers: {
//     clearCurrentGarment: (state) => {
//       state.currentGarment = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // ===== FETCH GARMENTS BY ORDER =====
//       .addCase(fetchGarmentsByOrder.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchGarmentsByOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.garments = action.payload;
//         console.log("✅ Garments loaded:", action.payload?.length);
//       })
//       .addCase(fetchGarmentsByOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== FETCH GARMENT BY ID =====
//       .addCase(fetchGarmentById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.currentGarment = null;
//       })
//       .addCase(fetchGarmentById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentGarment = action.payload;
//         console.log("✅ Garment loaded:", action.payload?.name);
//       })
//       .addCase(fetchGarmentById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.currentGarment = null;
//       })

//       // ===== CREATE GARMENT =====
//       .addCase(createGarment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createGarment.fulfilled, (state, action) => {
//         state.loading = false;
//         const newGarment = action.payload.garment || action.payload;
//         if (newGarment && newGarment._id) {
//           state.garments = [newGarment, ...state.garments];
//           console.log("✅ Garment created:", newGarment.name);
//         }
//       })
//       .addCase(createGarment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== UPDATE GARMENT =====
//       .addCase(updateGarment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateGarment.fulfilled, (state, action) => {
//         state.loading = false;
//         const updatedGarment = action.payload.garment || action.payload;
//         if (updatedGarment && updatedGarment._id) {
//           const index = state.garments.findIndex(g => g._id === updatedGarment._id);
//           if (index !== -1) {
//             state.garments[index] = updatedGarment;
//           }
//           if (state.currentGarment?._id === updatedGarment._id) {
//             state.currentGarment = updatedGarment;
//           }
//           console.log("✅ Garment updated:", updatedGarment.name);
//         }
//       })
//       .addCase(updateGarment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===== UPDATE GARMENT IMAGES (With specific loading) =====
//       .addCase(updateGarmentImages.pending, (state) => {
//         state.imageLoading = true;
//         state.error = null;
//         console.log("📸 Image upload started...");
//       })
//       .addCase(updateGarmentImages.fulfilled, (state, action) => {
//         state.imageLoading = false;
//         const updatedGarment = action.payload.garment || action.payload;
        
//         // Update in garments list
//         const index = state.garments.findIndex(g => g._id === updatedGarment._id);
//         if (index !== -1) {
//           state.garments[index] = updatedGarment;
//         }
        
//         // Update current garment if it's the same one
//         if (state.currentGarment?._id === updatedGarment._id) {
//           state.currentGarment = updatedGarment;
//         }
        
//         console.log("📸 Images updated in Redux:", {
//           designImages: updatedGarment.designImages?.length || 0,
//           workImages: updatedGarment.workImages?.length || 0
//         });
//       })
//       .addCase(updateGarmentImages.rejected, (state, action) => {
//         state.imageLoading = false;
//         state.error = action.payload;
//         console.error("❌ Image upload failed:", action.payload);
//       })

//       // ===== DELETE GARMENT IMAGE =====
//       .addCase(deleteGarmentImage.pending, (state) => {
//         state.imageLoading = true;
//         state.error = null;
//       })
//       .addCase(deleteGarmentImage.fulfilled, (state, action) => {
//         state.imageLoading = false;
        
//         // If API returns updated garment
//         if (action.payload.garment) {
//           const updatedGarment = action.payload.garment;
//           const index = state.garments.findIndex(g => g._id === updatedGarment._id);
//           if (index !== -1) {
//             state.garments[index] = updatedGarment;
//           }
//           if (state.currentGarment?._id === updatedGarment._id) {
//             state.currentGarment = updatedGarment;
//           }
//         }
        
//         console.log("🗑️ Image removed successfully");
//       })
//       .addCase(deleteGarmentImage.rejected, (state, action) => {
//         state.imageLoading = false;
//         state.error = action.payload;
//       })

//       // ===== DELETE GARMENT =====
//       .addCase(deleteGarment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteGarment.fulfilled, (state, action) => {
//         state.loading = false;
//         const deletedId = action.payload;
//         state.garments = state.garments.filter(g => g._id !== deletedId);
//         if (state.currentGarment?._id === deletedId) {
//           state.currentGarment = null;
//         }
//         console.log("✅ Garment deleted:", deletedId);
//       })
//       .addCase(deleteGarment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearCurrentGarment, clearError } = garmentSlice.actions;
// export default garmentSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as garmentApi from "./garmentApi";

// ===== ASYNC THUNKS =====
export const createGarment = createAsyncThunk(
  "garment/create",
  async ({ orderId, garmentData }, { rejectWithValue }) => {
    try {
      console.log(`📝 Creating garment for order: ${orderId}`);
      const response = await garmentApi.createGarmentApi(orderId, garmentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create garment");
    }
  }
);

export const fetchGarmentsByOrder = createAsyncThunk(
  "garment/fetchByOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      console.log(`📡 Fetching garments for order: ${orderId}`);
      const response = await garmentApi.getGarmentsByOrderApi(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch garments");
    }
  }
);

export const fetchGarmentById = createAsyncThunk(
  "garment/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`📡 Fetching garment by ID: ${id}`);
      const response = await garmentApi.getGarmentByIdApi(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch garment");
    }
  }
);

export const updateGarment = createAsyncThunk(
  "garment/update",
  async ({ id, garmentData }, { rejectWithValue }) => {
    try {
      console.log(`📝 Updating garment: ${id}`);
      const response = await garmentApi.updateGarmentApi(id, garmentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update garment");
    }
  }
);

export const updateGarmentImages = createAsyncThunk(
  "garment/updateImages",
  async ({ id, imageData }, { rejectWithValue }) => {
    try {
      console.log(`📸 Updating garment images: ${id}`);
      const response = await garmentApi.updateGarmentImagesApi(id, imageData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update images");
    }
  }
);

export const deleteGarmentImage = createAsyncThunk(
  "garment/deleteImage",
  async ({ id, imageKey, imageType }, { rejectWithValue }) => {
    try {
      console.log(`🗑️ Deleting garment image: ${imageKey}`);
      const response = await garmentApi.deleteGarmentImageApi(id, imageKey, imageType);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete image");
    }
  }
);

export const deleteGarment = createAsyncThunk(
  "garment/delete",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`🗑️ Deleting garment: ${id}`);
      await garmentApi.deleteGarmentApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete garment");
    }
  }
);

// ============================================
// 🟢 NEW: Get customer's order dates for garment calendar
// ============================================
export const fetchCustomerOrderDates = createAsyncThunk(
  "garment/fetchCustomerOrderDates",
  async ({ customerId, month, year }, { rejectWithValue }) => {
    try {
      if (!customerId) {
        return rejectWithValue("Customer ID is required");
      }
      
      console.log(`🟢 Fetching customer order dates: ${customerId}, month: ${month}, year: ${year}`);
      
      const response = await garmentApi.getCustomerOrderDates(customerId, { month, year });
      
      return {
        dates: response.dates || [],
        customerId,
        month,
        year
      };
    } catch (error) {
      console.error('❌ fetchCustomerOrderDates error:', error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch customer order dates");
    }
  }
);

// ============================================
// 🎯 INITIAL STATE
// ============================================
const initialState = {
  garments: [],
  currentGarment: null,
  loading: false,
  imageLoading: false, // ✅ Specific loading for image uploads
  error: null,
  
  // 📅 NEW: Calendar state for garment form
  calendar: {
    customerOrderDates: [], // Dates where customer already has orders
    loading: false,
    customerId: null,
    month: null,
    year: null
  }
};

// ============================================
// 🎯 GARMENT SLICE
// ============================================
const garmentSlice = createSlice({
  name: "garment",
  initialState,
  reducers: {
    clearCurrentGarment: (state) => {
      state.currentGarment = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    
    // 📅 NEW: Calendar reducers
    clearCalendarData: (state) => {
      state.calendar = {
        customerOrderDates: [],
        loading: false,
        customerId: null,
        month: null,
        year: null
      };
    },
    setCalendarMonth: (state, action) => {
      const { customerId, month, year } = action.payload;
      state.calendar.customerId = customerId;
      state.calendar.month = month;
      state.calendar.year = year;
    }
  },
  extraReducers: (builder) => {
    builder
      // ===== FETCH GARMENTS BY ORDER =====
      .addCase(fetchGarmentsByOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGarmentsByOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.garments = action.payload;
        console.log("✅ Garments loaded:", action.payload?.length);
      })
      .addCase(fetchGarmentsByOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== FETCH GARMENT BY ID =====
      .addCase(fetchGarmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentGarment = null;
      })
      .addCase(fetchGarmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGarment = action.payload;
        console.log("✅ Garment loaded:", action.payload?.name);
      })
      .addCase(fetchGarmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentGarment = null;
      })

      // ===== CREATE GARMENT =====
      .addCase(createGarment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGarment.fulfilled, (state, action) => {
        state.loading = false;
        const newGarment = action.payload.garment || action.payload;
        if (newGarment && newGarment._id) {
          state.garments = [newGarment, ...state.garments];
          console.log("✅ Garment created:", newGarment.name);
        }
      })
      .addCase(createGarment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== UPDATE GARMENT =====
      .addCase(updateGarment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGarment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedGarment = action.payload.garment || action.payload;
        if (updatedGarment && updatedGarment._id) {
          const index = state.garments.findIndex(g => g._id === updatedGarment._id);
          if (index !== -1) {
            state.garments[index] = updatedGarment;
          }
          if (state.currentGarment?._id === updatedGarment._id) {
            state.currentGarment = updatedGarment;
          }
          console.log("✅ Garment updated:", updatedGarment.name);
        }
      })
      .addCase(updateGarment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== UPDATE GARMENT IMAGES (With specific loading) =====
      .addCase(updateGarmentImages.pending, (state) => {
        state.imageLoading = true;
        state.error = null;
        console.log("📸 Image upload started...");
      })
      .addCase(updateGarmentImages.fulfilled, (state, action) => {
        state.imageLoading = false;
        const updatedGarment = action.payload.garment || action.payload;
        
        // Update in garments list
        const index = state.garments.findIndex(g => g._id === updatedGarment._id);
        if (index !== -1) {
          state.garments[index] = updatedGarment;
        }
        
        // Update current garment if it's the same one
        if (state.currentGarment?._id === updatedGarment._id) {
          state.currentGarment = updatedGarment;
        }
        
        console.log("📸 Images updated in Redux");
      })
      .addCase(updateGarmentImages.rejected, (state, action) => {
        state.imageLoading = false;
        state.error = action.payload;
        console.error("❌ Image upload failed:", action.payload);
      })

      // ===== DELETE GARMENT IMAGE =====
      .addCase(deleteGarmentImage.pending, (state) => {
        state.imageLoading = true;
        state.error = null;
      })
      .addCase(deleteGarmentImage.fulfilled, (state, action) => {
        state.imageLoading = false;
        
        // If API returns updated garment
        if (action.payload.garment) {
          const updatedGarment = action.payload.garment;
          const index = state.garments.findIndex(g => g._id === updatedGarment._id);
          if (index !== -1) {
            state.garments[index] = updatedGarment;
          }
          if (state.currentGarment?._id === updatedGarment._id) {
            state.currentGarment = updatedGarment;
          }
        }
        
        console.log("🗑️ Image removed successfully");
      })
      .addCase(deleteGarmentImage.rejected, (state, action) => {
        state.imageLoading = false;
        state.error = action.payload;
      })

      // ===== DELETE GARMENT =====
      .addCase(deleteGarment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGarment.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.garments = state.garments.filter(g => g._id !== deletedId);
        if (state.currentGarment?._id === deletedId) {
          state.currentGarment = null;
        }
        console.log("✅ Garment deleted:", deletedId);
      })
      .addCase(deleteGarment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== 🟢 FETCH CUSTOMER ORDER DATES =====
      .addCase(fetchCustomerOrderDates.pending, (state) => {
        state.calendar.loading = true;
        state.error = null;
        console.log('⏳ fetchCustomerOrderDates pending');
      })
      .addCase(fetchCustomerOrderDates.fulfilled, (state, action) => {
        state.calendar.loading = false;
        console.log('✅ fetchCustomerOrderDates fulfilled - dates:', action.payload.dates);
        
        state.calendar.customerOrderDates = action.payload.dates || [];
        state.calendar.customerId = action.payload.customerId;
        state.calendar.month = action.payload.month;
        state.calendar.year = action.payload.year;
      })
      .addCase(fetchCustomerOrderDates.rejected, (state, action) => {
        state.calendar.loading = false;
        state.error = action.payload;
        state.calendar.customerOrderDates = [];
        console.error('❌ fetchCustomerOrderDates rejected:', action.payload);
      });
  },
});

// ============================================
// 📤 EXPORT ACTIONS
// ============================================
export const { 
  clearCurrentGarment, 
  clearError,
  // 📅 NEW: Calendar actions
  clearCalendarData,
  setCalendarMonth
} = garmentSlice.actions;

// ============================================
// 🎯 SELECTORS
// ============================================

// Helper to get garment state
const getGarmentState = (state) => {
  return state.garment || state.garments || {};
};

export const selectAllGarments = (state) => {
  const garmentState = getGarmentState(state);
  return garmentState.garments || [];
};

export const selectCurrentGarment = (state) => {
  const garmentState = getGarmentState(state);
  return garmentState.currentGarment || null;
};

export const selectGarmentLoading = (state) => {
  const garmentState = getGarmentState(state);
  return garmentState.loading || false;
};

export const selectGarmentImageLoading = (state) => {
  const garmentState = getGarmentState(state);
  return garmentState.imageLoading || false;
};

export const selectGarmentError = (state) => {
  const garmentState = getGarmentState(state);
  return garmentState.error || null;
};

// 📅 NEW: Calendar selectors
export const selectCustomerOrderDates = (state) => {
  const garmentState = getGarmentState(state);
  return garmentState.calendar?.customerOrderDates || [];
};

export const selectGarmentCalendarLoading = (state) => {
  const garmentState = getGarmentState(state);
  return garmentState.calendar?.loading || false;
};

export const selectGarmentCalendarMonth = (state) => {
  const garmentState = getGarmentState(state);
  return {
    customerId: garmentState.calendar?.customerId,
    month: garmentState.calendar?.month,
    year: garmentState.calendar?.year
  };
};

export default garmentSlice.reducer;