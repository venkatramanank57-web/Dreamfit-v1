// Pages/notifications/NotificationsPage.jsx (simplified without pagination)
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Bell,
  Check,
  RefreshCw,
  Trash2,
  CheckCheck,
  Clock,
  Scissors,
  Briefcase,
  CheckCircle
} from 'lucide-react';
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  fetchUnreadCount,
  selectNotifications,
  selectUnreadCount,
  selectNotificationsLoading
} from '../../features/notification/notificationSlice';
import showToast from '../../utils/toast';

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const loading = useSelector(selectNotificationsLoading);

  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    loadNotifications();
  }, [filter, dispatch]);

  useEffect(() => {
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const loadNotifications = () => {
    let readFilter = '';
    if (filter === 'unread') readFilter = 'true';
    if (filter === 'read') readFilter = 'false';
    
    dispatch(fetchNotifications({ 
      limit: 50,
      unreadOnly: readFilter
    }));
  };

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id))
      .unwrap()
      .then(() => {
        showToast.success('Marked as read');
      })
      .catch(() => {
        showToast.error('Failed to mark as read');
      });
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) {
      showToast.info('No unread notifications');
      return;
    }
    if (window.confirm(`Mark all ${unreadCount} notifications as read?`)) {
      dispatch(markAllAsRead())
        .unwrap()
        .then(() => {
          showToast.success('All notifications marked as read');
        })
        .catch(() => {
          showToast.error('Failed to mark all as read');
        });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this notification?')) {
      dispatch(deleteNotification(id))
        .unwrap()
        .then(() => {
          showToast.success('Notification deleted');
        })
        .catch(() => {
          showToast.error('Failed to delete notification');
        });
    }
  };

  const handleRefresh = () => {
    loadNotifications();
    dispatch(fetchUnreadCount());
    showToast.success('Notifications refreshed');
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'work-assigned': return <Briefcase className="text-blue-600" size={20} />;
      case 'work-accepted': return <CheckCircle className="text-green-600" size={20} />;
      case 'tailor-assigned': return <Scissors className="text-orange-600" size={20} />;
      default: return <Bell className="text-slate-600" size={20} />;
    }
  };

  const getNotificationBg = (type, isRead) => {
    if (isRead) return 'bg-white';
    switch(type) {
      case 'work-assigned': return 'bg-blue-50';
      case 'work-accepted': return 'bg-green-50';
      case 'tailor-assigned': return 'bg-orange-50';
      default: return 'bg-slate-50';
    }
  };

  const getNotificationLink = (notification) => {
    if (notification.reference?.workId) {
      return `/${user?.role?.toLowerCase()}/works/${notification.reference.workId}`;
    }
    if (notification.reference?.orderId) {
      return `/${user?.role?.toLowerCase()}/orders/${notification.reference.orderId}`;
    }
    return '#';
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes} min ago`;
      if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">Notifications</h1>
            <p className="text-slate-600">Stay updated with all your activities</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
              title="Refresh"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin text-blue-600' : 'text-slate-600'} />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <CheckCheck size={18} />
                Mark All Read ({unreadCount})
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4 bg-white p-1 rounded-lg inline-flex">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'unread' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'read' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading notifications...</p>
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 ${getNotificationBg(notification.type, notification.read)} hover:bg-slate-50 transition-all`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.read ? 'bg-slate-100' : 'bg-white shadow-sm'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-800 mb-1">
                          {notification.title}
                          {notification.priority === 'high' && !notification.read && (
                            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                              High Priority
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{formatTime(notification.createdAt)}</span>
                          {(notification.reference?.orderId || notification.reference?.workId) && (
                            <>
                              <span>•</span>
                              <Link
                                to={getNotificationLink(notification)}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                                onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                              >
                                View Details
                              </Link>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Mark as read"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Bell size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">No notifications</h3>
            <p className="text-slate-500">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}