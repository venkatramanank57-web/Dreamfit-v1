// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { Bell } from 'lucide-react';
// import {
//   fetchNotifications,
//   selectNotifications,
//   selectUnreadCount
// } from '../../features/notification/notificationSlice';

// export default function NotificationBell() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Get user from auth state
//   const { user } = useSelector((state) => state.auth);
  
//   // Get notifications and unread count
//   const notifications = useSelector(selectNotifications);
//   const unreadCount = useSelector(selectUnreadCount);

//   // Get base path based on user role
//   const basePath = user?.role === "ADMIN" ? "/admin" : 
//                    user?.role === "STORE_KEEPER" ? "/storekeeper" : 
//                    "/cuttingmaster";

//   // Fetch notifications on mount
//   useEffect(() => {
//     dispatch(fetchNotifications());
    
//     // Optional: Poll every 30 seconds
//     const interval = setInterval(() => {
//       dispatch(fetchNotifications());
//     }, 30000);
    
//     return () => clearInterval(interval);
//   }, [dispatch]);

//   // Navigate to notifications page inside dashboard when bell is clicked
//   const handleClick = () => {
//     navigate(`${basePath}/notifications`);
//   };

//   return (
//     <button
//       onClick={handleClick}
//       className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
//     >
//       <Bell size={20} />
//       {unreadCount > 0 && (
//         <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full px-1">
//           {unreadCount > 99 ? '99+' : unreadCount}
//         </span>
//       )}
//     </button>
//   );
// }











// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { Bell, Bug, RefreshCw } from 'lucide-react';
// import {
//   fetchNotifications,
//   fetchUnreadCount,
//   selectNotifications,
//   selectUnreadCount,
//   selectNotificationsLoading,
//   selectNotificationsError
// } from '../../features/notification/notificationSlice';

// // ============================================
// // 🔍 DEBUG PANEL COMPONENT
// // ============================================
// const DebugBadge = ({ showDebug, setShowDebug, debugInfo }) => {
//   if (process.env.NODE_ENV !== 'development') return null;
  
//   return (
//     <div className="absolute -bottom-12 right-0 z-50">
//       <button
//         onClick={() => setShowDebug(!showDebug)}
//         className="flex items-center gap-1 px-2 py-1 bg-gray-800 text-gray-300 rounded-lg text-xs"
//         title="Toggle Debug"
//       >
//         <Bug size={12} />
//         Debug
//       </button>
      
//       {showDebug && (
//         <div className="absolute top-6 right-0 mt-1 w-64 bg-gray-900 text-green-400 p-3 rounded-xl font-mono text-xs border border-green-500/30 z-50">
//           <div className="flex justify-between items-center mb-2">
//             <span className="font-bold text-yellow-400">🔍 NOTIFICATION DEBUG</span>
//             <button 
//               onClick={() => console.clear()} 
//               className="text-xs bg-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-600"
//             >
//               Clear
//             </button>
//           </div>
          
//           <div className="space-y-1">
//             <div className="flex justify-between">
//               <span className="text-gray-400">User Role:</span>
//               <span className="text-purple-400">{debugInfo.userRole || 'N/A'}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Base Path:</span>
//               <span className="text-blue-400">{debugInfo.basePath}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Unread Count:</span>
//               <span className={debugInfo.unreadCount > 0 ? 'text-green-400 font-bold' : 'text-gray-400'}>
//                 {debugInfo.unreadCount}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Total Notif:</span>
//               <span className="text-blue-400">{debugInfo.totalCount}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Loading:</span>
//               <span className={debugInfo.loading ? 'text-yellow-400' : 'text-green-400'}>
//                 {debugInfo.loading ? 'Yes' : 'No'}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Error:</span>
//               <span className={debugInfo.error ? 'text-red-400' : 'text-green-400'}>
//                 {debugInfo.error ? 'Yes' : 'No'}
//               </span>
//             </div>
//           </div>

//           {debugInfo.error && (
//             <div className="mt-2 pt-2 border-t border-red-700">
//               <div className="text-red-400 break-words">{debugInfo.error}</div>
//             </div>
//           )}

//           {debugInfo.notificationTypes && Object.keys(debugInfo.notificationTypes).length > 0 && (
//             <div className="mt-2 pt-2 border-t border-gray-700">
//               <div className="text-yellow-400 mb-1">📋 Types:</div>
//               {Object.entries(debugInfo.notificationTypes).map(([type, count]) => (
//                 <div key={type} className="flex justify-between text-xs">
//                   <span className="text-gray-400">{type}:</span>
//                   <span className="text-blue-400">{count}</span>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="mt-2 pt-2 border-t border-gray-700 text-[10px] text-gray-500">
//             Last Fetch: {debugInfo.lastFetchTime || 'Never'}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ============================================
// // ✅ MAIN NOTIFICATION BELL COMPONENT
// // ============================================
// export default function NotificationBell() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [showDebug, setShowDebug] = useState(false);
//   const [lastFetchTime, setLastFetchTime] = useState(null);
//   const [manualRefresh, setManualRefresh] = useState(false);

//   // Get user from auth state
//   const { user } = useSelector((state) => state.auth);
  
//   // Get notifications and unread count
//   const notifications = useSelector(selectNotifications) || [];
//   const unreadCount = useSelector(selectUnreadCount) || 0;
//   const loading = useSelector(selectNotificationsLoading) || false;
//   const error = useSelector(selectNotificationsError) || null;

//   // Get base path based on user role
//   const basePath = user?.role === "ADMIN" ? "/admin" : 
//                    user?.role === "STORE_KEEPER" ? "/storekeeper" : 
//                    "/cuttingmaster";

