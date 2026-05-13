export const normalizeUsername = (username = '') => username.replace('@', '').trim().toLowerCase();

export const formatUsername = (username = '') => {
  if (!username) return '@usuario';
  return username.startsWith('@') ? username : `@${username}`;
};

export const buildProfilePath = (username = '') => `/perfil/${normalizeUsername(username)}`;
