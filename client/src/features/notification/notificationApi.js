import api from '../../app/axios';

// Get all notifications for the current user
export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    // Ensure we always return an array
    return {
      success: true,
      data: Array.isArray(response.data) ? response.data : 
            (response.data?.data ? response.data.data : [])
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || 'Failed to fetch notifications'
    };
  }
};

// Mark a specific notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to mark notification as read'
    };
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.patch('/notifications/read-all');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to mark all as read'
    };
  }
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete notification'
    };
  }
};

// Get unread count
export const getUnreadCount = async () => {
  try {
    const response = await api.get('/notifications/unread-count');
    return {
      success: true,
      count: response.data?.count || 0
    };
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return {
      success: false,
      count: 0,
      error: error.response?.data?.message || 'Failed to fetch unread count'
    };
  }
};