//   // Calculate notification types for debug
//   const notificationTypes = notifications.reduce((acc, n) => {
//     if (n?.type) {
//       acc[n.type] = (acc[n.type] || 0) + 1;
//     }
//     return acc;
//   }, {});

//   // Debug info
//   const debugInfo = {
//     userRole: user?.role,
//     basePath,
//     unreadCount,
//     totalCount: notifications.length,
//     loading,
//     error,
//     notificationTypes,
//     lastFetchTime
//   };

//   // Fetch notifications on mount
//   useEffect(() => {
//     console.log("🔔 NotificationBell mounted");
//     fetchNotificationData();
    
//     // Optional: Poll every 30 seconds
//     const interval = setInterval(() => {
//       console.log("🔄 Polling notifications...");
//       fetchNotificationData();
//     }, 30000);
    
//     return () => {
//       console.log("🔔 NotificationBell unmounted");
//       clearInterval(interval);
//     };
//   }, [dispatch]);

//   const fetchNotificationData = async () => {
//     try {
//       console.log("📥 Fetching notifications...");
//       setManualRefresh(true);
//       await dispatch(fetchNotifications()).unwrap();
//       await dispatch(fetchUnreadCount()).unwrap();
//       setLastFetchTime(new Date().toLocaleTimeString());
//       console.log("✅ Notifications fetched successfully");
//     } catch (err) {
//       console.error("❌ Error fetching notifications:", err);
//     } finally {
//       setManualRefresh(false);
//     }
//   };

//   const handleManualRefresh = (e) => {
//     e.stopPropagation();
//     console.log("🔄 Manual refresh triggered");
//     fetchNotificationData();
//   };

//   // Navigate to notifications page inside dashboard when bell is clicked
//   const handleClick = () => {
//     console.log(`🔔 Navigating to: ${basePath}/notifications`);
//     navigate(`${basePath}/notifications`);
//   };

//   const isLoading = loading || manualRefresh;

//   return (
//     <div className="relative">
//       <button
//         onClick={handleClick}
//         className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group"
//         title={`${unreadCount} unread notifications`}
//       >
//         <Bell size={20} className={isLoading ? 'animate-pulse' : ''} />
        
//         {/* Unread Badge */}
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full px-1 animate-pulse">
//             {unreadCount > 99 ? '99+' : unreadCount}
//           </span>
//         )}

//         {/* Loading Indicator */}
//         {isLoading && (
//           <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
//         )}

//         {/* Debug Hover Area */}
//         {process.env.NODE_ENV === 'development' && (
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-blue-500/10 rounded-xl pointer-events-none"></div>
//         )}
//       </button>

//       {/* Manual Refresh Button (for debugging) */}
//       {process.env.NODE_ENV === 'development' && (
//         <button
//           onClick={handleManualRefresh}
//           className="absolute -top-1 -right-8 p-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
//           title="Manual Refresh"
//         >
//           <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
//         </button>
//       )}

//       {/* Debug Panel */}
//       <DebugBadge 
//         showDebug={showDebug} 
//         setShowDebug={setShowDebug} 
//         debugInfo={debugInfo}
//       />
//     </div>
//   );
// }


// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { Bell, Bug, RefreshCw } from 'lucide-react';
// import {
//   fetchNotifications,
//   fetchUnreadCount,
//   markAllAsRead,
//   resetNotifications, // 🔥 FIX: Changed from resetNotificationState to resetNotifications
//   selectNotifications,
//   selectUnreadCount,
//   selectNotificationsLoading,
//   selectNotificationsError
// } from '../../features/notification/notificationSlice';

// // ============================================
// // 🔍 DEBUG PANEL COMPONENT
// // ============================================
// const DebugBadge = ({ showDebug, setShowDebug, debugInfo }) => {
//   if (process.env.NODE_ENV !== 'development') return null;
  
//   return (
//     <div className="absolute -bottom-12 right-0 z-50">
//       <button
//         onClick={() => setShowDebug(!showDebug)}
//         className="flex items-center gap-1 px-2 py-1 bg-gray-800 text-gray-300 rounded-lg text-xs"
//         title="Toggle Debug"
//       >
//         <Bug size={12} />
//         Debug
//       </button>
      
//       {showDebug && (
//         <div className="absolute top-6 right-0 mt-1 w-64 bg-gray-900 text-green-400 p-3 rounded-xl font-mono text-xs border border-green-500/30 z-50">
//           <div className="flex justify-between items-center mb-2">
//             <span className="font-bold text-yellow-400">🔍 NOTIFICATION DEBUG</span>
//             <button 
//               onClick={() => console.clear()} 
//               className="text-xs bg-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-600"
//             >
//               Clear
//             </button>
//           </div>
          
//           <div className="space-y-1">
//             <div className="flex justify-between">
//               <span className="text-gray-400">User Role:</span>
//               <span className="text-purple-400">{debugInfo.userRole || 'N/A'}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">User ID:</span>
//               <span className="text-blue-400 font-mono text-[10px]">
//                 {debugInfo.userId ? `${debugInfo.userId.substring(0,8)}...` : 'N/A'}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Base Path:</span>
//               <span className="text-blue-400">{debugInfo.basePath}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Unread Count:</span>
//               <span className={debugInfo.unreadCount > 0 ? 'text-green-400 font-bold' : 'text-gray-400'}>
//                 {debugInfo.unreadCount}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Total Notif:</span>
//               <span className="text-blue-400">{debugInfo.totalCount}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Loading:</span>
//               <span className={debugInfo.loading ? 'text-yellow-400' : 'text-green-400'}>
//                 {debugInfo.loading ? 'Yes' : 'No'}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Error:</span>
//               <span className={debugInfo.error ? 'text-red-400' : 'text-green-400'}>
//                 {debugInfo.error ? 'Yes' : 'No'}
//               </span>
//             </div>
//           </div>

