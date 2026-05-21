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

const typeIcon = { like: '❤️', follow: '👤', mention: '💬' };

function Notifications() {
  const currentUser = getCurrentUser();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get('/notifications').then(res => setNotifications(res.data)).catch(console.error);
    api.post('/notifications/mark-read').catch(console.error);
  }, []);

  const getAvatar = (n) => {
    if (!n.fromAvatar) return `https://i.pravatar.cc/120?u=${n.fromUserId}`;
    if (n.fromAvatar.startsWith('/api/files/')) return `http://localhost:8080${n.fromAvatar}`;
    return n.fromAvatar;
  };

  return (
    <SocialLayout currentUser={currentUser}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Notificações</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Acompanhe interações recentes com o seu perfil.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5">
        <div className="space-y-3">
          {notifications.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Nenhuma notificação ainda.</p>
          )}
          {notifications.map((n) => (
            <article key={n.id} className={`flex items-center justify-between gap-3 p-3 border rounded-xl transition ${
              !n.read
                ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20'
                : 'border-gray-100 dark:border-gray-700'
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <img src={getAvatar(n)} alt={n.fromUsername} className="h-11 w-11 rounded-full object-cover" />
                  <span className="absolute -bottom-1 -right-1 text-sm">{typeIcon[n.type] || '🔔'}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <Link to={buildProfilePath('@' + n.fromUsername)} className="font-bold hover:text-orange-600">
                    @{n.fromUsername}
                  </Link>{' '}{n.text}
                </p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(n.createdAt)}</span>
            </article>
          ))}
        </div>
      </div>
    </SocialLayout>
  );
}

export default Notifications;