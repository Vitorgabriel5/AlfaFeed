import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import { PostSkeleton } from '../components/LoadingSkeleton';
import { timeAgo } from '../utils/dateUtils';
import { getAvatarUrl, getImageUrl } from '../utils/imageUtils';
import { buildProfilePath } from '../utils/profileRoutes';
import { getCurrentUser } from '../utils/currentUserStorage';
import { postService } from '../services';
import { showToast } from '../utils/toast';

function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    loadPost();
    loadComments();
  }, [postId]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const data = await postService.getPostById(postId);
      setPost(data);
    } catch (error) {
      console.error(error);
      showToast.error('Post não encontrado');
      navigate('/feed');
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await postService.getComments(postId);
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await postService.likePost(postId);
      setPost(prev => ({
        ...prev,
        liked: !prev.liked,
        likes: prev.liked ? prev.likes - 1 : prev.likes + 1
      }));
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao curtir post');
    } finally {
      setTimeout(() => setIsLiking(false), 300);
    }
  };

  const handleRepost = async () => {
    try {
      if (post.reposted) {
        await postService.removeRepost(postId);
        setPost(prev => ({
          ...prev,
          reposted: false,
          reposts: Math.max(0, prev.reposts - 1)
        }));
        showToast.success('Repost removido');
      } else {
        await postService.repostPost(postId);
        setPost(prev => ({
          ...prev,
          reposted: true,
          reposts: prev.reposts + 1
        }));
        showToast.success('Post repostado!');
      }
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao repostar');
    }
  };

  const handleAddComment = async () => {
    const content = commentInput.trim();
    if (!content || isCommenting) return;
    
    setIsCommenting(true);
    try {
      const newComment = await postService.addComment(postId, content);
      setComments(prev => [...prev, newComment]);
      setPost(prev => ({ ...prev, comments: prev.comments + 1 }));
      setCommentInput('');
      showToast.success('Comentário adicionado!');
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao adicionar comentário');
    } finally {
      setIsCommenting(false);
    }
  };

  const formatFullDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <SocialLayout currentUser={currentUser}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <PostSkeleton />
        </div>
      </SocialLayout>
    );
  }

  if (!post) {
    return null;
  }

  const isMe = currentUser.username === post.username;
  const profilePath = buildProfilePath('@' + post.username);

  return (
    <SocialLayout currentUser={currentUser}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Header com botão voltar */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Post</h1>
          </div>
        </div>

        {/* Conteúdo do Post */}
        <div className="p-4">
          {/* Informações do autor */}
          <div className="flex items-start gap-3 mb-3">
            <Link to={profilePath}>
              <img 
                src={getAvatarUrl(post.profilePicture, post.userId)} 
                alt={post.username}
                className="h-12 w-12 rounded-full object-cover hover:opacity-90 transition" 
              />
            </Link>
            <div>
              <Link to={profilePath} className="font-bold text-gray-900 dark:text-white hover:underline block">
                {post.username}
              </Link>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                @{post.username}
              </span>
            </div>
          </div>

          {/* Conteúdo do post */}
          <div className="mb-4">
            <p className="text-gray-900 dark:text-gray-100 text-[23px] leading-normal whitespace-pre-wrap break-words">
              {post.content}
            </p>
          </div>

          {/* Imagem do post */}
          {post.imageUrl && (
            <div className="mb-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <img 
                src={getImageUrl(post.imageUrl)} 
                alt="Post"
                className="w-full object-cover" 
              />
            </div>
          )}

          {/* Data e hora */}
          <div className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            {formatFullDate(post.createdAt)}
          </div>

          {/* Estatísticas */}
          <div className="flex items-center gap-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-900 dark:text-white">{post.reposts || 0}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Reposts</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-900 dark:text-white">{post.likes || 0}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Curtidas</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-900 dark:text-white">{post.comments || 0}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Comentários</span>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center justify-around py-2 border-b border-gray-200 dark:border-gray-700">
            {/* Comentar */}
            <button 
              className="group flex items-center justify-center p-3 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>

            {/* Repost */}
            {!isMe && (
              <button 
                onClick={handleRepost}
                className={`group flex items-center justify-center p-3 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors ${post.reposted ? 'text-green-600 dark:text-green-500' : ''}`}
              >
                <svg className={`w-6 h-6 transition-colors ${post.reposted ? 'text-green-600 dark:text-green-500' : 'text-gray-500 dark:text-gray-400 group-hover:text-green-600'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.77 15.67a.749.749 0 0 0-1.06 0l-2.22 2.22V7.65a3.755 3.755 0 0 0-3.75-3.75h-4.5a.75.75 0 0 0 0 1.5h4.5c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22a.749.749 0 1 0-1.06 1.06l3.5 3.5a.747.747 0 0 0 1.06 0l3.5-3.5a.749.749 0 0 0 0-1.06Zm-10.66 3.28H8.5c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22a.752.752 0 0 0 1.062 0 .749.749 0 0 0 0-1.06l-3.5-3.5a.747.747 0 0 0-1.06 0l-3.5 3.5a.749.749 0 1 0 1.06 1.06l2.22-2.22V16.7a3.755 3.755 0 0 0 3.75 3.75h4.61a.75.75 0 0 0 0-1.5Z"/>
                </svg>
              </button>
            )}

            {/* Like */}
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className="group flex items-center justify-center p-3 rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
            >
              {post.liked ? (
                <svg className={`w-6 h-6 text-pink-600 dark:text-pink-500 transition-transform ${isLiking ? 'scale-125' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"/>
                </svg>
              ) : (
                <svg className={`w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-pink-600 transition-colors ${isLiking ? 'scale-125' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>

            {/* Share */}
            <button 
              className="group flex items-center justify-center p-3 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>

          {/* Input de comentário */}
          <div className="py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <img
                src={getAvatarUrl(currentUser.avatar, currentUser.id)}
                alt="Você"
                className="h-12 w-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Escreva sua resposta..."
                  className="w-full min-h-[80px] resize-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-[17px] focus:outline-none"
                  disabled={isCommenting}
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleAddComment}
                    disabled={!commentInput.trim() || isCommenting}
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold px-6 py-2 rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {isCommenting ? 'Respondendo...' : 'Responder'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de comentários */}
          <div>
            {comments.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-[15px]">
                  Nenhuma resposta ainda. Seja o primeiro a responder!
                </p>
              </div>
            )}
            {comments.map(comment => (
              <div key={comment.id} className="py-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex gap-3">
                  <Link to={buildProfilePath('@' + comment.username)}>
                    <img 
                      src={getAvatarUrl(comment.profilePicture, comment.userId)} 
                      alt={comment.username}
                      className="h-10 w-10 rounded-full object-cover hover:opacity-90 transition" 
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <Link to={buildProfilePath('@' + comment.username)} className="font-bold text-gray-900 dark:text-white hover:underline text-[15px]">
                        {comment.username}
                      </Link>
                      <span className="text-gray-500 dark:text-gray-400 text-[15px]">
                        @{comment.username}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-[15px]">·</span>
                      <span className="text-gray-500 dark:text-gray-400 text-[15px]">
                        {timeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100 text-[15px] leading-normal whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SocialLayout>
  );
}

export default PostDetail;