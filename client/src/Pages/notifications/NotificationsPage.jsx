// // Pages/notifications/NotificationsPage.jsx (simplified without pagination)
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import {
//   Bell,
//   Check,
//   RefreshCw,
//   Trash2,
//   CheckCheck,
//   Clock,
//   Scissors,
//   Briefcase,
//   CheckCircle,
//   Package,           // ✅ Added for work-available
//   AlertCircle,        // ✅ Added for errors
//   Info,               // ✅ Added for info
//   Bug                 // ✅ Added for debug
// } from 'lucide-react';
// import {
//   fetchNotifications,
//   markAsRead,
//   markAllAsRead,
//   deleteNotification,
//   fetchUnreadCount,
//   selectNotifications,
//   selectUnreadCount,
//   selectNotificationsLoading,
//   selectNotificationsError
// } from '../../features/notification/notificationSlice';
// import showToast from '../../utils/toast';

// // ============================================
// // 🔍 DEBUG COMPONENT
// // ============================================
// const DebugPanel = ({ notifications, unreadCount, loading, error, filter }) => {
//   const [showDebug, setShowDebug] = useState(false);
  
//   if (process.env.NODE_ENV !== 'development') return null;
  
//   return (
//     <div className="mb-4">
//       <button
//         onClick={() => setShowDebug(!showDebug)}
//         className="flex items-center gap-2 px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm mb-2"
//       >
//         <Bug size={14} />
//         {showDebug ? 'Hide Debug' : 'Show Debug'}
//       </button>
      
//       {showDebug && (
//         <div className="bg-gray-900 text-green-400 p-4 rounded-2xl font-mono text-sm overflow-auto max-h-96 border border-green-500/30">
//           <div className="flex justify-between items-center mb-3">
//             <span className="font-bold text-yellow-400">🔍 DEBUG INFO</span>
//             <button 
//               onClick={() => console.clear()} 
//               className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
//             >
//               Clear Console
//             </button>
//           </div>
          
//           <div className="space-y-2">
//             <div className="grid grid-cols-2 gap-1">
//               <span className="text-gray-400">Notifications:</span>
//               <span className="text-green-400">{notifications?.length || 0}</span>
              
//               <span className="text-gray-400">Unread Count:</span>
//               <span className="text-yellow-400">{unreadCount}</span>
              
//               <span className="text-gray-400">Loading:</span>
//               <span className={loading ? 'text-blue-400' : 'text-green-400'}>
//                 {loading ? 'Yes' : 'No'}
//               </span>
              
//               <span className="text-gray-400">Filter:</span>
//               <span className="text-purple-400">{filter}</span>
              
//               <span className="text-gray-400">Error:</span>
//               <span className={error ? 'text-red-400' : 'text-green-400'}>
//                 {error || 'None'}
//               </span>
//             </div>
//           </div>

//           {notifications && notifications.length > 0 && (
//             <div className="mt-3 border-t border-gray-700 pt-2">
//               <div className="font-bold text-yellow-400 mb-2">📋 Notification Types:</div>
//               <div className="space-y-1">
//                 {notifications.reduce((acc, n) => {
//                   acc[n.type] = (acc[n.type] || 0) + 1;
//                   return acc;
//                 }, {}).map((count, type) => (
//                   <div key={type} className="flex justify-between text-xs">
//                     <span className="text-gray-400">{type}:</span>
//                     <span className="text-blue-400">{count}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {error && (
//             <div className="mt-3 border-t border-red-700 pt-2">
//               <div className="font-bold text-red-400 mb-1">❌ Error Details:</div>
//               <div className="bg-red-900/50 p-2 rounded text-xs text-red-300">
//                 {error}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // ============================================
// // ✅ MAIN NOTIFICATIONS PAGE COMPONENT
// // ============================================
// export default function NotificationsPage() {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
  
//   // Get data from Redux with safety checks
//   const notifications = useSelector(selectNotifications) || [];
//   const unreadCount = useSelector(selectUnreadCount) || 0;
//   const loading = useSelector(selectNotificationsLoading) || false;
//   const error = useSelector(selectNotificationsError) || null;

//   const [filter, setFilter] = useState('all'); // all, unread, read
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [localLoading, setLocalLoading] = useState(false);

//   // Debug logs
//   console.log("📱 NotificationsPage rendered:", {
//     notificationsCount: notifications?.length,
//     unreadCount,
//     loading,
//     error,
//     filter,
//     userRole: user?.role
//   });

//   // Load notifications when filter changes
//   useEffect(() => {
//     loadNotifications();
//   }, [filter, refreshKey, dispatch]);

//   // Load unread count on mount
//   useEffect(() => {
//     dispatch(fetchUnreadCount());
//   }, [dispatch]);

//   // Poll for new notifications every 30 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       console.log("🔄 Polling for new notifications...");
//       dispatch(fetchUnreadCount());
//       dispatch(fetchNotifications({ limit: 50 }));
//     }, 30000);
    
//     return () => clearInterval(interval);
//   }, [dispatch]);

//   const loadNotifications = async () => {
//     console.log(`📥 Loading notifications with filter: ${filter}`);
//     setLocalLoading(true);
    
//     try {
//       let readFilter = '';
//       if (filter === 'unread') readFilter = 'true';
//       if (filter === 'read') readFilter = 'false';
      
//       console.log("🔍 Fetch params:", { limit: 50, unreadOnly: readFilter });
      
//       const result = await dispatch(fetchNotifications({ 
//         limit: 50,
//         unreadOnly: readFilter
//       })).unwrap();
      
//       console.log("✅ Notifications loaded:", result?.length || 0);
      
//     } catch (err) {
//       console.error("❌ Error loading notifications:", err);
//       showToast.error(err || "Failed to load notifications");
//     } finally {
//       setLocalLoading(false);
//     }
//   };

//   const handleMarkAsRead = async (id) => {
//     console.log("📌 Marking notification as read:", id);
//     try {
//       await dispatch(markAsRead(id)).unwrap();
//       showToast.success('Marked as read');
//       dispatch(fetchUnreadCount()); // Update unread count
//     } catch (error) {
//       console.error("❌ Failed to mark as read:", error);
//       showToast.error(error || 'Failed to mark as read');
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     if (unreadCount === 0) {
//       showToast.info('No unread notifications');
//       return;
//     }
    
//     console.log(`📌 Marking all ${unreadCount} notifications as read`);
    
//     if (window.confirm(`Mark all ${unreadCount} notifications as read?`)) {
//       try {
//         await dispatch(markAllAsRead()).unwrap();
//         showToast.success('All notifications marked as read');
//         dispatch(fetchUnreadCount()); // Update unread count
//       } catch (error) {
//         console.error("❌ Failed to mark all as read:", error);
//         showToast.error(error || 'Failed to mark all as read');
//       }
//     }
//   };

//   const handleDelete = async (id) => {
//     console.log("🗑️ Deleting notification:", id);
    
//     if (window.confirm('Delete this notification?')) {
//       try {
//         await dispatch(deleteNotification(id)).unwrap();
//         showToast.success('Notification deleted');
//         dispatch(fetchUnreadCount()); // Update unread count
//       } catch (error) {
//         console.error("❌ Failed to delete notification:", error);
//         showToast.error(error || 'Failed to delete notification');
//       }
//     }
//   };

//   const handleRefresh = () => {
//     console.log("🔄 Manual refresh triggered");
//     setRefreshKey(prev => prev + 1);
//     dispatch(fetchUnreadCount());
//     showToast.success('Notifications refreshed');
//   };

//   // ✅ Updated with work-available type
//   const getNotificationIcon = (type) => {
//     switch(type) {
//       case 'work-available': 
//         return <Package className="text-purple-600" size={20} />;
//       case 'work-assigned': 
//         return <Briefcase className="text-blue-600" size={20} />;
//       case 'work-accepted': 
//         return <CheckCircle className="text-green-600" size={20} />;
//       case 'tailor-assigned': 
//         return <Scissors className="text-orange-600" size={20} />;
//       case 'order-ready':
//         return <CheckCircle className="text-green-600" size={20} />;
//       case 'order-delivered':
//         return <CheckCircle className="text-green-600" size={20} />;
//       case 'order-cancelled':
//         return <AlertCircle className="text-red-600" size={20} />;
//       default: 
//         return <Bell className="text-slate-600" size={20} />;
//     }
//   };

//   // ✅ Updated background colors
//   const getNotificationBg = (type, isRead) => {
//     if (isRead) return 'bg-white';
//     switch(type) {
//       case 'work-available': 
//         return 'bg-purple-50';
//       case 'work-assigned': 
//         return 'bg-blue-50';
//       case 'work-accepted': 
//         return 'bg-green-50';
//       case 'tailor-assigned': 
//         return 'bg-orange-50';
//       case 'order-ready':
//         return 'bg-green-50';
//       case 'order-delivered':
//         return 'bg-green-50';
//       case 'order-cancelled':
//         return 'bg-red-50';
//       default: 
//         return 'bg-slate-50';
//     }
//   };

//   // ✅ Updated navigation
//   const getNotificationLink = (notification) => {
//     const role = user?.role?.toLowerCase() || 'admin';
    
//     if (notification.reference?.workId) {
//       return `/${role}/works/${notification.reference.workId}`;
//     }
//     if (notification.reference?.orderId) {
//       return `/${role}/orders/${notification.reference.orderId}`;
//     }
//     if (notification.reference?.garmentId) {
//       return `/${role}/garments/${notification.reference.garmentId}`;
//     }
//     return '#';
//   };

//   const formatTime = (dateString) => {
//     if (!dateString) return 'Unknown';
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diff = now - date;
//       const minutes = Math.floor(diff / 60000);
//       const hours = Math.floor(diff / 3600000);
//       const days = Math.floor(diff / 86400000);

//       if (minutes < 1) return 'Just now';
//       if (minutes < 60) return `${minutes} min ago`;
//       if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
//       return `${days} day${days > 1 ? 's' : ''} ago`;
//     } catch {
//       return 'Invalid date';
//     }
//   };

//   const isLoading = loading || localLoading;

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {/* Debug Panel */}
//       <DebugPanel 
//         notifications={notifications}
//         unreadCount={unreadCount}
//         loading={isLoading}
//         error={error}
//         filter={filter}
//       />

//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-black text-slate-800 mb-2">Notifications</h1>
//             <p className="text-slate-600">Stay updated with all your activities</p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={handleRefresh}
//               disabled={isLoading}
//               className={`p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all ${
//                 isLoading ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//               title="Refresh"
//             >
//               <RefreshCw size={20} className={isLoading ? 'animate-spin text-blue-600' : 'text-slate-600'} />
//             </button>
//             {unreadCount > 0 && (
//               <button
//                 onClick={handleMarkAllAsRead}
//                 disabled={isLoading}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
//               >
//                 <CheckCheck size={18} />
//                 Mark All Read ({unreadCount})
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Filter Tabs */}
//         <div className="flex gap-2 mt-4 bg-white p-1 rounded-lg inline-flex">
//           <button
//             onClick={() => setFilter('all')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             All
//           </button>
//           <button
//             onClick={() => setFilter('unread')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'unread' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             Unread {unreadCount > 0 && `(${unreadCount})`}
//           </button>
//           <button
//             onClick={() => setFilter('read')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'read' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             Read
//           </button>
//         </div>
//       </div>

//       {/* Notifications List */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//         {isLoading ? (
//           <div className="p-12 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//             <p className="text-slate-600">Loading notifications...</p>
//           </div>
//         ) : error ? (
//           <div className="p-12 text-center">
//             <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
//             <h3 className="text-lg font-bold text-red-600 mb-2">Error Loading Notifications</h3>
//             <p className="text-slate-500 mb-4">{error}</p>
//             <button
//               onClick={handleRefresh}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Try Again
//             </button>
//           </div>
//         ) : notifications && notifications.length > 0 ? (
//           <div className="divide-y divide-slate-100">
//             {notifications.map((notification) => {
//               // Safety check for notification object
//               if (!notification) return null;
              
//               return (
//                 <div
//                   key={notification._id}
//                   className={`p-4 ${getNotificationBg(notification.type, notification.read)} hover:bg-slate-50 transition-all`}
//                 >
//                   <div className="flex items-start gap-4">
//                     {/* Icon */}
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
//                       notification.read ? 'bg-slate-100' : 'bg-white shadow-sm'
//                     }`}>
//                       {getNotificationIcon(notification.type)}
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start justify-between gap-4">
//                         <div>
//                           <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
//                             {notification.title}
//                             {notification.priority === 'high' && !notification.read && (
//                               <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
//                                 High Priority
//                               </span>
//                             )}
//                             {notification.type === 'work-available' && !notification.read && (
//                               <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
//                                 New Work
//                               </span>
//                             )}
//                           </h3>
//                           <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
//                           <div className="flex items-center gap-3 text-xs text-slate-500">
//                             <span>{formatTime(notification.createdAt)}</span>
//                             {(notification.reference?.orderId || notification.reference?.workId || notification.reference?.garmentId) && (
//                               <>
//                                 <span>•</span>
//                                 <Link
//                                   to={getNotificationLink(notification)}
//                                   className="text-blue-600 hover:text-blue-700 font-medium"
//                                   onClick={() => !notification.read && handleMarkAsRead(notification._id)}
//                                 >
//                                   View Details
//                                 </Link>
//                               </>
//                             )}
//                           </div>
//                         </div>

//                         {/* Actions */}
//                         <div className="flex items-center gap-2">
//                           {!notification.read && (
//                             <button
//                               onClick={() => handleMarkAsRead(notification._id)}
//                               className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
//                               title="Mark as read"
//                               disabled={isLoading}
//                             >
//                               <Check size={16} />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleDelete(notification._id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                             title="Delete"
//                             disabled={isLoading}
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="p-12 text-center">
//             <Bell size={48} className="text-slate-300 mx-auto mb-4" />
//             <h3 className="text-lg font-bold text-slate-800 mb-2">No notifications</h3>
//             <p className="text-slate-500">You're all caught up!</p>
//             {filter !== 'all' && (
//               <button
//                 onClick={() => setFilter('all')}
//                 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 View All Notifications
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// Pages/notifications/NotificationsPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  RefreshCw,
  Trash2,
  CheckCheck,
  Clock,
  Scissors,
  Briefcase,
  CheckCircle,
  Package,
  AlertCircle,
  Info,
  Bug,
  X,
  Eye,
  ArrowLeft,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  fetchUnreadCount,
  selectNotifications,
  selectUnreadCount,
  selectNotificationsLoading,
  selectNotificationsError
} from '../../features/notification/notificationSlice';
import showToast from '../../utils/toast';

