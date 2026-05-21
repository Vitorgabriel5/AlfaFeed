import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser as getStoredUser, updateCurrentUser, setCurrentUser } from '../utils/currentUserStorage';

export function useCurrentUser(autoRefresh = false) {
  const [currentUser, setStateUser] = useState(getStoredUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await updateCurrentUser();
      setStateUser(user);
      return user;
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback((userData) => {
    setCurrentUser(userData);
    setStateUser(userData);
  }, []);

  // Auto-refresh ao montar se solicitado
  useEffect(() => {
    if (autoRefresh && currentUser) {
      refreshUser();
    }
  }, [autoRefresh, refreshUser]);

  return { 
    currentUser, 
    isLoading, 
    error, 
    refreshUser,
    updateUser 
  };
}