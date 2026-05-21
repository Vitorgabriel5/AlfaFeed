import api from './api';

export const postService = {
  createPost: async (content, imageUrl = null) => {
    const response = await api.post('/post', null, {
      params: { content, imageUrl }
    });
    return response.data;
  },

  getFeed: async () => {
    const response = await api.get('/post/feed');
    return response.data;
  },

  getMyPosts: async () => {
    const response = await api.get('/post/my');
    return response.data;
  },

  getPostsByUser: async (username) => {
    const response = await api.get(`/post/user/${username}`);
    return response.data;
  },

  likePost: async (postId) => {
    const response = await api.post(`/post/${postId}/like`);
    return response.data;
  },

  repostPost: async (postId) => {
    const response = await api.post(`/post/${postId}/repost`);
    return response.data;
  },

  removeRepost: async (postId) => {
    const response = await api.delete(`/post/${postId}/repost`);
    return response.data;
  },
  
   getPostById: async (postId) => {
    const response = await api.get(`/post/${postId}`);
    return response.data;
  },

  getComments: async (postId) => {
    const response = await api.get(`/post/${postId}/comments`);
    return response.data;
  },

  addComment: async (postId, content) => {
    const response = await api.post(`/post/${postId}/comment`, null, {
      params: { content }
    });
    return response.data;
  },
};