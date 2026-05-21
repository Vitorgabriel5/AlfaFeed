import api from './api';

export const userService = {
  // Buscar usuário atual (autenticado)
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Buscar todos os usuários
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Buscar usuário por ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Buscar usuário por username
  getUserByUsername: async (username) => {
    const response = await api.get(`/users/username/${username}`);
    return response.data;
  },

  // Atualizar perfil
  updateProfile: async (data) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  // Upload de foto de perfil
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/users/upload-profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};