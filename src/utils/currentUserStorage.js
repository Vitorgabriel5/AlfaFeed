import { DEFAULT_CURRENT_USER } from '../data/socialData';
import { formatUsername } from './profileRoutes';

const STORAGE_KEY = 'alfafeed.currentUser';

export const getCurrentUser = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_CURRENT_USER;
    }

    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CURRENT_USER,
      ...parsed,
      username: formatUsername(parsed.username || DEFAULT_CURRENT_USER.username),
    };
  } catch {
    return DEFAULT_CURRENT_USER;
  }
};

export const saveCurrentUser = (user) => {
  const nextUser = {
    ...DEFAULT_CURRENT_USER,
    ...user,
    username: formatUsername(user?.username || DEFAULT_CURRENT_USER.username),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  return nextUser;
};
