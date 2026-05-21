import api from './api';

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.post('/notifications/mark-read');
    return response.data;
  },
};