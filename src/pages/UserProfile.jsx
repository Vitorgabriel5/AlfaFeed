import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import { buildProfilePath, normalizeUsername } from '../utils/profileRoutes';
import { getCurrentUser } from '../utils/currentUserStorage';
import api from '../services/api';

function UserProfile() {
  const { username } = useParams();
  const currentUser = getCurrentUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users');
        console.log('Username da URL:', username);
        console.log('Usuários:', res.data.map(u => u.username));

        const user = res.data.find(
          u => normalizeUsername(u.username) === normalizeUsername(username)
        );

        console.log('Usuário encontrado:', user);

        if (user) {
          setProfile(user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
    if (!profile) return;
    try {
      if (profile.isFollowing) {
        await api.delete(`/follow/${profile.id}`);
        setProfile(prev => ({ ...prev, isFollowing: false, followers: prev.followers - 1 }));
      } else {
        await api.post(`/follow/${profile.id}`);
        setProfile(prev => ({ ...prev, isFollowing: true, followers: prev.followers + 1 }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getAvatarUrl = () => {
    if (profile?.profilePicture) {
      if (profile.profilePicture.startsWith('/api/files/')) {
        return `http://localhost:8080${profile.profilePicture}`;
      }
      return profile.profilePicture;
    }
    return `https://i.pravatar.cc/120?u=${profile?.id}`;
  };

  if (loading) {
    return (
      <SocialLayout currentUser={currentUser}>
        <p className="text-center text-gray-400 py-10">Carregando...</p>
      </SocialLayout>
    );
  }

  if (!profile) {
    return (
      <SocialLayout currentUser={currentUser}>
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Perfil não encontrado</h2>
          <p className="text-sm text-gray-500 mt-2">O usuário que você tentou acessar não existe ou foi removido.</p>
          <Link to="/feed" className="inline-block mt-4 text-orange-600 font-semibold hover:underline">
            Voltar para o feed
          </Link>
        </div>
      </SocialLayout>
    );
  }

  const isMe = normalizeUsername(profile.username) === normalizeUsername(currentUser.username);

  return (
    <SocialLayout currentUser={currentUser}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-orange-400 to-red-600" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex items-end justify-between">
            <img
              src={getAvatarUrl()}
              alt={profile.nome}
              className="h-24 w-24 rounded-full border-4 border-white object-cover"
            />
            {isMe ? (
              <Link to="/perfil" className="text-sm font-semibold px-4 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100">
                Editar perfil
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleFollow}
                className={`text-sm font-semibold px-4 py-2 rounded-lg ${
                  profile.isFollowing ? 'bg-gray-200 text-gray-700' : 'bg-orange-500 text-white'
                }`}
              >
                {profile.isFollowing ? 'Seguindo' : 'Seguir'}
              </button>
            )}
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-800">{profile.nome}</h2>
            <p className="text-sm text-gray-500">@{profile.username}</p>
            <p className="mt-3 text-sm text-gray-700">{profile.bio || 'Sem bio ainda.'}</p>
            <div className="mt-4 text-sm text-gray-600 flex gap-4">
              <span><strong>{profile.followers}</strong> seguidores</span>
              <span><strong>{profile.following}</strong> seguindo</span>
            </div>
          </div>
        </div>
      </div>

      {!isMe && (
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Conexões rápidas</h3>
          <div className="flex gap-3 text-sm">
            <Link to="/chat" className="px-3 py-2 rounded-lg bg-orange-500 text-white font-semibold">
              Enviar mensagem
            </Link>
            <Link to={buildProfilePath(currentUser.username)} className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold">
              Voltar ao meu perfil
            </Link>
          </div>
        </div>
      )}
    </SocialLayout>
  );
}

export default UserProfile;