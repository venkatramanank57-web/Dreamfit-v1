import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import {
  fetchNotifications,
  selectNotifications,
  selectUnreadCount
} from '../../features/notification/notificationSlice';

export default function NotificationBell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user from auth state
  const { user } = useSelector((state) => state.auth);
  
  // Get notifications and unread count
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);

  // Get base path based on user role
  const basePath = user?.role === "ADMIN" ? "/admin" : 
                   user?.role === "STORE_KEEPER" ? "/storekeeper" : 
                   "/cuttingmaster";

  // Fetch notifications on mount
  useEffect(() => {
    dispatch(fetchNotifications());
    
    // Optional: Poll every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, 30000);
    
    return () => clearInterval(interval);
  }, [dispatch]);

  // Navigate to notifications page inside dashboard when bell is clicked
  const handleClick = () => {
    navigate(`${basePath}/notifications`);
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}