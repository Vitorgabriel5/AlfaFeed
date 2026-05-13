import { Link } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import { SUGGESTIONS } from '../data/socialData';
import { buildProfilePath } from '../utils/profileRoutes';
import { getCurrentUser } from '../utils/currentUserStorage';

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'curtiu seu post sobre Matemática Discreta.', username: '@biaads', time: 'agora', type: 'like' },
  { id: 2, text: 'começou a seguir você.', username: '@pedrosz', time: 'há 8 min', type: 'follow' },
  { id: 3, text: 'mencionou você em uma discussão sobre estágio.', username: '@marinac', time: 'há 25 min', type: 'mention' },
];

function Notifications() {
  const currentUser = getCurrentUser();

  return (
    <SocialLayout currentUser={currentUser}>
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h2 className="text-2xl font-bold text-gray-800">Notificações</h2>
        <p className="text-sm text-gray-500 mt-1">Acompanhe interações recentes com o seu perfil.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="space-y-3">
          {MOCK_NOTIFICATIONS.map((notification) => {
            const user = SUGGESTIONS.find((item) => item.username === notification.username);

            return (
              <article key={notification.id} className="flex items-center justify-between gap-3 p-3 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={user?.avatar || 'https://i.pravatar.cc/120?img=9'}
                    alt={notification.username}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <p className="text-sm text-gray-700">
                    <Link to={buildProfilePath(notification.username)} className="font-bold hover:text-orange-600">
                      {notification.username}
                    </Link>{' '}
                    {notification.text}
                  </p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{notification.time}</span>
              </article>
            );
          })}
        </div>
      </div>
    </SocialLayout>
  );
}

export default Notifications;
