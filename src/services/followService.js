import api from './api';

export const followService = {
  follow: async (userId) => {
    const response = await api.post(`/follow/${userId}`);
    return response.data;
  },

  unfollow: async (userId) => {
    const response = await api.delete(`/follow/${userId}`);
    return response.data;
  },

  getStats: async (userId) => {
    const response = await api.get(`/follow/${userId}/stats`);
    return response.data;
  },

  getFollowers: async (userId) => {
    const response = await api.get(`/follow/${userId}/followers`);
    return response.data;
  },

  getFollowing: async (userId) => {
    const response = await api.get(`/follow/${userId}/following`);
    return response.data;
  },
};