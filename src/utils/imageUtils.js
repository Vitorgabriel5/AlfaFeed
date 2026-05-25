export const getAvatarUrl = (profilePicture, userId) => {
  // Se tem foto de perfil, usar ela
  if (profilePicture) {
    // Se começar com /api/files/, adicionar URL do backend
    if (profilePicture.startsWith('/api/files/')) {
      return `http://localhost:8080${profilePicture}`;
    }
    // Se for URL completa, retornar direto
    return profilePicture;
  }
  
  // ✅ Avatar padrão (letra inicial em gradiente)
  return null; // Retorna null para usar avatar padrão no componente
};

export const getPostImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  if (imageUrl.startsWith('/api/files/')) {
    return `http://localhost:8080${imageUrl}`;
  }
  
  return imageUrl;
};

export const getCoverImageUrl = (coverPicture) => {
  if (!coverPicture) return null;
  
  if (coverPicture.startsWith('/api/files/')) {
    return `http://localhost:8080${coverPicture}`;
  }
  
  return coverPicture;
};