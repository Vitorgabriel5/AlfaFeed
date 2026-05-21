import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import { buildProfilePath, normalizeUsername } from '../utils/profileRoutes';
import { getCurrentUser } from '../utils/currentUserStorage';
import api from '../services/api';

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

function UserProfile() {
  const { username } = useParams();
  const currentUser = getCurrentUser();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users');
        const user = res.data.find(u => normalizeUsername(u.username) === normalizeUsername(username));
        if (user) {
          setProfile(user);
          const postsRes = await api.get('/post/feed');
          setPosts(postsRes.data.filter(p => p.userId === user.id));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
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
    } catch (err) { console.error(err); }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/post/${postId}/like`);
      setPosts(prev => prev.map(p => p.id !== postId ? p :
        { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }));
    } catch (err) { console.error(err); }
  };

  const handleRepost = async (postId) => {
    try {
      await api.post(`/post/${postId}/repost`);
      setPosts(prev => prev.map(p => p.id !== postId ? p :
        { ...p, reposted: true, reposts: (p.reposts || 0) + 1 }));
    } catch (err) { console.error(err); }
  };

  const handleRemoveRepost = async (postId) => {
    try {
      await api.delete(`/post/${postId}/repost`);
      setPosts(prev => prev.map(p => p.id !== postId ? p :
        { ...p, reposted: false, reposts: Math.max(0, (p.reposts || 0) - 1) }));
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

  if (loading) return <SocialLayout currentUser={currentUser}><p className="text-center text-gray-400 py-10">Carregando...</p></SocialLayout>;

  if (!profile) return (
    <SocialLayout currentUser={currentUser}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Perfil não encontrado</h2>
        <Link to="/feed" className="inline-block mt-4 text-orange-600 font-semibold hover:underline">Voltar para o feed</Link>
      </div>
    </SocialLayout>
  );

  const isMe = normalizeUsername(profile.username) === normalizeUsername(currentUser.username);

  return (
    <SocialLayout currentUser={currentUser}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="h-32 relative">
          {profile.coverPicture
            ? <img src={`http://localhost:8080${profile.coverPicture}`} alt="Capa" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-r from-orange-400 to-red-600" />
          }
        </div>

        <div className="px-6 pb-6">
          <div className="-mt-12 flex items-end justify-between">
            <img src={getAvatarUrl()} alt={profile.nome}
              className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md relative z-10" />
            {isMe ? (
              <Link to="/perfil" className="mt-3 text-sm font-semibold px-5 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Editar perfil
              </Link>
            ) : (
              <button type="button" onClick={handleFollow}
                className={`mt-3 text-sm font-semibold px-5 py-2 rounded-full transition ${
                  profile.isFollowing
                    ? 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90'
                }`}>
                {profile.isFollowing ? 'Seguindo' : 'Seguir'}
              </button>
            )}
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

      {!isMe && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex gap-3">
          <Link to="/chat" className="flex-1 text-center px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold hover:opacity-90 transition">
            ✉️ Enviar mensagem
          </Link>
          <Link to={buildProfilePath(currentUser.username)} className="flex-1 text-center px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            Meu perfil
          </Link>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Posts de {profile.nome}</h3>

        {posts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Este usuário ainda não publicou nada.</p>
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
                    className={`flex items-center gap-1 text-sm transition ${post.liked ? 'text-orange-500' : 'hover:text-orange-500'}`}>
                    {post.liked ? '❤️' : '🤍'} {post.likes}
                  </button>
                  <button type="button" onClick={() => toggleComments(post.id)}
                    className={`flex items-center gap-1 text-sm transition ${openComments[post.id] ? 'text-blue-500' : 'hover:text-blue-500'}`}>
                    💬 {post.comments || 0}
                  </button>
                  {!isMe && (
                    <button type="button"
                      onClick={() => post.reposted ? handleRemoveRepost(post.id) : handleRepost(post.id)}
                      className={`flex items-center gap-1 text-sm transition ${post.reposted ? 'text-green-500 hover:text-red-500' : 'hover:text-green-500'}`}>
                      🔁 {post.reposts || 0}
                    </button>
                  )}
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

export default UserProfile;