//           {debugInfo.error && (
//             <div className="mt-2 pt-2 border-t border-red-700">
//               <div className="text-red-400 break-words">{debugInfo.error}</div>
//             </div>
//           )}

//           {debugInfo.notificationTypes && Object.keys(debugInfo.notificationTypes).length > 0 && (
//             <div className="mt-2 pt-2 border-t border-gray-700">
//               <div className="text-yellow-400 mb-1">📋 Types:</div>
//               {Object.entries(debugInfo.notificationTypes).map(([type, count]) => (
//                 <div key={type} className="flex justify-between text-xs">
//                   <span className="text-gray-400">{type}:</span>
//                   <span className="text-blue-400">{count}</span>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="mt-2 pt-2 border-t border-gray-700 text-[10px] text-gray-500">
//             Last Fetch: {debugInfo.lastFetchTime || 'Never'}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ============================================
// // ✅ MAIN NOTIFICATION BELL COMPONENT - FIXED LIVE UPDATES
// // ============================================
// export default function NotificationBell() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [showDebug, setShowDebug] = useState(false);
//   const [lastFetchTime, setLastFetchTime] = useState(null);
//   const [manualRefresh, setManualRefresh] = useState(false);
//   const [isHovering, setIsHovering] = useState(false);
  
//   // Use ref to track if component is mounted
//   const isMounted = useRef(true);
  
//   // Use ref to prevent multiple simultaneous fetches
//   const isFetching = useRef(false);

//   // Get user from auth state
//   const { user } = useSelector((state) => state.auth);
  
//   // Get notifications and unread count
//   const notifications = useSelector(selectNotifications) || [];
//   const unreadCount = useSelector(selectUnreadCount) || 0;
//   const loading = useSelector(selectNotificationsLoading) || false;
//   const error = useSelector(selectNotificationsError) || null;

//   // Get base path based on user role
//   const basePath = user?.role === "ADMIN" ? "/admin" : 
//                    user?.role === "STORE_KEEPER" ? "/storekeeper" : 
//                    "/cuttingmaster";

//   // Calculate notification types for debug
//   const notificationTypes = notifications.reduce((acc, n) => {
//     if (n?.type) {
//       acc[n.type] = (acc[n.type] || 0) + 1;
//     }
//     return acc;
//   }, {});

//   // Debug info
//   const debugInfo = {
//     userId: user?._id || user?.id,
//     userRole: user?.role,
//     basePath,
//     unreadCount,
//     totalCount: notifications.length,
//     loading,
//     error,
//     notificationTypes,
//     lastFetchTime
//   };

//   // 🔥 FIX 1: Memoized fetch function to prevent recreation
//   const fetchNotificationData = useCallback(async () => {
//     // Prevent multiple simultaneous fetches
//     if (isFetching.current || !user?._id) {
//       console.log("⏳ Already fetching or no user, skipping...");
//       return;
//     }

//     try {
//       isFetching.current = true;
//       setManualRefresh(true);
      
//       console.log("📥 Fetching notifications for user:", user._id);
      
//       // Fetch both in parallel for efficiency
//       await Promise.all([
//         dispatch(fetchNotifications()).unwrap(),
//         dispatch(fetchUnreadCount()).unwrap()
//       ]);
      
//       if (isMounted.current) {
//         setLastFetchTime(new Date().toLocaleTimeString());
//         console.log("✅ Notifications fetched successfully");
//       }
//     } catch (err) {
//       console.error("❌ Error fetching notifications:", err);
//     } finally {
//       if (isMounted.current) {
//         setManualRefresh(false);
//       }
//       isFetching.current = false;
//     }
//   }, [dispatch, user?._id]);

//   // 🔥 FIX 2: Fetch on mount AND when user changes
//   useEffect(() => {
//     isMounted.current = true;
    
//     console.log("🔔 NotificationBell mounted/updated - User:", user?._id);
    
//     if (user?._id) {
//       fetchNotificationData();
//     } else {
//       // 🔥 FIX: Use resetNotifications (correct name) when user logs out
//       dispatch(resetNotifications());
//       setLastFetchTime(null);
//     }
    
//     return () => {
//       console.log("🔔 NotificationBell unmounting");
//       isMounted.current = false;
//       isFetching.current = false;
//     };
//   }, [user?._id, dispatch, fetchNotificationData]);

//   // 🔥 FIX 3: Poll every 30 seconds (only if user is logged in)
//   useEffect(() => {
//     if (!user?._id) return;
    
//     const interval = setInterval(() => {
//       console.log("🔄 Polling notifications...");
//       fetchNotificationData();
//     }, 30000);
    
//     return () => clearInterval(interval);
//   }, [user?._id, fetchNotificationData]);

//   // 🔥 FIX 4: Mark all as read handler
//   const handleMarkAllAsRead = useCallback(async (e) => {
//     e.stopPropagation();
//     if (unreadCount === 0) return;
    
//     try {
//       await dispatch(markAllAsRead()).unwrap();
//       await dispatch(fetchUnreadCount()).unwrap();
//       console.log("✅ All notifications marked as read");
//     } catch (err) {
//       console.error("❌ Error marking all as read:", err);
//     }
//   }, [dispatch, unreadCount]);

//   const handleManualRefresh = useCallback((e) => {
//     e.stopPropagation();
//     console.log("🔄 Manual refresh triggered");
//     fetchNotificationData();
//   }, [fetchNotificationData]);

