import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import { buildProfilePath } from '../utils/profileRoutes';
import { getCurrentUser } from '../utils/currentUserStorage';
import api from '../services/api';

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  return `há ${Math.floor(diff / 86400)}d`;
}

function Notifications() {
  const currentUser = getCurrentUser();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get('/notifications')
      .then(res => setNotifications(res.data))
      .catch(console.error);

    api.post('/notifications/mark-read').catch(console.error);
  }, []);

  return (
    <SocialLayout currentUser={currentUser}>
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h2 className="text-2xl font-bold text-gray-800">Notificações</h2>
        <p className="text-sm text-gray-500 mt-1">Acompanhe interações recentes com o seu perfil.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="space-y-3">
          {notifications.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Nenhuma notificação ainda.</p>
          )}
          {notifications.map((notification) => (
            <article key={notification.id} className="flex items-center justify-between gap-3 p-3 border border-gray-100 rounded-xl">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={notification.fromAvatar || 'https://i.pravatar.cc/120?img=9'}
                  alt={notification.fromUsername}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <p className="text-sm text-gray-700">
                  <Link to={buildProfilePath('@' + notification.fromUsername)} className="font-bold hover:text-orange-600">
                    @{notification.fromUsername}
                  </Link>{' '}
                  {notification.text}
                </p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {timeAgo(notification.createdAt)}
              </span>
            </article>
          ))}
        </div>
      </div>
    </SocialLayout>
  );
}

export default Notifications;