// ============================================
// 🔍 DEBUG PANEL (Development only)
// ============================================
const DebugPanel = ({ notifications, unreadCount, loading, error, filter, pagination }) => {
  const [showDebug, setShowDebug] = useState(false);
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="mb-4">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-all"
      >
        <Bug size={14} />
        {showDebug ? 'Hide Debug Panel' : 'Show Debug Panel'}
      </button>
      
      {showDebug && (
        <div className="mt-2 bg-gray-900 text-green-400 p-4 rounded-2xl font-mono text-sm overflow-auto max-h-96 border border-green-500/30">
          <div className="flex justify-between items-center mb-3 sticky top-0 bg-gray-900 pb-2 border-b border-gray-700">
            <span className="font-bold text-yellow-400">🔍 NOTIFICATION DEBUG</span>
            <div className="flex gap-2">
              <button 
                onClick={() => window.location.reload()} 
                className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
              >
                🔄 Refresh
              </button>
              <button 
                onClick={() => console.clear()} 
                className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
              >
                🧹 Clear
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {/* State Overview */}
            <div>
              <div className="font-bold text-yellow-400 mb-2">📊 State Overview</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span className="text-gray-400">Total Notifications:</span>
                <span className="text-green-400">{notifications?.length || 0}</span>
                
                <span className="text-gray-400">Unread Count:</span>
                <span className="text-yellow-400">{unreadCount}</span>
                
                <span className="text-gray-400">Loading:</span>
                <span className={loading ? 'text-blue-400' : 'text-green-400'}>
                  {loading ? 'Yes' : 'No'}
                </span>
                
                <span className="text-gray-400">Filter:</span>
                <span className="text-purple-400">{filter}</span>
                
                <span className="text-gray-400">Error:</span>
                <span className={error ? 'text-red-400' : 'text-green-400'}>
                  {error || 'None'}
                </span>
                
                <span className="text-gray-400">Page:</span>
                <span className="text-blue-400">{pagination?.page || 1}/{pagination?.pages || 1}</span>
              </div>
            </div>

            {/* Notification Types */}
            {notifications && notifications.length > 0 && (
              <div className="border-t border-gray-700 pt-2">
                <div className="font-bold text-yellow-400 mb-2">📋 Notification Types</div>
                <div className="space-y-1">
                  {Object.entries(
                    notifications.reduce((acc, n) => {
                      acc[n.type] = (acc[n.type] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-xs">
                      <span className="text-gray-400">{type}:</span>
                      <span className="text-blue-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Notifications */}
            {notifications && notifications.length > 0 && (
              <div className="border-t border-gray-700 pt-2">
                <div className="font-bold text-yellow-400 mb-2">📨 Recent (First 3)</div>
                {notifications.slice(0, 3).map((n, i) => (
                  <div key={i} className="bg-gray-800 p-2 rounded mb-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-green-400">{n.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Read:</span>
                      <span className={n.read ? 'text-green-400' : 'text-yellow-400'}>
                        {n.read ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="text-gray-400 truncate">{n.title}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Error Details */}
            {error && (
              <div className="border-t border-red-700 pt-2">
                <div className="font-bold text-red-400 mb-1">❌ Error</div>
                <div className="bg-red-900/50 p-2 rounded text-xs text-red-300 break-words">
                  {error}
                </div>
              </div>
            )}
          </div>

          <div className="text-[10px] text-gray-500 mt-4 text-center border-t border-gray-700 pt-2">
            Last Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// 🎨 NOTIFICATION ICON COMPONENT
// ============================================
const NotificationIcon = ({ type, isRead }) => {
  const getIcon = () => {
    const iconProps = { size: 20, className: isRead ? 'text-gray-400' : '' };
    
    switch(type) {
      case 'work-available':
        return <Package {...iconProps} className="text-purple-600" />;
      case 'work-assigned':
        return <Briefcase {...iconProps} className="text-blue-600" />;
      case 'work-accepted':
        return <CheckCircle {...iconProps} className="text-green-600" />;
      case 'tailor-assigned':
        return <Scissors {...iconProps} className="text-orange-600" />;
      case 'order-ready':
      case 'order-delivered':
        return <CheckCircle {...iconProps} className="text-green-600" />;
      case 'order-cancelled':
        return <AlertCircle {...iconProps} className="text-red-600" />;
      default:
        return <Bell {...iconProps} className="text-slate-600" />;
    }
  };

  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
      isRead ? 'bg-gray-100' : 'bg-white shadow-sm'
    }`}>
      {getIcon()}
    </div>
  );
};

// ============================================
// 🏷️ NOTIFICATION BADGE COMPONENT
// ============================================
const NotificationBadge = ({ type, priority, isRead }) => {
  if (isRead) return null;
  
  return (
    <div className="flex gap-2">
      {priority === 'high' && (
        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium">
          High Priority
        </span>
      )}
      {type === 'work-available' && (
        <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full font-medium">
          New Work
        </span>
      )}
      {type === 'work-assigned' && (
        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
          Assigned
        </span>
      )}
    </div>
  );
};

// ============================================
// ⏱️ TIME FORMATTER
// ============================================
const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return `${mins} min${mins > 1 ? 's' : ''} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
    
  } catch {
    return 'Invalid date';
  }
};

// ============================================
// 📄 EMPTY STATE COMPONENT
// ============================================
const EmptyState = ({ filter, onViewAll }) => (
  <div className="p-16 text-center">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <Bell size={40} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">No notifications</h3>
    <p className="text-gray-500 mb-6">
      {filter === 'all' 
        ? "You're all caught up! Check back later for updates."
        : filter === 'unread'
        ? "You have no unread notifications."
        : "You have no read notifications."
      }
    </p>
    {filter !== 'all' && (
      <button
        onClick={onViewAll}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
      >
        View All Notifications
      </button>
    )}
  </div>
);

// ============================================
// 🎯 MAIN COMPONENT
// ============================================
export default function NotificationsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const notifications = useSelector(selectNotifications) || [];
  const unreadCount = useSelector(selectUnreadCount) || 0;
  const loading = useSelector(selectNotificationsLoading) || false;
  const error = useSelector(selectNotificationsError) || null;
  const { user } = useSelector((state) => state.auth);

  // Local state
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Get base path for navigation
  const basePath = useMemo(() => {
    if (!user?.role) return '/dashboard';
    return user.role === 'ADMIN' ? '/admin' :
           user.role === 'STORE_KEEPER' ? '/storekeeper' :
           user.role === 'CUTTING_MASTER' ? '/cuttingmaster' : '/dashboard';
  }, [user]);

  // Load notifications on mount and filter change
  useEffect(() => {
    loadNotifications();
  }, [filter, page, dispatch]);

  // Load unread count periodically
  useEffect(() => {
    dispatch(fetchUnreadCount());
    
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
      loadNotifications(true); // Silent refresh
    }, 30000);
    
    return () => clearInterval(interval);
  }, [dispatch]);

  const loadNotifications = async (silent = false) => {
    if (!silent) setRefreshing(true);
    
    try {
      const params = {
        page,
        limit,
        ...(filter !== 'all' && { unreadOnly: filter === 'unread' ? 'true' : 'false' })
      };
      
      await dispatch(fetchNotifications(params)).unwrap();
      
    } catch (err) {
      if (!silent) showToast.error(err || 'Failed to load notifications');
    } finally {
      if (!silent) setRefreshing(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await dispatch(markAsRead(id)).unwrap();
      showToast.success('Marked as read');
      dispatch(fetchUnreadCount());
    } catch (error) {
      showToast.error(error || 'Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      showToast.info('No unread notifications');
      return;
    }
    
    if (window.confirm(`Mark all ${unreadCount} notifications as read?`)) {
      try {
        await dispatch(markAllAsRead()).unwrap();
        showToast.success('All notifications marked as read');
        dispatch(fetchUnreadCount());
      } catch (error) {
        showToast.error(error || 'Failed to mark all as read');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this notification?')) {
      try {
        await dispatch(deleteNotification(id)).unwrap();
        showToast.success('Notification deleted');
        dispatch(fetchUnreadCount());
      } catch (error) {
        showToast.error(error || 'Failed to delete notification');
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedNotifications.length === 0) return;
    
    if (window.confirm(`Delete ${selectedNotifications.length} notifications?`)) {
      try {
        await Promise.all(selectedNotifications.map(id => 
          dispatch(deleteNotification(id)).unwrap()
        ));
        showToast.success(`${selectedNotifications.length} notifications deleted`);
        setSelectedNotifications([]);
        setSelectMode(false);
        dispatch(fetchUnreadCount());
      } catch (error) {
        showToast.error(error || 'Failed to delete notifications');
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n._id));
    }
  };

  const handleSelect = (id) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleRefresh = () => {
    loadNotifications();
    dispatch(fetchUnreadCount());
    showToast.success('Notifications refreshed');
  };

  const handleBack = () => {
    navigate(basePath);
  };

  const getNotificationLink = (notification) => {
    const rolePath = basePath;
    
    if (notification.reference?.workId) {
      return `${rolePath}/works/${notification.reference.workId}`;
    }
    if (notification.reference?.orderId) {
      return `${rolePath}/orders/${notification.reference.orderId}`;
    }
    if (notification.reference?.garmentId) {
      return `${rolePath}/garments/${notification.reference.garmentId}`;
    }
    return '#';
  };

  const getNotificationBg = (type, isRead) => {
    if (isRead) return 'bg-white hover:bg-gray-50';
    
    switch(type) {
      case 'work-available': return 'bg-purple-50 hover:bg-purple-100';
      case 'work-assigned': return 'bg-blue-50 hover:bg-blue-100';
      case 'work-accepted': return 'bg-green-50 hover:bg-green-100';
      case 'tailor-assigned': return 'bg-orange-50 hover:bg-orange-100';
      case 'order-cancelled': return 'bg-red-50 hover:bg-red-100';
      default: return 'bg-gray-50 hover:bg-gray-100';
    }
  };

  const isLoading = loading || refreshing;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                title="Go back"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                <p className="text-sm text-gray-500">
                  {unreadCount > 0 
                    ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                    : 'No unread notifications'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Select Mode Toggle */}
              <button
                onClick={() => setSelectMode(!selectMode)}
                className={`p-2 rounded-lg transition-all ${
                  selectMode ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
                }`}
                title={selectMode ? 'Exit select mode' : 'Select notifications'}
              >
                <CheckCheck size={20} />
              </button>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw size={20} className={isLoading ? 'animate-spin text-blue-600' : 'text-gray-600'} />
              </button>

              {/* Mark All Read Button */}
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                >
                  <CheckCheck size={18} />
                  Mark All Read
                  <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                    {unreadCount}
                  </span>
                </button>
              )}

              {/* Bulk Delete Button */}
              {selectMode && selectedNotifications.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <Trash2 size={18} />
                  Delete ({selectedNotifications.length})
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-6 mt-4 border-b border-gray-200">
            <button
              onClick={() => {
                setFilter('all');
                setPage(1);
                setSelectedNotifications([]);
                setSelectMode(false);
              }}
              className={`pb-2 px-1 font-medium text-sm transition-all relative ${
                filter === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
              <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                {notifications.length}
              </span>
            </button>
            <button
              onClick={() => {
                setFilter('unread');
                setPage(1);
                setSelectedNotifications([]);
                setSelectMode(false);
              }}
              className={`pb-2 px-1 font-medium text-sm transition-all relative ${
                filter === 'unread'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setFilter('read');
                setPage(1);
                setSelectedNotifications([]);
                setSelectMode(false);
              }}
              className={`pb-2 px-1 font-medium text-sm transition-all relative ${
                filter === 'read'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Read
            </button>
          </div>

          {/* Select Mode Header */}
          {selectMode && notifications.length > 0 && (
            <div className="flex items-center justify-between mt-4 p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.length === notifications.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedNotifications.length === notifications.length
                      ? 'Deselect all'
                      : 'Select all'
                    }
                  </span>
                </label>
                <span className="text-sm text-gray-500">
                  {selectedNotifications.length} selected
                </span>
              </div>
              <button
                onClick={() => setSelectMode(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Debug Panel */}
      <DebugPanel
        notifications={notifications}
        unreadCount={unreadCount}
        loading={isLoading}
        error={error}
        filter={filter}
        pagination={{ page, pages: Math.ceil(notifications.length / limit) }}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && notifications.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading notifications...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-600 mb-2">Failed to load notifications</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && notifications.length === 0 && (
          <EmptyState filter={filter} onViewAll={() => setFilter('all')} />
        )}

        {/* Notifications List */}
        {!isLoading && !error && notifications.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 ${getNotificationBg(notification.type, notification.read)} transition-all ${
                    selectMode ? 'pl-8' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox for select mode */}
                    {selectMode && (
                      <div className="pt-2">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification._id)}
                          onChange={() => handleSelect(notification._id)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                    )}

                    {/* Icon */}
                    <NotificationIcon type={notification.type} isRead={notification.read} />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className={`font-semibold ${
                              notification.read ? 'text-gray-700' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h3>
                            <NotificationBadge 
                              type={notification.type} 
                              priority={notification.priority}
                              isRead={notification.read}
                            />
                          </div>
                          
                          <p className={`text-sm mb-2 ${
                            notification.read ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-gray-400 flex items-center gap-1">
                              <Clock size={12} />
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            
                            {(notification.reference?.orderId || 
                              notification.reference?.workId || 
                              notification.reference?.garmentId) && (
                              <>
                                <span className="text-gray-300">•</span>
                                <Link
                                  to={getNotificationLink(notification)}
                                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                  onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                                >
                                  View Details
                                  <Eye size={12} />
                                </Link>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        {!selectMode && (
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification._id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                title="Mark as read"
                                disabled={isLoading}
                              >
                                <Check size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete"
                              disabled={isLoading}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {Math.ceil(notifications.length / limit) > 1 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 hover:bg-white rounded-lg transition-all disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {Math.ceil(notifications.length / limit)}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= Math.ceil(notifications.length / limit)}
                    className="p-2 hover:bg-white rounded-lg transition-all disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Showing {Math.min(notifications.length, page * limit)} of {notifications.length} notifications
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}