// src/pages/PostDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import { postService } from '../services';
import { showToast } from '../utils/toast';
import { getAvatarUrl, getPostImageUrl } from '../utils/imageUtils';
import DefaultAvatar from '../components/DefaultAvatar';
import { useCurrentUser } from '../hooks/useCurrentUser';

function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isLoading: isUserLoading } = useCurrentUser(true);
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadPost();
    }
  }, [postId, currentUser]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const data = await postService.getPostById(postId);
      setPost(data);
      
      // Carregar comentários
      const commentsData = await postService.getComments(postId);
      setComments(commentsData);
    } catch (error) {
      console.error(error);
      showToast.error('Erro ao carregar post');
      navigate('/feed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await postService.likePost(post.id);
      setPost(prev => ({
        ...prev,
        liked: !prev.liked,
        likes: prev.liked ? prev.likes - 1 : prev.likes + 1
      }));
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao curtir post');
    }
  };

  const handleRepost = async () => {
    try {
      await postService.repostPost(post.id);
      setPost(prev => ({
        ...prev,
        reposted: true,
        reposts: (prev.reposts || 0) + 1
      }));
      showToast.success('Post repostado!');
    } catch (err) {
      console.error(err);
      showToast.error(err.response?.data?.message || 'Erro ao repostar');
    }
  };

  const handleRemoveRepost = async () => {
    try {
      await postService.removeRepost(post.id);
      setPost(prev => ({
        ...prev,
        reposted: false,
        reposts: Math.max(0, (prev.reposts || 0) - 1)
      }));
      showToast.success('Repost removido');
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao remover repost');
    }
  };

  const handleAddComment = async () => {
    const content = commentInput.trim();
    if (!content) return;

    try {
      const newComment = await postService.addComment(post.id, content);
      setComments(prev => [...prev, newComment]);
      setCommentInput('');
      setPost(prev => ({ ...prev, comments: (prev.comments || 0) + 1 }));
      showToast.success('Comentário adicionado!');
    } catch (err) {
      console.error(err);
      showToast.error('Erro ao adicionar comentário');
    }
  };

  const formatFullDate = (dateStr) => {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} · ${day}/${month}/${year}`;
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

  if (isLoading) {
    return (
      <SocialLayout currentUser={currentUser}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando post...</p>
        </div>
      </SocialLayout>
    );
  }

  if (!post) {
    return (
      <SocialLayout currentUser={currentUser}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Post não encontrado</p>
        </div>
      </SocialLayout>
    );
  }

  const avatarUrl = getAvatarUrl(post.profilePicture, post.userId);
  const postImageUrl = getPostImageUrl(post.imageUrl);
  const currentUserAvatarUrl = getAvatarUrl(currentUser.profilePicture, currentUser.id);

  return (
    <SocialLayout currentUser={currentUser}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Header com botão voltar */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Post</h1>
        </div>

        {/* Conteúdo do post */}
        <div className="p-6">
          {/* Autor */}
          <div className="flex items-center gap-3 mb-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={post.username}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <DefaultAvatar name={post.username} size="lg" />
            )}
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{post.username}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{post.username}</p>
            </div>
          </div>

          {/* Conteúdo */}
          <p className="text-2xl text-gray-900 dark:text-white mb-4 whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {/* Imagem */}
          {postImageUrl && (
            <img
              src={postImageUrl}
              alt="Post"
              className="w-full rounded-2xl mb-4 max-h-[600px] object-cover"
            />
          )}

          {/* Data/hora */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            {formatFullDate(post.createdAt)}
          </p>

          {/* Estatísticas */}
          <div className="flex items-center gap-6 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-white">{post.reposts || 0}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Reposts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-white">{post.likes || 0}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Curtidas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-white">{post.comments || 0}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Comentários</span>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex items-center justify-around py-3 border-b border-gray-200 dark:border-gray-700">
            {/* Comentar */}
            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>

            {/* Repost */}
            <button
              onClick={post.reposted ? handleRemoveRepost : handleRepost}
              className={`flex items-center gap-2 transition ${
                post.reposted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition ${
                post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <svg className={`w-6 h-6 ${post.liked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Compartilhar */}
            <button className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>

          {/* Input de comentário */}
          <div className="mt-6 flex gap-3">
            {currentUserAvatarUrl ? (
              <img
                src={currentUserAvatarUrl}
                alt="Você"
                className="h-12 w-12 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <DefaultAvatar name={currentUser.username} size="lg" className="flex-shrink-0" />
            )}
            <div className="flex-1">
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleAddComment();
                  }
                }}
                placeholder="Adicione um comentário..."
                className="w-full h-20 resize-none focus:outline-none text-gray-800 dark:text-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-200 dark:border-gray-700 rounded-xl p-3"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleAddComment}
                  disabled={!commentInput.trim()}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-2 px-5 rounded-full hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comentar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de comentários */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          {comments.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Nenhum comentário ainda. Seja o primeiro!
            </p>
          ) : (
            comments.map((comment) => {
              const commentAvatarUrl = getAvatarUrl(comment.profilePicture, comment.userId);
              
              return (
                <div key={comment.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <div className="flex gap-3">
                    {commentAvatarUrl ? (
                      <img
                        src={commentAvatarUrl}
                        alt={comment.username}
                        className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <DefaultAvatar name={comment.username} size="md" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900 dark:text-white">@{comment.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </SocialLayout>
  );
}

export default PostDetail;