//   // Navigate to notifications page
//   const handleClick = useCallback(() => {
//     console.log(`🔔 Navigating to: ${basePath}/notifications`);
//     navigate(`${basePath}/notifications`);
//   }, [navigate, basePath]);

//   const isLoading = loading || manualRefresh;

//   return (
//     <div className="relative">
//       <button
//         onClick={handleClick}
//         onMouseEnter={() => setIsHovering(true)}
//         onMouseLeave={() => setIsHovering(false)}
//         className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group"
//         title={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
//       >
//         <Bell size={20} className={isLoading ? 'animate-pulse' : ''} />
        
//         {/* 🔥 FIX 5: Animated unread badge with zoom effect */}
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1.5 border-2 border-white animate-in zoom-in duration-300">
//             {unreadCount > 99 ? '99+' : unreadCount}
//           </span>
//         )}

//         {/* 🔥 FIX 6: Show dot for loading state */}
//         {isLoading && unreadCount === 0 && (
//           <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse border-2 border-white"></span>
//         )}

//         {/* 🔥 FIX 7: Hover tooltip with additional info */}
//         {isHovering && unreadCount > 0 && (
//           <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg py-1 px-2 text-xs whitespace-nowrap border border-slate-200 z-10">
//             <div className="flex items-center gap-2">
//               <span>{unreadCount} unread</span>
//               <button
//                 onClick={handleMarkAllAsRead}
//                 className="text-blue-600 hover:text-blue-700 text-[10px] font-medium"
//               >
//                 Mark all read
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Debug Hover Area */}
//         {process.env.NODE_ENV === 'development' && (
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-blue-500/10 rounded-xl pointer-events-none"></div>
//         )}
//       </button>

//       {/* Manual Refresh Button (for debugging) */}
//       {process.env.NODE_ENV === 'development' && (
//         <button
//           onClick={handleManualRefresh}
//           className="absolute -top-1 -right-8 p-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
//           title="Manual Refresh"
//         >
//           <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
//         </button>
//       )}

//       {/* Debug Panel
//       <DebugBadge 
//         showDebug={showDebug} 
//         setShowDebug={setShowDebug} 
//         debugInfo={debugInfo}
//       /> */}
//     </div>
//   );
// }







// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { Bell, Bug, RefreshCw } from 'lucide-react';
// import {
//   fetchNotifications,
//   fetchUnreadCount,
//   markAllAsRead,
//   resetNotifications,
//   selectNotifications,
//   selectUnreadCount,
//   selectNotificationsLoading,
//   selectNotificationsError
// } from '../../features/notification/notificationSlice';

// // ============================================
// // 🔍 DEBUG PANEL COMPONENT
// // ============================================
// const DebugBadge = ({ showDebug, setShowDebug, debugInfo }) => {
//   if (process.env.NODE_ENV !== 'development') return null;
  
//   return (
//     <div className="absolute -bottom-12 right-0 z-50">
//       <button
//         onClick={() => setShowDebug(!showDebug)}
//         className="flex items-center gap-1 px-2 py-1 bg-gray-800 text-gray-300 rounded-lg text-xs"
//         title="Toggle Debug"
//       >
//         <Bug size={12} />
//         Debug
//       </button>
      
//       {showDebug && (
//         <div className="absolute top-6 right-0 mt-1 w-64 bg-gray-900 text-green-400 p-3 rounded-xl font-mono text-xs border border-green-500/30 z-50">
//           <div className="flex justify-between items-center mb-2">
//             <span className="font-bold text-yellow-400">🔍 NOTIFICATION DEBUG</span>
//             <button 
//               onClick={() => console.clear()} 
//               className="text-xs bg-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-600"
//             >
//               Clear
//             </button>
//           </div>
          
//           <div className="space-y-1">
//             <div className="flex justify-between">
//               <span className="text-gray-400">User Role:</span>
//               <span className="text-purple-400">{debugInfo.userRole || 'N/A'}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">User ID:</span>
//               <span className="text-blue-400 font-mono text-[10px]">
//                 {debugInfo.userId ? `${debugInfo.userId.substring(0,8)}...` : 'N/A'}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Base Path:</span>
//               <span className="text-blue-400">{debugInfo.basePath}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Unread Count:</span>
//               <span className={debugInfo.unreadCount > 0 ? 'text-green-400 font-bold' : 'text-gray-400'}>
//                 {debugInfo.unreadCount}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Total Notif:</span>
//               <span className="text-blue-400">{debugInfo.totalCount}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Loading:</span>
//               <span className={debugInfo.loading ? 'text-yellow-400' : 'text-green-400'}>
//                 {debugInfo.loading ? 'Yes' : 'No'}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Error:</span>
//               <span className={debugInfo.error ? 'text-red-400' : 'text-green-400'}>
//                 {debugInfo.error ? 'Yes' : 'No'}
//               </span>
//             </div>
//           </div>

//           {debugInfo.error && (
//             <div className="mt-2 pt-2 border-t border-red-700">
//               <div className="text-red-400 break-words">{debugInfo.error}</div>
//             </div>
//           )}

//           {debugInfo.notificationTypes && Object.keys(debugInfo.notificationTypes).length > 0 && (
//             <div className="mt-2 pt-2 border-t border-gray-700">
//               <div className="text-yellow-400 mb-1">📋 Types:</div>
//               {Object.entries(debugInfo.notificationTypes).map(([type, count]) => (
//                 <div key={type} className="flex justify-between text-xs">
//                   <span className="text-gray-400">{type}:</span>
//                   <span className="text-blue-400">{count}</span>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="mt-2 pt-2 border-t border-gray-700 text-[10px] text-gray-500">
//             Last Fetch: {debugInfo.lastFetchTime || 'Never'}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ============================================
// // ✅ MAIN NOTIFICATION BELL COMPONENT - FIXED FOR USER ID FORMAT
// // ============================================
// export default function NotificationBell() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [showDebug, setShowDebug] = useState(false);
//   const [lastFetchTime, setLastFetchTime] = useState(null);
//   const [manualRefresh, setManualRefresh] = useState(false);
//   const [isHovering, setIsHovering] = useState(false);
  
