// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  // ✅ REMOVIDO: 'Content-Type': 'application/json'
  // O axios vai definir automaticamente baseado no tipo de dados
});

// Interceptor de requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ✅ Apenas define Content-Type como JSON se não for FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expirado ou inválido
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('alfafeed.currentUser');
      
      // Só redireciona se não estiver em rotas públicas
      const publicRoutes = ['/', '/cadastro', '/forgot-password', '/reset'];
      const currentPath = window.location.pathname;
      
      if (!publicRoutes.includes(currentPath)) {
        window.location.href = '/';
      }
    }

    // Erro de rede
    if (!error.response) {
      console.error('Erro de rede:', error);
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };