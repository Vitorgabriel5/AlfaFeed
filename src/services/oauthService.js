import api from './api';

export const oauthService = {
  loginWithGoogle: async (idToken) => {
    const response = await api.post('/auth/oauth/google', {
      provider: 'google',
      idToken: idToken
    });
    return response.data;
  },

  loginWithApple: async (idToken) => {
    const response = await api.post('/auth/oauth/apple', {
      provider: 'apple',
      idToken: idToken
    });
    return response.data;
  }
};