//   // Use ref to track if component is mounted
//   const isMounted = useRef(true);
  
//   // Use ref to prevent multiple simultaneous fetches
//   const isFetching = useRef(false);

//   // Get user from auth state
//   const { user } = useSelector((state) => state.auth);
  
//   // 🔥 FIX: Get user ID regardless of whether it's `id` or `_id`
//   const userId = user?._id || user?.id;
  
//   // Get notifications and unread count
//   const notifications = useSelector(selectNotifications) || [];
//   const unreadCount = useSelector(selectUnreadCount) || 0;
//   const loading = useSelector(selectNotificationsLoading) || false;
//   const error = useSelector(selectNotificationsError) || null;

//   // Get base path based on user role
//   const basePath = user?.role === "ADMIN" ? "/admin" : 
//                    user?.role === "STORE_KEEPER" ? "/storekeeper" : 
//                    "/cuttingmaster";

//   // Calculate notification types for debug
//   const notificationTypes = notifications.reduce((acc, n) => {
//     if (n?.type) {
//       acc[n.type] = (acc[n.type] || 0) + 1;
//     }
//     return acc;
//   }, {});

//   // Debug info
//   const debugInfo = {
//     userId: userId, // 🔥 FIX: Use the standardized userId
//     userRole: user?.role,
//     basePath,
//     unreadCount,
//     totalCount: notifications.length,
//     loading,
//     error,
//     notificationTypes,
//     lastFetchTime
//   };

//   // 🔥 FIX 1: Memoized fetch function that works with either ID format
//   const fetchNotificationData = useCallback(async () => {
//     // Prevent multiple simultaneous fetches - use userId here
//     if (isFetching.current || !userId) {
//       console.log("⏳ Already fetching or no user, skipping...");
//       return;
//     }

//     try {
//       isFetching.current = true;
//       setManualRefresh(true);
      
//       console.log("📥 Fetching notifications for user:", userId);
      
//       // Fetch both in parallel for efficiency
//       await Promise.all([
//         dispatch(fetchNotifications()).unwrap(),
//         dispatch(fetchUnreadCount()).unwrap()
//       ]);
      
//       if (isMounted.current) {
//         setLastFetchTime(new Date().toLocaleTimeString());
//         console.log("✅ Notifications fetched successfully");
//       }
//     } catch (err) {
//       console.error("❌ Error fetching notifications:", err);
//     } finally {
//       if (isMounted.current) {
//         setManualRefresh(false);
//       }
//       isFetching.current = false;
//     }
//   }, [dispatch, userId]); // 🔥 FIX: Use userId in dependencies

//   // 🔥 FIX 2: Fetch on mount AND when user changes
//   useEffect(() => {
//     isMounted.current = true;
    
//     console.log("🔔 NotificationBell mounted/updated - User ID:", userId);
    
//     if (userId) {
//       fetchNotificationData();
//     } else {
//       // 🔥 FIX: Reset notifications when user logs out
//       dispatch(resetNotifications());
//       setLastFetchTime(null);
//     }
    
//     return () => {
//       console.log("🔔 NotificationBell unmounting");
//       isMounted.current = false;
//       isFetching.current = false;
//     };
//   }, [userId, dispatch, fetchNotificationData]); // 🔥 FIX: Use userId in dependencies

//   // 🔥 FIX 3: Poll every 30 seconds (only if user is logged in)
//   useEffect(() => {
//     if (!userId) return;
    
//     const interval = setInterval(() => {
//       console.log("🔄 Polling notifications...");
//       fetchNotificationData();
//     }, 30000);
    
//     return () => clearInterval(interval);
//   }, [userId, fetchNotificationData]); // 🔥 FIX: Use userId in dependencies

//   // 🔥 FIX 4: Mark all as read handler
//   const handleMarkAllAsRead = useCallback(async (e) => {
//     e.stopPropagation();
//     if (unreadCount === 0) return;
    
//     try {
//       await dispatch(markAllAsRead()).unwrap();
//       await dispatch(fetchUnreadCount()).unwrap();
//       console.log("✅ All notifications marked as read");
//     } catch (err) {
//       console.error("❌ Error marking all as read:", err);
//     }
//   }, [dispatch, unreadCount]);

//   const handleManualRefresh = useCallback((e) => {
//     e.stopPropagation();
//     console.log("🔄 Manual refresh triggered");
//     fetchNotificationData();
//   }, [fetchNotificationData]);

//   // Navigate to notifications page
//   const handleClick = useCallback(() => {
//     console.log(`🔔 Navigating to: ${basePath}/notifications`);
//     navigate(`${basePath}/notifications`);
//   }, [navigate, basePath]);

//   const isLoading = loading || manualRefresh;

//   return (
//     <div className="relative">
//       <button
//         onClick={handleClick}
//         onMouseEnter={() => setIsHovering(true)}
//         onMouseLeave={() => setIsHovering(false)}
//         className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group"
//         title={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
//       >
//         <Bell size={20} className={isLoading ? 'animate-pulse' : ''} />
        
//         {/* Animated unread badge with zoom effect */}
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1.5 border-2 border-white animate-in zoom-in duration-300">
//             {unreadCount > 99 ? '99+' : unreadCount}
//           </span>
//         )}

