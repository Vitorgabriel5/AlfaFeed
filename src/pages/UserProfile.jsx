import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import { getProfileByUsername, INITIAL_POSTS } from '../data/socialData';
import { buildProfilePath, normalizeUsername } from '../utils/profileRoutes';
import { getCurrentUser } from '../utils/currentUserStorage';

function UserProfile() {
  const { username } = useParams();
  const currentUser = getCurrentUser();
  const [isFollowing, setIsFollowing] = useState(false);

  const profile = useMemo(() => {
    const isCurrent = normalizeUsername(username) === normalizeUsername(currentUser.username);
    if (isCurrent) return currentUser;
    return getProfileByUsername(username);
  }, [currentUser, username]);

  const userPosts = useMemo(() => {
    if (!profile) return [];
    return INITIAL_POSTS.filter((post) => normalizeUsername(post.username) === normalizeUsername(profile.username));
  }, [profile]);

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
            <img src={profile.avatar} alt={profile.name} className="h-24 w-24 rounded-full border-4 border-white object-cover" />
            {isMe ? (
              <Link to="/perfil" className="text-sm font-semibold px-4 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100">
                Editar perfil
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsFollowing((prev) => !prev)}
                className={`text-sm font-semibold px-4 py-2 rounded-lg ${
                  isFollowing ? 'bg-gray-200 text-gray-700' : 'bg-orange-500 text-white'
                }`}
              >
                {isFollowing ? 'Seguindo' : 'Seguir'}
              </button>
            )}
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
            <p className="text-sm text-gray-500">{profile.username}</p>
            <p className="mt-3 text-sm text-gray-700">{profile.bio}</p>
            <p className="mt-2 text-sm text-gray-500">Curso: {profile.course}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(profile.interests || []).map((interest) => (
                <span key={interest} className="text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-semibold">
                  #{interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Posts de {profile.name}</h3>

        {userPosts.length === 0 ? (
          <p className="text-sm text-gray-500">Este usuário ainda não publicou no feed.</p>
        ) : (
          <div className="space-y-3">
            {userPosts.map((post) => (
              <article key={post.id} className="border border-gray-100 rounded-xl p-4">
                <p className="text-sm text-gray-700">{post.text}</p>
                <div className="text-xs text-gray-400 mt-2 flex gap-3">
                  <span>{post.time}</span>
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>
              </article>
            ))}
          </div>
        )}
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
