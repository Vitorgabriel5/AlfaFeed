import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import { INITIAL_POSTS } from '../data/socialData';
import { buildProfilePath, normalizeUsername } from '../utils/profileRoutes';
import { getCurrentUser, saveCurrentUser } from '../utils/currentUserStorage';

function Profile() {
  const [editing, setEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [draft, setDraft] = useState(currentUser);

  const myPosts = useMemo(
    () => INITIAL_POSTS.filter((post) => normalizeUsername(post.username) === normalizeUsername(currentUser.username)),
    [currentUser.username],
  );

  const handleSave = () => {
    const updatedUser = saveCurrentUser(draft);
    setCurrentUser(updatedUser);
    setDraft(updatedUser);
    setEditing(false);
  };

  return (
    <SocialLayout currentUser={currentUser}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-orange-400 to-red-600" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex items-end justify-between">
            <img src={currentUser.avatar} alt={currentUser.name} className="h-24 w-24 rounded-full border-4 border-white object-cover" />
            <button
              type="button"
              onClick={() => setEditing((prev) => !prev)}
              className="mt-3 text-sm font-semibold px-4 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100"
            >
              {editing ? 'Cancelar' : 'Editar perfil'}
            </button>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-800">{currentUser.name}</h2>
            <p className="text-sm text-gray-500">{currentUser.username}</p>
            <p className="mt-3 text-sm text-gray-700">{currentUser.bio}</p>
            <p className="mt-2 text-sm text-gray-500">Curso: {currentUser.course}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(currentUser.interests || []).map((interest) => (
                <span key={interest} className="text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-semibold">
                  #{interest}
                </span>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600 flex gap-4">
              <span>
                <strong>86</strong> seguidores
              </span>
              <span>
                <strong>42</strong> seguindo
              </span>
              <span>
                <strong>{myPosts.length}</strong> posts
              </span>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl shadow-lg p-5 space-y-3">
          <h3 className="text-lg font-bold text-gray-800">Atualizar informações</h3>
          <input
            type="text"
            value={draft.name || ''}
            onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Nome"
          />
          <input
            type="text"
            value={draft.bio || ''}
            onChange={(event) => setDraft((prev) => ({ ...prev, bio: event.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Bio"
          />
          <input
            type="text"
            value={draft.course || ''}
            onChange={(event) => setDraft((prev) => ({ ...prev, course: event.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Curso"
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
          <Link to={buildProfilePath(currentUser.username)} className="text-sm text-orange-600 font-semibold hover:underline">
            Ver como visitante
          </Link>
        </div>

        {myPosts.length === 0 ? (
          <p className="text-sm text-gray-500">Você ainda não possui posts públicos no feed.</p>
        ) : (
          <div className="space-y-3">
            {myPosts.map((post) => (
              <article key={post.id} className="border border-gray-100 rounded-xl p-4">
                <p className="text-sm text-gray-700">{post.text}</p>
                <p className="text-xs text-gray-400 mt-2">{post.time}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </SocialLayout>
  );
}

export default Profile;
