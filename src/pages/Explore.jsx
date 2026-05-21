import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import { TRENDING } from '../data/socialData';
import { buildProfilePath } from '../utils/profileRoutes';
import { getCurrentUser } from '../utils/currentUserStorage';
import api from '../services/api';

function Explore() {
  const currentUser = getCurrentUser();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [following, setFollowing] = useState({});

  useEffect(() => {
    api.get('/users')
      .then(res => {
        const others = res.data.filter(u => u.id !== currentUser.id);
        setUsers(others);
        const followMap = {};
        others.forEach(u => { followMap[u.id] = u.isFollowing; });
        setFollowing(followMap);
      })
      .catch(console.error);
  }, []);

  const handleFollow = async (userId) => {
    try {
      if (following[userId]) {
        await api.delete(`/follow/${userId}`);
        setFollowing(prev => ({ ...prev, [userId]: false }));
      } else {
        await api.post(`/follow/${userId}`);
        setFollowing(prev => ({ ...prev, [userId]: true }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SocialLayout currentUser={currentUser}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Explorar</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Descubra pessoas e discussões em alta na Unialfa.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Assuntos em alta</h3>
        <div className="flex flex-wrap gap-2">
          {TRENDING.map((topic) => (
            <button type="button" key={topic}
              className="px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-semibold hover:bg-orange-100 dark:hover:bg-orange-900/50">
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Buscar pessoas</h3>
        <input
          type="text"
          placeholder="Buscar por nome ou @username..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-xl px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Nenhum usuário encontrado.</p>
          )}
          {filtered.map((person) => (
            <div key={person.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <Link to={buildProfilePath('@' + person.username)} className="flex items-center gap-3 min-w-0">
                <img
                  src={person.profilePicture?.startsWith('/api/files/')
                    ? `http://localhost:8080${person.profilePicture}`
                    : person.profilePicture || `https://i.pravatar.cc/120?u=${person.id}`}
                  alt={person.nome}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 dark:text-white truncate">{person.nome}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{person.username}</p>
                </div>
              </Link>
              <button type="button" onClick={() => handleFollow(person.id)}
                className={`text-xs font-semibold px-4 py-1.5 rounded-full transition ${
                  following[person.id]
                    ? 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                    : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90'
                }`}>
                {following[person.id] ? 'Seguindo' : 'Seguir'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </SocialLayout>
  );
}

export default Explore;