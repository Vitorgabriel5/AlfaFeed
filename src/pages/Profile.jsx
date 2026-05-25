// src/pages/Profile.jsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import PostCard from '../components/PostCard';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { getAvatarUrl } from '../utils/imageUtils';
import DefaultAvatar from '../components/DefaultAvatar';
import { postService } from '../services';
import { showToast } from '../utils/toast';
import api from '../services/api';

function Profile() {
  const { currentUser, isLoading: isUserLoading, refreshUser } = useCurrentUser(true);
  
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [coverImage, setCoverImage] = useState(null);
  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      loadProfile();
      loadPosts();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    try {
      const res = await api.get('/users/me');
      const user = res.data;
      setProfile(user);
      setDraft({ nome: user.nome, bio: user.bio || '' });
      
      if (user.coverPicture) {
        setCoverImage(`http://localhost:8080${user.coverPicture}`);
      }
    } catch (error) {
      console.error(error);
      showToast.error('Erro ao carregar perfil');
    }
  };

  const loadPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const data = await postService.getMyPosts();
      setPosts(data);
    } catch (error) {
      console.error(error);
      showToast.error('Erro ao carregar posts');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.put('/users/me', draft);
      await loadProfile();
      await refreshUser();
      setEditing(false);
      showToast.success('Perfil atualizado!');
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao salvar alterações');
    }
  };

  const handleUploadPicture = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast.error('Por favor, selecione uma imagem');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await api.post('/users/upload-profile-picture', formData);
      await loadProfile();
      await refreshUser();
      showToast.success('Foto de perfil atualizada!');
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao enviar imagem');
    }
    
    event.target.value = '';
  };

  const handleUploadCover = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast.error('Por favor, selecione uma imagem');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await api.post('/users/upload-cover', formData);
      setCoverImage(`http://localhost:8080${res.data.coverPicture}`);
      showToast.success('Foto de capa atualizada!');
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao enviar capa');
    }
    
    event.target.value = '';
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
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </SocialLayout>
    );
  }

  if (!profile) {
    return (
      <SocialLayout currentUser={currentUser}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando perfil...</p>
        </div>
      </SocialLayout>
    );
  }

  const avatarUrl = getAvatarUrl(profile.profilePicture, profile.id);

  return (
    <SocialLayout currentUser={currentUser}>
      {/* Header do perfil */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        {/* Cover Image */}
        <div className="relative h-48 group cursor-pointer" onClick={() => coverInputRef.current?.click()}>
          {coverImage ? (
            <img src={coverImage} alt="Capa" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-orange-400 to-red-600" />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="text-white text-sm font-semibold">📷 Trocar capa</span>
          </div>
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadCover} />
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex justify-between items-start">
            {/* Avatar */}
            <div className="relative -mt-16 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={profile.nome}
                  className="h-32 w-32 rounded-full border-4 border-white dark:border-black object-cover"
                />
              ) : (
                <div className="border-4 border-white dark:border-black rounded-full">
                  <DefaultAvatar name={profile.username} size="2xl" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-xs font-semibold">Trocar</span>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadPicture} />
            </div>

            {/* Edit Button */}
            <button
              type="button"
              onClick={() => setEditing(prev => !prev)}
              className="mt-3 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-gray-900 transition text-sm"
            >
              {editing ? 'Cancelar' : 'Editar perfil'}
            </button>
          </div>

          {/* User Info */}
          <div className="mt-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.nome}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{profile.username}</p>
            {profile.bio && <p className="mt-3 text-sm text-gray-900 dark:text-white">{profile.bio}</p>}
            
            {/* Stats */}
            <div className="mt-3 flex gap-5 text-sm">
              <div>
                <span className="font-bold text-gray-900 dark:text-white">{posts.length}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">posts</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-white">{profile.followers || 0}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">seguidores</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-white">{profile.following || 0}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">seguindo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={draft.nome || ''}
              onChange={e => setDraft(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-800 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(29,155,240)]"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={draft.bio || ''}
              onChange={e => setDraft(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-800 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(29,155,240)] resize-none h-24"
              placeholder="Conte um pouco sobre você..."
              maxLength={160}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {draft.bio?.length || 0}/160 caracteres
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-[rgb(29,155,240)] hover:bg-[rgb(26,140,216)] text-white font-bold py-2 px-5 rounded-full transition"
          >
            Salvar alterações
          </button>
        </div>
      )}

      {/* Posts Section */}
      <div className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10">
        <div className="px-4 py-3">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Posts</h3>
        </div>
      </div>

      {isLoadingPosts ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="p-10 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            Você ainda não publicou nada
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Que tal compartilhar algo interessante?
          </p>
          <Link
            to="/feed"
            className="inline-block mt-4 text-[rgb(29,155,240)] font-semibold hover:underline"
          >
            Ir para o Feed
          </Link>
        </div>
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
    </SocialLayout>
  );
}

export default Profile;