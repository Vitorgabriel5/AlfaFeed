import api from './api';

export const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // ✅ ENVIAR COMO JSON BODY
  login: async (username, password) => {
    const response = await api.post('/auth/login', {
      username,
      password
    });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', null, {
      params: { email }
    });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', null, {
      params: { token, newPassword }
    });
    return response.data;
  },
};