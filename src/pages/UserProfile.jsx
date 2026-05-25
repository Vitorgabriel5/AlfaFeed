// src/pages/UserProfile.jsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import PostCard from '../components/PostCard';
import { buildProfilePath, normalizeUsername } from '../utils/profileRoutes';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { getAvatarUrl } from '../utils/imageUtils';
import DefaultAvatar from '../components/DefaultAvatar';
import { userService, postService, followService } from '../services';
import { showToast } from '../utils/toast';

function UserProfile() {
  const { username } = useParams();
  const { currentUser, isLoading: isUserLoading } = useCurrentUser(true);
  
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    }
  }, [username, currentUser]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const users = await userService.getAllUsers();
      const user = users.find(u => normalizeUsername(u.username) === normalizeUsername(username));
      
      if (user) {
        setProfile(user);
        const allPosts = await postService.getFeed();
        setPosts(allPosts.filter(p => p.userId === user.id));
      }
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!profile) return;
    try {
      if (profile.isFollowing) {
        await followService.unfollow(profile.id);
        setProfile(prev => ({ ...prev, isFollowing: false, followers: prev.followers - 1 }));
        showToast.success('Deixou de seguir');
      } else {
        await followService.follow(profile.id);
        setProfile(prev => ({ ...prev, isFollowing: true, followers: prev.followers + 1 }));
        showToast.success('Agora você está seguindo!');
      }
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao seguir usuário');
    }
  };

  const handleLike = async (postId) => {
    try {
      await postService.likePost(postId);
      setPosts(prev => prev.map(p => p.id !== postId ? p :
        { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }));
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao curtir post');
    }
  };

  const handleRepost = async (postId) => {
    try {
      await postService.repostPost(postId);
      setPosts(prev => prev.map(p => p.id !== postId ? p :
        { ...p, reposted: true, reposts: (p.reposts || 0) + 1 }));
      showToast.success('Post repostado!');
    } catch (err) {
      console.error(err);
      showToast.error(err.response?.data?.message || 'Erro ao repostar');
    }
  };

  const handleRemoveRepost = async (postId) => {
    try {
      await postService.removeRepost(postId);
      setPosts(prev => prev.map(p => p.id !== postId ? p :
        { ...p, reposted: false, reposts: Math.max(0, (p.reposts || 0) - 1) }));
      showToast.success('Repost removido');
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao remover repost');
    }
  };

  const toggleComments = async (postId) => {
    const isOpen = openComments[postId];
    setOpenComments(prev => ({ ...prev, [postId]: !isOpen }));
    if (!isOpen && !comments[postId]) {
      try {
        const data = await postService.getComments(postId);
        setComments(prev => ({ ...prev, [postId]: data }));
      } catch (err) {
        console.error(err);
        showToast.error('Erro ao carregar comentários');
      }
    }
  };

  const handleAddComment = async (postId) => {
    const content = commentInput[postId]?.trim();
    if (!content) return;
    
    try {
      const newComment = await postService.addComment(postId, content);
      setComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), newComment] }));
      setCommentInput(prev => ({ ...prev, [postId]: '' }));
      setPosts(prev => prev.map(p => p.id !== postId ? p : { ...p, comments: (p.comments || 0) + 1 }));
      showToast.success('Comentário adicionado!');
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao adicionar comentário');
    }
  };

  if (isUserLoading || !currentUser) {
    return (
      <SocialLayout currentUser={currentUser}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </SocialLayout>
    );
  }

  if (loading) {
    return (
      <SocialLayout currentUser={currentUser}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando perfil...</p>
        </div>
      </SocialLayout>
    );
  }

  if (!profile) {
    return (
      <SocialLayout currentUser={currentUser}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Perfil não encontrado</h2>
          <Link to="/feed" className="inline-block text-orange-600 font-semibold hover:underline">
            Voltar para o feed
          </Link>
        </div>
      </SocialLayout>
    );
  }

  const isMe = normalizeUsername(profile.username) === normalizeUsername(currentUser.username);
  const avatarUrl = getAvatarUrl(profile.profilePicture, profile.id);
  const coverUrl = profile.coverPicture ? `http://localhost:8080${profile.coverPicture}` : null;

  return (
    <SocialLayout currentUser={currentUser}>
      {/* Header do perfil */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="h-32 relative">
          {coverUrl ? (
            <img src={coverUrl} alt="Capa" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-orange-400 to-red-600" />
          )}
        </div>

        <div className="px-6 pb-6">
          <div className="-mt-12 flex items-end justify-between">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile.nome}
                className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md relative z-10"
              />
            ) : (
              <div className="border-4 border-white dark:border-gray-800 rounded-full shadow-md relative z-10">
                <DefaultAvatar name={profile.username} size="2xl" />
              </div>
            )}

            {isMe ? (
              <Link
                to="/profile"
                className="mt-3 text-sm font-semibold px-5 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Editar perfil
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleFollow}
                className={`mt-3 text-sm font-semibold px-5 py-2 rounded-full transition ${
                  profile.isFollowing
                    ? 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90'
                }`}
              >
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

      {/* Botões de ação */}
      {!isMe && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex gap-3">
          <Link
            to="/messages"
            className="flex-1 text-center px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold hover:opacity-90 transition"
          >
            ✉️ Enviar mensagem
          </Link>
          <Link
            to="/profile"
            className="flex-1 text-center px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            Meu perfil
          </Link>
        </div>
      )}

      {/* Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            Posts de {profile.nome}
          </h3>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">
            Este usuário ainda não publicou nada.
          </p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLike={handleLike}
              onRepost={handleRepost}
              onRemoveRepost={handleRemoveRepost}
              onComment={toggleComments}
              openComments={openComments}
              comments={comments}
              commentInput={commentInput}
              setCommentInput={setCommentInput}
              onAddComment={handleAddComment}
            />
          ))
        )}
      </div>
    </SocialLayout>
  );
}

export default UserProfile; 