//         {/* Show dot for loading state */}
//         {isLoading && unreadCount === 0 && (
//           <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse border-2 border-white"></span>
//         )}

//         {/* Hover tooltip with additional info */}
//         {isHovering && unreadCount > 0 && (
//           <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg py-1 px-2 text-xs whitespace-nowrap border border-slate-200 z-10">
//             <div className="flex items-center gap-2">
//               <span>{unreadCount} unread</span>
//               <button
//                 onClick={handleMarkAllAsRead}
//                 className="text-blue-600 hover:text-blue-700 text-[10px] font-medium"
//               >
//                 Mark all read
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Debug Hover Area */}
//         {process.env.NODE_ENV === 'development' && (
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-blue-500/10 rounded-xl pointer-events-none"></div>
//         )}
//       </button>

//       {/* Manual Refresh Button (for debugging) */}
//       {process.env.NODE_ENV === 'development' && (
//         <button
//           onClick={handleManualRefresh}
//           className="absolute -top-1 -right-8 p-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
//           title="Manual Refresh"
//         >
//           <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
//         </button>
//       )}

//       {/* Debug Panel - Uncommented to help with troubleshooting */}
//       <DebugBadge 
//         showDebug={showDebug} 
//         setShowDebug={setShowDebug} 
//         debugInfo={debugInfo}
//       />
//     </div>
//   );
// }


// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { Bell, Bug, RefreshCw } from 'lucide-react';
// import {
//   fetchNotifications,
//   fetchUnreadCount,
//   markAllAsRead,
//   resetNotifications,
//   selectNotifications,
//   selectUnreadCount,
//   selectNotificationsLoading,
//   selectNotificationsError
// } from '../../features/notification/notificationSlice';

// // ============================================
// // 🔍 DEBUG PANEL COMPONENT
// // ============================================
// const DebugBadge = ({ showDebug, setShowDebug, debugInfo }) => {
//   if (process.env.NODE_ENV !== 'development') return null;
  
//   return (
//     <div className="absolute -bottom-12 right-0 z-50">
//       <button
//         onClick={() => setShowDebug(!showDebug)}
//         className="flex items-center gap-1 px-2 py-1 bg-gray-800 text-gray-300 rounded-lg text-xs"
//         title="Toggle Debug"
//       >
//         <Bug size={12} />
//         Debug
//       </button>
      
//       {showDebug && (
//         <div className="absolute top-6 right-0 mt-1 w-64 bg-gray-900 text-green-400 p-3 rounded-xl font-mono text-xs border border-green-500/30 z-50">
//           <div className="flex justify-between items-center mb-2">
//             <span className="font-bold text-yellow-400">🔍 NOTIFICATION DEBUG</span>
//             <button 
//               onClick={() => console.clear()} 
//               className="text-xs bg-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-600"
//             >
//               Clear
//             </button>
//           </div>
          
//           <div className="space-y-1">
//             <div className="flex justify-between">
//               <span className="text-gray-400">User Role:</span>
//               <span className="text-purple-400">{debugInfo.userRole || 'N/A'}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">User ID:</span>
//               <span className="text-blue-400 font-mono text-[10px]">
//                 {debugInfo.userId ? `${debugInfo.userId.substring(0,8)}...` : 'N/A'}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Base Path:</span>
//               <span className="text-blue-400">{debugInfo.basePath}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Unread Count:</span>
//               <span className={debugInfo.unreadCount > 0 ? 'text-green-400 font-bold' : 'text-gray-400'}>
//                 {debugInfo.unreadCount}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Total Notif:</span>
//               <span className="text-blue-400">{debugInfo.totalCount}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Loading:</span>
//               <span className={debugInfo.loading ? 'text-yellow-400' : 'text-green-400'}>
//                 {debugInfo.loading ? 'Yes' : 'No'}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Error:</span>
//               <span className={debugInfo.error ? 'text-red-400' : 'text-green-400'}>
//                 {debugInfo.error ? 'Yes' : 'No'}
//               </span>
//             </div>
//           </div>

//           {debugInfo.error && (
//             <div className="mt-2 pt-2 border-t border-red-700">
//               <div className="text-red-400 break-words">{debugInfo.error}</div>
//             </div>
//           )}

//           {debugInfo.notificationTypes && Object.keys(debugInfo.notificationTypes).length > 0 && (
//             <div className="mt-2 pt-2 border-t border-gray-700">
//               <div className="text-yellow-400 mb-1">📋 Types:</div>
//               {Object.entries(debugInfo.notificationTypes).map(([type, count]) => (
//                 <div key={type} className="flex justify-between text-xs">
//                   <span className="text-gray-400">{type}:</span>
//                   <span className="text-blue-400">{count}</span>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="mt-2 pt-2 border-t border-gray-700 text-[10px] text-gray-500">
//             Last Fetch: {debugInfo.lastFetchTime || 'Never'}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ============================================
// // ✅ MAIN NOTIFICATION BELL COMPONENT - FIXED FOR USER ID FORMAT
// // ============================================
// export default function NotificationBell() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [showDebug, setShowDebug] = useState(false);
//   const [lastFetchTime, setLastFetchTime] = useState(null);
//   const [manualRefresh, setManualRefresh] = useState(false);
//   const [isHovering, setIsHovering] = useState(false);
  
//   // Use ref to track if component is mounted
//   const isMounted = useRef(true);
  
//   // Use ref to prevent multiple simultaneous fetches
//   const isFetching = useRef(false);

//   // Get user from auth state
//   const { user } = useSelector((state) => state.auth);
  
//   // 🔥 FIX: Get user ID regardless of whether it's `id` or `_id`
//   const userId = user?._id || user?.id;
  
