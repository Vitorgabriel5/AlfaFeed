import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import { buildProfilePath } from '../utils/profileRoutes';
import { getCurrentUser, setCurrentUser as saveToStorage } from '../utils/currentUserStorage';
import api from '../services/api';

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

function Profile() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [coverImage, setCoverImage] = useState(null);
  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    api.get('/users/me').then(res => {
      const user = res.data;
      setProfile(user);
      setDraft({ nome: user.nome, bio: user.bio || '' });
      if (user.coverPicture) setCoverImage(`http://localhost:8080${user.coverPicture}`);
      
      // ✅ CORRIGIDO
      const updated = {
        ...currentUser, 
        id: user.id, 
        name: user.nome,
        username: user.username, 
        bio: user.bio,
        avatar: user.profilePicture ? `http://localhost:8080${user.profilePicture}` : currentUser.avatar,
      };
      saveToStorage(updated);
      setCurrentUser(updated);
    }).catch(console.error);

    api.get('/post/my').then(res => setPosts(res.data)).catch(() => setPosts([]));
  }, []);

  const handleSave = async () => {
    try {
      await api.put('/users/me', draft);
      const res = await api.get('/users/me');
      const user = res.data;
      setProfile(user);
      
      // ✅ CORRIGIDO
      const updated = {
        ...currentUser, 
        name: user.nome, 
        username: user.username, 
        bio: user.bio,
        avatar: user.profilePicture ? `http://localhost:8080${user.profilePicture}` : currentUser.avatar,
      };
      saveToStorage(updated);
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
      
      // ✅ CORRIGIDO
      const updated = {
        ...currentUser, 
        name: user.nome, 
        username: user.username, 
        bio: user.bio,
        avatar: user.profilePicture ? `http://localhost:8080${user.profilePicture}` : currentUser.avatar,
      };
      saveToStorage(updated);
      setCurrentUser(updated);
    } catch (err) { 
      console.error(err); 
      alert('Erro ao enviar imagem'); 
    }
    event.target.value = '';
  };

  const handleUploadCover = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/users/upload-cover', formData);
      setCoverImage(`http://localhost:8080${res.data.coverPicture}`);
    } catch (err) { 
      console.error(err); 
      alert('Erro ao enviar capa'); 
    }
    event.target.value = '';
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/post/${postId}/like`);
      setPosts(prev => prev.map(p => p.id !== postId ? p :
        { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }));
    } catch (err) { console.error(err); }
  };

  const toggleComments = async (postId) => {
    const isOpen = openComments[postId];
    setOpenComments(prev => ({ ...prev, [postId]: !isOpen }));
    if (!isOpen && !comments[postId]) {
      try {
        const res = await api.get(`/post/${postId}/comments`);
        setComments(prev => ({ ...prev, [postId]: res.data }));
      } catch (err) { console.error(err); }
    }
  };

  const handleAddComment = async (postId) => {
    const content = commentInput[postId]?.trim();
    if (!content) return;
    try {
      const res = await api.post(`/post/${postId}/comment?content=${encodeURIComponent(content)}`);
      setComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), res.data] }));
      setCommentInput(prev => ({ ...prev, [postId]: '' }));
      setPosts(prev => prev.map(p => p.id !== postId ? p : { ...p, comments: (p.comments || 0) + 1 }));
    } catch (err) { console.error(err); }
  };

  const getAvatarUrl = () => {
    if (profile?.profilePicture) return `http://localhost:8080${profile.profilePicture}`;
    return `https://i.pravatar.cc/120?u=${profile?.id}`;
  };

  const getImgUrl = (pic, id) => {
    if (!pic) return `https://i.pravatar.cc/120?u=${id}`;
    if (pic.startsWith('/api/files/')) return `http://localhost:8080${pic}`;
    return pic;
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="relative h-32 group cursor-pointer" onClick={() => coverInputRef.current?.click()}>
          {coverImage
            ? <img src={coverImage} alt="Capa" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-r from-orange-400 to-red-600" />
          }
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="text-white text-sm font-semibold">📷 Trocar capa</span>
          </div>
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadCover} />
        </div>

        <div className="px-6 pb-6">
          <div className="-mt-12 flex items-end justify-between">
            <div className="relative group z-10">
              <img src={getAvatarUrl()} alt={profile.nome}
                className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 object-cover cursor-pointer shadow-md"
                onClick={() => fileInputRef.current?.click()} />
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                onClick={() => fileInputRef.current?.click()}>
                <span className="text-white text-xs font-semibold">Trocar foto</span>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadPicture} />
            </div>
            <button type="button" onClick={() => setEditing(prev => !prev)}
              className="mt-3 text-sm font-semibold px-5 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              {editing ? 'Cancelar' : 'Editar perfil'}
            </button>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.nome}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{profile.username}</p>
            {profile.bio && <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{profile.bio}</p>}
            <div className="mt-4 flex gap-6 text-sm">
              <div className="text-center">
                <p className="font-bold text-gray-900 dark:text-white text-lg">{posts.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">posts</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900 dark:text-white text-lg">{profile.followers}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">seguidores</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900 dark:text-white text-lg">{profile.following}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">seguindo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 space-y-3">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Atualizar informações</h3>
          <input type="text" value={draft.nome || ''}
            onChange={e => setDraft(prev => ({ ...prev, nome: e.target.value }))}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Nome" />
          <textarea value={draft.bio || ''}
            onChange={e => setDraft(prev => ({ ...prev, bio: e.target.value }))}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none h-24"
            placeholder="Bio" />
          <button type="button" onClick={handleSave}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-2 px-5 rounded-lg">
            Salvar alterações
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Seus posts</h3>
          <Link to={buildProfilePath('@' + profile.username)}
            className="text-sm text-orange-600 font-semibold hover:underline">
            Ver como visitante
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            Você ainda não publicou nada. Que tal compartilhar algo?
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <article key={post.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                {post.imageUrl && (
                  <img src={`http://localhost:8080${post.imageUrl}`} alt="Post"
                    className="w-full max-h-64 object-cover rounded-lg mb-3" />
                )}
                <p className="text-sm text-gray-800 dark:text-gray-200">{post.content}</p>
                <div className="mt-3 flex items-center gap-5 text-gray-400">
                  <button type="button" onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 text-sm font-medium transition ${post.liked ? 'text-orange-500' : 'hover:text-orange-500'}`}>
                    {post.liked ? '❤️' : '🤍'} {post.likes}
                  </button>
                  <button type="button" onClick={() => toggleComments(post.id)}
                    className={`flex items-center gap-1 text-sm transition ${openComments[post.id] ? 'text-blue-500' : 'hover:text-blue-500'}`}>
                    💬 {post.comments || 0}
                  </button>
                  <span className="text-xs text-gray-400 ml-auto">{timeAgo(post.createdAt)}</span>
                </div>

                {openComments[post.id] && (
                  <div className="mt-3 border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2">
                    {(comments[post.id] || []).map(comment => (
                      <div key={comment.id} className="flex gap-2">
                        <img src={getImgUrl(comment.profilePicture, comment.userId)} alt={comment.username}
                          className="h-7 w-7 rounded-full object-cover flex-shrink-0" />
                        <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-1.5">
                          <span className="font-bold text-xs text-gray-800 dark:text-white">@{comment.username}</span>
                          <p className="text-xs text-gray-700 dark:text-gray-300">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <input type="text" value={commentInput[post.id] || ''}
                        onChange={(e) => setCommentInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                        placeholder="Comentar..."
                        className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white dark:placeholder-gray-400"
                      />
                      <button type="button" onClick={() => handleAddComment(post.id)}
                        disabled={!commentInput[post.id]?.trim()}
                        className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full disabled:opacity-50">
                        Enviar
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </SocialLayout>
  );
}

export default Profile;