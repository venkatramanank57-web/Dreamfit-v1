// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import * as notificationApi from './notificationApi';
// import showToast from '../../utils/toast';

// // Initial state with proper structure
// const initialState = {
//   notifications: [],
//   unreadCount: 0,
//   loading: false,
//   error: null,
//   lastFetched: null
// };

// // Async thunks with proper error handling
// export const fetchNotifications = createAsyncThunk(
//   'notifications/fetchNotifications',
//   async (_, { rejectWithValue }) => {
//     try {
//       const result = await notificationApi.getNotifications();
//       if (result.success) {
//         return result.data;
//       } else {
//         return rejectWithValue(result.error);
//       }
//     } catch (error) {
//       return rejectWithValue(error.message || 'Failed to fetch notifications');
//     }
//   }
// );

// export const markAsRead = createAsyncThunk(
//   'notifications/markAsRead',
//   async (notificationId, { rejectWithValue, dispatch }) => {
//     try {
//       const result = await notificationApi.markNotificationAsRead(notificationId);
//       if (result.success) {
//         // Refresh notifications after marking as read
//         dispatch(fetchNotifications());
//         return { notificationId, ...result.data };
//       } else {
//         return rejectWithValue(result.error);
//       }
//     } catch (error) {
//       return rejectWithValue(error.message || 'Failed to mark as read');
//     }
//   }
// );

// export const markAllAsRead = createAsyncThunk(
//   'notifications/markAllAsRead',
//   async (_, { rejectWithValue, dispatch }) => {
//     try {
//       const result = await notificationApi.markAllNotificationsAsRead();
//       if (result.success) {
//         // Refresh notifications after marking all as read
//         dispatch(fetchNotifications());
//         return result.data;
//       } else {
//         return rejectWithValue(result.error);
//       }
//     } catch (error) {
//       return rejectWithValue(error.message || 'Failed to mark all as read');
//     }
//   }
// );

// export const deleteNotification = createAsyncThunk(
//   'notifications/deleteNotification',
//   async (notificationId, { rejectWithValue, dispatch }) => {
//     try {
//       const result = await notificationApi.deleteNotification(notificationId);
//       if (result.success) {
//         // Refresh notifications after deletion
//         dispatch(fetchNotifications());
//         return { notificationId, ...result.data };
//       } else {
//         return rejectWithValue(result.error);
//       }
//     } catch (error) {
//       return rejectWithValue(error.message || 'Failed to delete notification');
//     }
//   }
// );

// export const fetchUnreadCount = createAsyncThunk(
//   'notifications/fetchUnreadCount',
//   async (_, { rejectWithValue }) => {
//     try {
//       const result = await notificationApi.getUnreadCount();
//       if (result.success) {
//         return result.count;
//       } else {
//         return rejectWithValue(result.error);
//       }
//     } catch (error) {
//       return rejectWithValue(error.message || 'Failed to fetch unread count');
//     }
//   }
// );

// // Create the slice
// const notificationSlice = createSlice({
//   name: 'notifications',
//   initialState,
//   reducers: {
//     // Synchronous reducers
//     clearNotifications: (state) => {
//       state.notifications = [];
//       state.unreadCount = 0;
//       state.error = null;
//     },
//     addNotification: (state, action) => {
//       // Ensure notifications is an array
//       if (!Array.isArray(state.notifications)) {
//         state.notifications = [];
//       }
//       state.notifications.unshift(action.payload);
//       if (!action.payload.read) {
//         state.unreadCount = (state.unreadCount || 0) + 1;
//       }
//     },
//     updateUnreadCount: (state, action) => {
//       state.unreadCount = action.payload;
//     },
//     resetNotifications: () => initialState
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch notifications
//       .addCase(fetchNotifications.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchNotifications.fulfilled, (state, action) => {
//         state.loading = false;
//         // Ensure we're setting an array
//         state.notifications = Array.isArray(action.payload) ? action.payload : [];
//         // Calculate unread count safely
//         state.unreadCount = state.notifications.filter(n => !n?.read).length;
//         state.lastFetched = new Date().toISOString();
//       })
//       .addCase(fetchNotifications.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'Failed to fetch notifications';
//         // Don't clear notifications on error, keep existing ones
//         // But ensure notifications is still an array
//         if (!Array.isArray(state.notifications)) {
//           state.notifications = [];
//         }
//         showToast.error(state.error);
//       })
      
