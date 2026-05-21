// src/utils/currentUserStorage.js
import { userService } from '../services';

export const getCurrentUser = () => {
  const stored = localStorage.getItem('alfafeed.currentUser');
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Erro ao parsear currentUser:', error);
    localStorage.removeItem('alfafeed.currentUser');
    return null;
  }
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('alfafeed.currentUser', JSON.stringify(user));
  }
};

export const updateCurrentUser = async () => {
  try {
    const user = await userService.getCurrentUser();
    setCurrentUser(user);
    return user;
  } catch (error) {
    console.error('Erro ao atualizar currentUser:', error);
    // Se o token expirou, limpar tudo
    if (error.response?.status === 401) {
      clearCurrentUser();
    }
    throw error;
  }
};

export const clearCurrentUser = () => {
  localStorage.removeItem('alfafeed.currentUser');
  localStorage.removeItem('token');
};