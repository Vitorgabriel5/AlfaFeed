const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export function getAvatarUrl(pic, userId) {
  if (!pic) return `https://i.pravatar.cc/120?u=${userId}`;
  if (pic.startsWith('/api/files/')) return `${API_BASE_URL.replace('/api', '')}${pic}`;
  if (pic.startsWith('http')) return pic;
  return `${API_BASE_URL.replace('/api', '')}${pic}`;
}

export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL.replace('/api', '')}${path}`;
}