//       // Mark as read
//       .addCase(markAsRead.fulfilled, (state, action) => {
//         // This will be handled by the refresh, but we can optimistically update
//         if (Array.isArray(state.notifications)) {
//           const index = state.notifications.findIndex(n => n?._id === action.meta.arg);
//           if (index !== -1 && !state.notifications[index]?.read) {
//             state.notifications[index].read = true;
//             state.unreadCount = Math.max(0, (state.unreadCount || 0) - 1);
//           }
//         }
//       })
//       .addCase(markAsRead.rejected, (state, action) => {
//         showToast.error(action.payload || 'Failed to mark as read');
//       })
      
//       // Mark all as read
//       .addCase(markAllAsRead.fulfilled, (state) => {
//         // Optimistically update
//         if (Array.isArray(state.notifications)) {
//           state.notifications.forEach(n => { if (n) n.read = true; });
//           state.unreadCount = 0;
//         }
//       })
//       .addCase(markAllAsRead.rejected, (state, action) => {
//         showToast.error(action.payload || 'Failed to mark all as read');
//       })
      
//       // Delete notification
//       .addCase(deleteNotification.fulfilled, (state, action) => {
//         // Optimistically remove
//         if (Array.isArray(state.notifications)) {
//           const notification = state.notifications.find(n => n?._id === action.meta.arg);
//           if (notification && !notification.read) {
//             state.unreadCount = Math.max(0, (state.unreadCount || 0) - 1);
//           }
//           state.notifications = state.notifications.filter(n => n?._id !== action.meta.arg);
//         }
//       })
//       .addCase(deleteNotification.rejected, (state, action) => {
//         showToast.error(action.payload || 'Failed to delete notification');
//       })
      
//       // Fetch unread count
//       .addCase(fetchUnreadCount.fulfilled, (state, action) => {
//         state.unreadCount = action.payload || 0;
//       })
//       .addCase(fetchUnreadCount.rejected, (state, action) => {
//         console.error('Failed to fetch unread count:', action.payload);
//       });
//   }
// });

// // Export actions
// export const { 
//   clearNotifications, 
//   addNotification, 
//   updateUnreadCount,
//   resetNotifications 
// } = notificationSlice.actions;

// // Selectors with safety checks
// export const selectNotifications = (state) => {
//   try {
//     // Safely access notifications with fallback
//     return state?.notifications?.notifications || [];
//   } catch (error) {
//     console.error('Error in selectNotifications:', error);
//     return [];
//   }
// };

// export const selectUnreadCount = (state) => {
//   try {
//     return state?.notifications?.unreadCount || 0;
//   } catch (error) {
//     console.error('Error in selectUnreadCount:', error);
//     return 0;
//   }
// };

// export const selectNotificationsLoading = (state) => {
//   try {
//     return state?.notifications?.loading || false;
//   } catch (error) {
//     console.error('Error in selectNotificationsLoading:', error);
//     return false;
//   }
// };

// export const selectNotificationsError = (state) => {
//   try {
//     return state?.notifications?.error || null;
//   } catch (error) {
//     console.error('Error in selectNotificationsError:', error);
//     return null;
//   }
// };

// export const selectLastFetched = (state) => {
//   try {
//     return state?.notifications?.lastFetched || null;
//   } catch (error) {
//     console.error('Error in selectLastFetched:', error);
//     return null;
//   }
// };

// // Export reducer
// export default notificationSlice.reducer;



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as notificationApi from './notificationApi';
import showToast from '../../utils/toast';

// Initial state with proper structure
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  lastFetched: null
};

