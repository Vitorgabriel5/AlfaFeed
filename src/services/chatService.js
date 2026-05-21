import api from './api';

export const chatService = {
  sendMessage: async (receiverId, content, type = 'text') => {
    const response = await api.post('/chat/send', null, {
      params: { receiverId, content, type }
    });
    return response.data;
  },

  getConversation: async (otherId) => {
    const response = await api.get(`/chat/conversation/${otherId}`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/chat/unread-count');
    return response.data;
  },
};