//   // Get notifications and unread count
//   const notifications = useSelector(selectNotifications) || [];
//   const unreadCount = useSelector(selectUnreadCount) || 0;
//   const loading = useSelector(selectNotificationsLoading) || false;
//   const error = useSelector(selectNotificationsError) || null;

//   // Get base path based on user role
//   const basePath = user?.role === "ADMIN" ? "/admin" : 
//                    user?.role === "STORE_KEEPER" ? "/storekeeper" : 
//                    "/cuttingmaster";

//   // Calculate notification types for debug
//   const notificationTypes = notifications.reduce((acc, n) => {
//     if (n?.type) {
//       acc[n.type] = (acc[n.type] || 0) + 1;
//     }
//     return acc;
//   }, {});

//   // Debug info
//   const debugInfo = {
//     userId: userId,
//     userRole: user?.role,
//     basePath,
//     unreadCount,
//     totalCount: notifications.length,
//     loading,
//     error,
//     notificationTypes,
//     lastFetchTime
//   };

//   // 🔥 FIX 1: Memoized fetch function that works with either ID format
//   const fetchNotificationData = useCallback(async () => {
//     // Prevent multiple simultaneous fetches - use userId here
//     if (isFetching.current || !userId) {
//       console.log("⏳ Already fetching or no user, skipping...");
//       return;
//     }

//     try {
//       isFetching.current = true;
//       setManualRefresh(true);
      
//       console.log("📥 Fetching notifications for user:", userId);
      
//       // Fetch both in parallel for efficiency
//       await Promise.all([
//         dispatch(fetchNotifications()).unwrap(),
//         dispatch(fetchUnreadCount()).unwrap()
//       ]);
      
//       if (isMounted.current) {
//         setLastFetchTime(new Date().toLocaleTimeString());
//         console.log("✅ Notifications fetched successfully");
//       }
//     } catch (err) {
//       console.error("❌ Error fetching notifications:", err);
//     } finally {
//       if (isMounted.current) {
//         setManualRefresh(false);
//       }
//       isFetching.current = false;
//     }
//   }, [dispatch, userId]);

//   // 🔥 FIX 2: Fetch on mount AND when user changes
//   useEffect(() => {
//     isMounted.current = true;
    
//     console.log("🔔 NotificationBell mounted/updated - User ID:", userId);
    
//     if (userId) {
//       fetchNotificationData();
//     } else {
//       // 🔥 FIX: Reset notifications when user logs out
//       dispatch(resetNotifications());
//       setLastFetchTime(null);
//     }
    
//     return () => {
//       console.log("🔔 NotificationBell unmounting");
//       isMounted.current = false;
//       isFetching.current = false;
//     };
//   }, [userId, dispatch, fetchNotificationData]);

//   // 🔥 FIX 3: Poll every 30 seconds (only if user is logged in)
//   useEffect(() => {
//     if (!userId) return;
    
//     const interval = setInterval(() => {
//       console.log("🔄 Polling notifications...");
//       fetchNotificationData();
//     }, 30000);
    
//     return () => clearInterval(interval);
//   }, [userId, fetchNotificationData]);

//   // 🔥 FIX 4: Mark all as read handler
//   const handleMarkAllAsRead = useCallback(async (e) => {
//     e.stopPropagation();
//     e.preventDefault();
//     if (unreadCount === 0) return;
    
//     try {
//       await dispatch(markAllAsRead()).unwrap();
//       await dispatch(fetchUnreadCount()).unwrap();
//       console.log("✅ All notifications marked as read");
//     } catch (err) {
//       console.error("❌ Error marking all as read:", err);
//     }
//   }, [dispatch, unreadCount]);

//   const handleManualRefresh = useCallback((e) => {
//     e.stopPropagation();
//     console.log("🔄 Manual refresh triggered");
//     fetchNotificationData();
//   }, [fetchNotificationData]);

//   // Navigate to notifications page
//   const handleClick = useCallback(() => {
//     console.log(`🔔 Navigating to: ${basePath}/notifications`);
//     navigate(`${basePath}/notifications`);
//   }, [navigate, basePath]);

//   const isLoading = loading || manualRefresh;

//   return (
//     <div className="relative">
//       <button
//         onClick={handleClick}
//         onMouseEnter={() => setIsHovering(true)}
//         onMouseLeave={() => setIsHovering(false)}
//         className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group"
//         title={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
//       >
//         <Bell size={20} className={isLoading ? 'animate-pulse' : ''} />
        
//         {/* Animated unread badge with zoom effect */}
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1.5 border-2 border-white animate-in zoom-in duration-300">
//             {unreadCount > 99 ? '99+' : unreadCount}
//           </span>
//         )}

//         {/* Show dot for loading state */}
//         {isLoading && unreadCount === 0 && (
//           <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse border-2 border-white"></span>
//         )}

//         {/* Debug Hover Area */}
//         {process.env.NODE_ENV === 'development' && (
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-blue-500/10 rounded-xl pointer-events-none"></div>
//         )}
//       </button>

//       {/* 🔥 FIX: Moved hover tooltip outside the main button to avoid nested buttons */}
//       {isHovering && unreadCount > 0 && (
//         <div 
//           className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg py-2 px-3 text-xs whitespace-nowrap border border-slate-200 z-50"
//           onMouseEnter={() => setIsHovering(true)}
//           onMouseLeave={() => setIsHovering(false)}
//         >
//           <div className="flex items-center gap-3">
//             <span className="text-slate-700 font-medium">{unreadCount} unread</span>
//             <button
//               onClick={handleMarkAllAsRead}
//               className="text-blue-600 hover:text-blue-700 text-[10px] font-bold bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
//             >
//               Mark all read
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Manual Refresh Button (for debugging) - This is outside the main button */}
//       {process.env.NODE_ENV === 'development' && (
//         <button
//           onClick={handleManualRefresh}
//           className="absolute -top-1 -right-8 p-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
//           title="Manual Refresh"
//         >
//           <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
//         </button>
//       )}

