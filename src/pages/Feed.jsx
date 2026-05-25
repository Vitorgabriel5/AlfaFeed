// src/pages/Feed.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import PostCard from '../components/PostCard';
import { FeedSkeleton } from '../components/LoadingSkeleton';
import { buildProfilePath } from '../utils/profileRoutes';
import { getAvatarUrl } from '../utils/imageUtils';
import { postService, userService, followService } from '../services';
import { showToast } from '../utils/toast';
import ImageUpload from '../components/ImageUpload';
import { useCurrentUser } from '../hooks/useCurrentUser';
import DefaultAvatar from '../components/DefaultAvatar';

function Feed() {
  const { currentUser, isLoading: isUserLoading, refreshUser } = useCurrentUser(true);
  
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [postImage, setPostImage] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadFeed();
      loadSuggestions();
    }
  }, [currentUser]);

  const loadFeed = async () => {
    try {
      setIsLoading(true);
      const data = await postService.getFeed();
      setPosts(data);
    } catch (error) {
      console.error(error);
      showToast.error('Erro ao carregar o feed');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSuggestions = async () => {
    try {
      const users = await userService.getAllUsers();
      const others = users.filter(u => u.id !== currentUser.id && !u.isFollowing).slice(0, 3);
      setSuggestions(others);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreatePost = async () => {
    const content = newPost.trim();
    
    if (!content && !postImage) {
      showToast.error('Escreva algo ou adicione uma imagem');
      return;
    }

    if (content.length > 500) {
      showToast.error('O post não pode ter mais de 500 caracteres');
      return;
    }

    try {
      setIsPosting(true);
      await postService.createPost(content, postImage);
      await loadFeed();
      setNewPost('');
      setPostImage(null);
      showToast.success('Post publicado com sucesso!');
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao publicar post');
    } finally {
      setIsPosting(false);
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

  const handleFollow = async (userId) => {
    try {
      await followService.follow(userId);
      setSuggestions(prev => prev.filter(u => u.id !== userId));
      showToast.success('Agora você está seguindo essa pessoa!');
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao seguir usuário');
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
        <FeedSkeleton />
      </SocialLayout>
    );
  }

  const charCount = newPost.length;
  const maxChars = 500;
  const isNearLimit = charCount > maxChars * 0.8;
  const isOverLimit = charCount > maxChars;

  const avatarUrl = getAvatarUrl(currentUser.profilePicture, currentUser.id);

  return (
    <SocialLayout 
      currentUser={currentUser}
      rightContent={
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Quem seguir</h2>
          <div className="space-y-3">
            {suggestions.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500">Nenhuma sugestão no momento.</p>
            )}
            {suggestions.map((s) => {
              const suggestionAvatarUrl = getAvatarUrl(s.profilePicture, s.id);
              
              return (
                <div key={s.id} className="flex items-center justify-between gap-2">
                  <Link to={buildProfilePath('@' + s.username)} className="flex items-center gap-2 min-w-0 hover:opacity-90">
                    {suggestionAvatarUrl ? (
                      <img 
                        src={suggestionAvatarUrl} 
                        alt={s.nome} 
                        className="h-10 w-10 rounded-full object-cover" 
                      />
                    ) : (
                      <DefaultAvatar name={s.username} size="md" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{s.nome}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{s.username}</p>
                    </div>
                  </Link>
                  <button 
                    type="button" 
                    onClick={() => handleFollow(s.id)}
                    className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90 transition"
                  >
                    Seguir
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      }
    >
      {/* Criar post */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Você" 
              className="h-11 w-11 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <DefaultAvatar name={currentUser.username} size="lg" className="flex-shrink-0" />
          )}
          
          <div className="flex-1">
            <textarea 
              value={newPost} 
              onChange={(e) => setNewPost(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === 'Enter' && e.ctrlKey && !isPosting) handleCreatePost(); 
              }}
              placeholder="O que está acontecendo?"
              className="w-full h-20 resize-none focus:outline-none text-gray-900 dark:text-white bg-transparent placeholder-gray-500 dark:placeholder-gray-400 text-lg"
              disabled={isPosting}
            />
            
            <ImageUpload onImageUploaded={setPostImage} />
            
            <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between items-center mt-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${isOverLimit ? 'text-red-500' : isNearLimit ? 'text-orange-500' : 'text-gray-400'}`}>
                  {charCount > 0 && `${charCount}/${maxChars}`}
                </span>
              </div>
              <button 
                type="button" 
                onClick={handleCreatePost} 
                disabled={(!newPost.trim() && !postImage) || isOverLimit || isPosting}
                className="bg-[rgb(29,155,240)] hover:bg-[rgb(26,140,216)] text-white font-bold py-2 px-5 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPosting ? 'Publicando...' : 'Postar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      {isLoading ? (
        <FeedSkeleton />
      ) : posts.length === 0 ? (
        <div className="p-10 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            Seu feed está vazio
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Siga pessoas para ver posts aqui ou publique algo!
          </p>
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

export default Feed;