import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import { buildProfilePath } from '../utils/profileRoutes';
import { getCurrentUser, saveCurrentUser } from '../utils/currentUserStorage';
import api from '../services/api';

function Profile() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.get('/users/me')
      .then(res => {
        const user = res.data;
        setProfile(user);
        setDraft({
          nome: user.nome,
          bio: user.bio || '',
        });

        const updated = saveCurrentUser({
          ...currentUser,
          id: user.id,
          name: user.nome,
          username: user.username,
          bio: user.bio,
          avatar: user.profilePicture
            ? `http://localhost:8080${user.profilePicture}`
            : currentUser.avatar,
        });
        setCurrentUser(updated);
      })
      .catch(console.error);

    api.get('/post/my')
      .then(res => setPosts(res.data))
      .catch(() => setPosts([]));
  }, []);

  const handleSave = async () => {
    try {
      await api.put('/users/me', draft);

      const res = await api.get('/users/me');
      const user = res.data;
      setProfile(user);

      const updated = saveCurrentUser({
        ...currentUser,
        name: user.nome,
        username: user.username,
        bio: user.bio,
        avatar: user.profilePicture
          ? `http://localhost:8080${user.profilePicture}`
          : currentUser.avatar,
      });
      setCurrentUser(updated);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar alterações');
    }
  };

  const handleUploadPicture = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/users/upload-profile-picture', formData);
      const user = res.data;
      setProfile(user);

      const updated = saveCurrentUser({
        ...currentUser,
        name: user.nome,
        username: user.username,
        bio: user.bio,
        avatar: user.profilePicture
          ? `http://localhost:8080${user.profilePicture}`
          : currentUser.avatar,
      });
      setCurrentUser(updated);
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar imagem');
    }

    event.target.value = '';
  };

  const getAvatarUrl = () => {
    if (profile?.profilePicture) {
      return `http://localhost:8080${profile.profilePicture}`;
    }
    return `https://i.pravatar.cc/120?u=${profile?.id}`;
  };

  if (!profile) {
    return (
      <SocialLayout currentUser={currentUser}>
        <p className="text-center text-gray-400 py-10">Carregando...</p>
      </SocialLayout>
    );
  }

  return (
    <SocialLayout currentUser={currentUser}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-orange-400 to-red-600" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex items-end justify-between">
            <div className="relative group">
              <img
                src={getAvatarUrl()}
                alt={profile.nome}
                className="h-24 w-24 rounded-full border-4 border-white object-cover cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              />
              <div
                className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-white text-xs font-semibold">Trocar foto</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadPicture}
              />
            </div>
            <button
              type="button"
              onClick={() => setEditing(prev => !prev)}
              className="mt-3 text-sm font-semibold px-4 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100"
            >
              {editing ? 'Cancelar' : 'Editar perfil'}
            </button>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-800">{profile.nome}</h2>
            <p className="text-sm text-gray-500">@{profile.username}</p>
            <p className="mt-3 text-sm text-gray-700">{profile.bio || 'Sem bio ainda.'}</p>
            <div className="mt-4 text-sm text-gray-600 flex gap-4">
              <span><strong>{profile.followers}</strong> seguidores</span>
              <span><strong>{profile.following}</strong> seguindo</span>
              <span><strong>{posts.length}</strong> posts</span>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl shadow-lg p-5 space-y-3">
          <h3 className="text-lg font-bold text-gray-800">Atualizar informações</h3>
          <input
            type="text"
            value={draft.nome || ''}
            onChange={e => setDraft(prev => ({ ...prev, nome: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Nome"
          />
          <input
            type="text"
            value={draft.bio || ''}
            onChange={e => setDraft(prev => ({ ...prev, bio: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Bio"
          />
          <button
            type="button"
            onClick={handleSave}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-2 px-5 rounded-lg"
          >
            Salvar alterações
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Seus posts</h3>
          <Link
            to={buildProfilePath('@' + profile.username)}
            className="text-sm text-orange-600 font-semibold hover:underline"
          >
            Ver como visitante
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-gray-500">Você ainda não possui posts públicos no feed.</p>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <article key={post.id} className="border border-gray-100 rounded-xl p-4">
                <p className="text-sm text-gray-700">{post.content}</p>
                <p className="text-xs text-gray-400 mt-2">{post.createdAt}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </SocialLayout>
  );
}

export default Profile;