//       {/* Debug Panel */}
//       <DebugBadge 
//         showDebug={showDebug} 
//         setShowDebug={setShowDebug} 
//         debugInfo={debugInfo}
//       />
//     </div>
//   );
// }

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Bug, RefreshCw } from 'lucide-react';
import {
  fetchNotifications,
  markAllAsRead,
  resetNotifications,
  selectNotifications,
  selectUnreadCount,
  selectNotificationsLoading,
  selectNotificationsError
} from '../../features/notification/notificationSlice';

// ============================================
// 🔍 DEBUG PANEL COMPONENT
// ============================================
const DebugBadge = ({ showDebug, setShowDebug, debugInfo }) => {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="absolute -bottom-12 right-0 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="flex items-center gap-1 px-2 py-1 bg-gray-800 text-gray-300 rounded-lg text-xs"
      >
        <Bug size={12} />
        Debug
      </button>
      
      {showDebug && (
        <div className="absolute top-6 right-0 mt-1 w-64 bg-gray-900 text-green-400 p-3 rounded-xl font-mono text-xs border border-green-500/30 z-50">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-yellow-400">🔍 NOTIFICATION DEBUG</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>User ID:</span>
              <span className="text-blue-400">{debugInfo.userId?.substring(0,8)}...</span>
            </div>
            <div className="flex justify-between">
              <span>Unread Count:</span>
              <span className="text-green-400 font-bold">{debugInfo.unreadCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Loading:</span>
              <span className={debugInfo.loading ? 'text-yellow-400' : 'text-green-400'}>{debugInfo.loading ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// ✅ MAIN NOTIFICATION BELL COMPONENT
// ============================================
export default function NotificationBell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDebug, setShowDebug] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [manualRefresh, setManualRefresh] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const isMounted = useRef(true);
  const isFetching = useRef(false);

  const { user } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;
  
  const notifications = useSelector(selectNotifications) || [];
  const unreadCount = useSelector(selectUnreadCount) || 0;
  const loading = useSelector(selectNotificationsLoading) || false;
  const error = useSelector(selectNotificationsError) || null;

  const basePath = user?.role === "ADMIN" ? "/admin" : 
                   user?.role === "STORE_KEEPER" ? "/storekeeper" : 
                   "/cuttingmaster";

  // 🔥 FIX 1: Only call fetchNotifications. 
  // fetchNotifications.fulfilled in your slice should already update the count.
  const fetchNotificationData = useCallback(async () => {
    if (isFetching.current || !userId) return;

    try {
      isFetching.current = true;
      setManualRefresh(true);
      
      console.log("📥 Fetching notifications for user:", userId);
      
      // We only call fetchNotifications to avoid state flickering between 0 and 8
      await dispatch(fetchNotifications()).unwrap();
      
      if (isMounted.current) {
        setLastFetchTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
    } finally {
      if (isMounted.current) {
        setManualRefresh(false);
      }
      isFetching.current = false;
    }
  }, [dispatch, userId]);

  useEffect(() => {
    isMounted.current = true;
    if (userId) {
      fetchNotificationData();
    } else {
      dispatch(resetNotifications());
    }
    return () => { isMounted.current = false; };
  }, [userId, dispatch, fetchNotificationData]);

  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(() => {
      fetchNotificationData();
    }, 30000);
    return () => clearInterval(interval);
  }, [userId, fetchNotificationData]);

  const handleMarkAllAsRead = useCallback(async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (unreadCount === 0) return;
    
    try {
      await dispatch(markAllAsRead()).unwrap();
      console.log("✅ All notifications marked as read");
    } catch (err) {
      console.error("❌ Error marking all as read:", err);
    }
  }, [dispatch, unreadCount]);

  const handleManualRefresh = useCallback((e) => {
    e.stopPropagation();
    fetchNotificationData();
  }, [fetchNotificationData]);

  const handleClick = useCallback(() => {
    navigate(`${basePath}/notifications`);
  }, [navigate, basePath]);

  const isLoading = loading || manualRefresh;

  return (
    <div className="relative inline-flex items-center">
      {/* 🔥 FIX 2: Outer wrapper is a DIV, not a button, to avoid nesting errors */}
      <div
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group cursor-pointer"
      >
        <Bell size={20} className={isLoading ? 'animate-pulse' : ''} />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1.5 border-2 border-white animate-in zoom-in duration-300">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Hover Dropdown */}
        {isHovering && unreadCount > 0 && (
          <div className="absolute top-full right-0 mt-2 bg-white shadow-xl rounded-lg py-2 px-3 text-xs whitespace-nowrap border border-slate-200 z-[100]">
            <div className="flex items-center gap-3">
              <span className="text-slate-700 font-semibold">{unreadCount} unread</span>
              <button
                onClick={handleMarkAllAsRead}
                className="text-blue-600 hover:text-blue-700 text-[10px] font-bold bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
              >
                Mark all read
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manual Refresh (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={handleManualRefresh}
          className="ml-1 p-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-slate-500 transition-colors"
          title="Manual Refresh"
        >
          <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
        </button>
      )}

      <DebugBadge 
        showDebug={showDebug} 
        setShowDebug={setShowDebug} 
        debugInfo={{ userId, unreadCount, loading, lastFetchTime }}
      />
    </div>
  );
}