// Async thunks with proper error handling
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const result = await notificationApi.getNotifications();
      if (result.success) {
        return result.data;  // Backend returns { notifications: [], unreadCount: 0 }
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch notifications');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue, dispatch }) => {
    try {
      const result = await notificationApi.markNotificationAsRead(notificationId);
      if (result.success) {
        // Refresh notifications after marking as read
        dispatch(fetchNotifications());
        return { notificationId, ...result.data };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const result = await notificationApi.markAllNotificationsAsRead();
      if (result.success) {
        // Refresh notifications after marking all as read
        dispatch(fetchNotifications());
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark all as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue, dispatch }) => {
    try {
      const result = await notificationApi.deleteNotification(notificationId);
      if (result.success) {
        // Refresh notifications after deletion
        dispatch(fetchNotifications());
        return { notificationId, ...result.data };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete notification');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const result = await notificationApi.getUnreadCount();
      if (result.success) {
        return result.count;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch unread count');
    }
  }
);

// Create the slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Synchronous reducers
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.error = null;
    },
    addNotification: (state, action) => {
      // Ensure notifications is an array
      if (!Array.isArray(state.notifications)) {
        state.notifications = [];
      }
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {  // ✅ Fixed: isRead instead of read
        state.unreadCount = (state.unreadCount || 0) + 1;
      }
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    resetNotifications: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        
        // ✅ FIXED: Handle nested data structure properly
        const payload = action.payload || {};
        const notifications = payload.notifications || [];
        const unreadCount = payload.unreadCount || 0;
        
        // Ensure notifications is an array
        state.notifications = Array.isArray(notifications) ? notifications : [];
        
        // Use unreadCount from backend if available, otherwise calculate
        state.unreadCount = unreadCount > 0 ? unreadCount : 
                           state.notifications.filter(n => !n?.isRead).length;
        
        state.lastFetched = new Date().toISOString();
        
        console.log("🔍 Notifications loaded:", {
          count: state.notifications.length,
          unread: state.unreadCount,
          payload: payload
        });
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch notifications';
        // Don't clear notifications on error, keep existing ones
        // But ensure notifications is still an array
        if (!Array.isArray(state.notifications)) {
          state.notifications = [];
        }
        showToast.error(state.error);
      })
      
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        // This will be handled by the refresh, but we can optimistically update
        if (Array.isArray(state.notifications)) {
          const index = state.notifications.findIndex(n => n?._id === action.meta.arg);
          if (index !== -1 && !state.notifications[index]?.isRead) {  // ✅ Fixed: isRead
            state.notifications[index].isRead = true;  // ✅ Fixed: isRead
            state.unreadCount = Math.max(0, (state.unreadCount || 0) - 1);
          }
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        showToast.error(action.payload || 'Failed to mark as read');
      })
      
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        // Optimistically update
        if (Array.isArray(state.notifications)) {
          state.notifications.forEach(n => { if (n) n.isRead = true; });  // ✅ Fixed: isRead
          state.unreadCount = 0;
        }
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        showToast.error(action.payload || 'Failed to mark all as read');
      })
      
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        // Optimistically remove
        if (Array.isArray(state.notifications)) {
          const notification = state.notifications.find(n => n?._id === action.meta.arg);
          if (notification && !notification.isRead) {  // ✅ Fixed: isRead
            state.unreadCount = Math.max(0, (state.unreadCount || 0) - 1);
          }
          state.notifications = state.notifications.filter(n => n?._id !== action.meta.arg);
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        showToast.error(action.payload || 'Failed to delete notification');
      })
      
      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload || 0;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        console.error('Failed to fetch unread count:', action.payload);
      });
  }
});

// Export actions
export const { 
  clearNotifications, 
  addNotification, 
  updateUnreadCount,
  resetNotifications 
} = notificationSlice.actions;

// ============================================
// ✅ FIXED SELECTORS - Match your store structure
// ============================================

// Your store has 'notification' (singular), not 'notifications' (plural)
export const selectNotifications = (state) => {
  try {
    // Safely access notifications from state.notification (singular)
    return state?.notification?.notifications || [];
  } catch (error) {
    console.error('Error in selectNotifications:', error);
    return [];
  }
};

export const selectUnreadCount = (state) => {
  try {
    return state?.notification?.unreadCount || 0;
  } catch (error) {
    console.error('Error in selectUnreadCount:', error);
    return 0;
  }
};

export const selectNotificationsLoading = (state) => {
  try {
    return state?.notification?.loading || false;
  } catch (error) {
    console.error('Error in selectNotificationsLoading:', error);
    return false;
  }
};

export const selectNotificationsError = (state) => {
  try {
    return state?.notification?.error || null;
  } catch (error) {
    console.error('Error in selectNotificationsError:', error);
    return null;
  }
};

export const selectLastFetched = (state) => {
  try {
    return state?.notification?.lastFetched || null;
  } catch (error) {
    console.error('Error in selectLastFetched:', error);
    return null;
  }
};

// ✅ Add this debug selector to check state structure
export const selectNotificationState = (state) => {
  console.log("🔍 Full notification state:", state?.notification);
  return state?.notification;
};

// Export reducer
export default notificationSlice.reducer;