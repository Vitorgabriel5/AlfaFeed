// src/pages/Explore.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import { TRENDING } from '../data/socialData';
import { buildProfilePath } from '../utils/profileRoutes';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { getAvatarUrl } from '../utils/imageUtils';
import DefaultAvatar from '../components/DefaultAvatar';
import { userService, followService } from '../services';
import { showToast } from '../utils/toast';

function Explore() {
  const { currentUser, isLoading: isUserLoading } = useCurrentUser(true);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [following, setFollowing] = useState({});

  useEffect(() => {
    if (currentUser) {
      loadUsers();
    }
  }, [currentUser]);

  const loadUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      const others = data.filter(u => u.id !== currentUser.id);
      setUsers(others);
      
      const followMap = {};
      others.forEach(u => { followMap[u.id] = u.isFollowing; });
      setFollowing(followMap);
    } catch (error) {
      console.error(error);
      showToast.error('Erro ao carregar usuários');
    }
  };

  const handleFollow = async (userId) => {
    try {
      if (following[userId]) {
        await followService.unfollow(userId);
        setFollowing(prev => ({ ...prev, [userId]: false }));
        showToast.success('Deixou de seguir');
      } else {
        await followService.follow(userId);
        setFollowing(prev => ({ ...prev, [userId]: true }));
        showToast.success('Agora você está seguindo!');
      }
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao seguir usuário');
    }
  };

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.nome.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Explorar</h1>
        </div>
      </div>

      {/* Assuntos em alta */}
      {TRENDING && TRENDING.length > 0 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Assuntos em alta</h3>
          <div className="flex flex-wrap gap-2">
            {TRENDING.map((topic) => (
              <button
                type="button"
                key={topic}
                className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-900 text-orange-600 dark:text-orange-400 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Buscar pessoas */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Buscar pessoas</h3>
        <input
          type="text"
          placeholder="Buscar por nome ou @username..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-800 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 rounded-xl px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              {search ? 'Nenhum usuário encontrado.' : 'Nenhum usuário disponível.'}
            </p>
          )}
          {filtered.map((person) => {
            const avatarUrl = getAvatarUrl(person.profilePicture, person.id);
            
            return (
              <div
                key={person.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
              >
                <Link to={buildProfilePath('@' + person.username)} className="flex items-center gap-3 min-w-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={person.nome}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <DefaultAvatar name={person.username} size="lg" />
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 dark:text-white truncate">{person.nome}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{person.username}</p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => handleFollow(person.id)}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full transition ${
                    following[person.id]
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90'
                  }`}
                >
                  {following[person.id] ? 'Seguindo' : 'Seguir'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </SocialLayout>
  );
}

export default Explore;