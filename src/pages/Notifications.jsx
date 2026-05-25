// src/pages/Notifications.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import { buildProfilePath } from '../utils/profileRoutes';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { getAvatarUrl } from '../utils/imageUtils';
import DefaultAvatar from '../components/DefaultAvatar';
import api from '../services/api';
import { showToast } from '../utils/toast';

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  return `há ${Math.floor(diff / 86400)}d`;
}

const typeIcon = { like: '❤️', follow: '👤', mention: '💬', comment: '💬', repost: '🔄' };

function Notifications() {
  const { currentUser, isLoading: isUserLoading } = useCurrentUser(true);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    }
  }, [currentUser]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data);
      
      await api.post('/notifications/mark-read');
    } catch (error) {
      console.error(error);
      showToast.error('Erro ao carregar notificações');
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading || !currentUser) {
    return (
      <SocialLayout currentUser={currentUser}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </SocialLayout>
    );
  }

  return (
    <SocialLayout currentUser={currentUser}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Notificações</h1>
        </div>
      </div>

      {/* Notificações */}
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando notificações...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-10 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            Nenhuma notificação ainda
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Quando alguém interagir com você, aparecerá aqui!
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {notifications.map((n) => {
            const avatarUrl = getAvatarUrl(n.fromAvatar, n.fromUserId);
            
            return (
              <article
                key={n.id}
                className={`flex items-center gap-3 p-4 transition hover:bg-gray-50 dark:hover:bg-gray-900 ${
                  !n.read ? 'bg-orange-50 dark:bg-orange-900/10' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={n.fromUsername}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <DefaultAvatar name={n.fromUsername} size="lg" />
                  )}
                  <span className="absolute -bottom-1 -right-1 text-base">
                    {typeIcon[n.type] || '🔔'}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <Link
                      to={buildProfilePath('@' + n.fromUsername)}
                      className="font-bold hover:text-orange-600 dark:hover:text-orange-400"
                    >
                      @{n.fromUsername}
                    </Link>{' '}
                    {n.text}
                  </p>
                  <span className="text-xs text-gray-400">{timeAgo(n.createdAt)}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </SocialLayout>
  );
}

export default Notifications;