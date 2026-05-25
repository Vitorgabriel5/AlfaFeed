import { Link } from 'react-router-dom';
import { buildProfilePath } from '../utils/profileRoutes';
import { getAvatarUrl, getPostImageUrl } from '../utils/imageUtils';
import DefaultAvatar from './DefaultAvatar'; // ✅ IMPORTAR

function PostCard({ 
  post, 
  currentUser, 
  onLike, 
  onRepost,
  onRemoveRepost,
  onComment,
  openComments,
  comments,
  commentInput,
  setCommentInput,
  onAddComment 
}) {
  
  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'agora';
    if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const avatarUrl = getAvatarUrl(post.profilePicture, post.userId);
  const postImageUrl = getPostImageUrl(post.imageUrl);

  return (
    <article className="border-b border-gray-100 dark:border-gray-700 last:border-0 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer">
      <div className="flex gap-3">
        {/* ✅ Avatar com fallback */}
        <Link to={buildProfilePath('@' + post.username)} className="flex-shrink-0">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={post.username} 
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <DefaultAvatar name={post.username} size="lg" />
          )}
        </Link>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <Link to={buildProfilePath('@' + post.username)} className="min-w-0">
              <p className="font-bold text-gray-900 dark:text-white truncate hover:underline">
                {post.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                @{post.username} · {timeAgo(post.createdAt)}
              </p>
            </Link>
          </div>

          {/* Conteúdo */}
          <p className="mt-2 text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {/* Imagem do post */}
          {postImageUrl && (
            <img
              src={postImageUrl}
              alt="Post"
              className="mt-3 w-full max-h-96 object-cover rounded-2xl"
            />
          )}

          {/* Botões de ação */}
          <div className="mt-3 flex items-center gap-6 text-gray-500 dark:text-gray-400">
            {/* Comentários */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onComment?.(post.id);
              }}
              className={`flex items-center gap-1 text-sm transition group ${
                openComments?.[post.id] ? 'text-blue-500' : 'hover:text-blue-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-medium">{post.comments || 0}</span>
            </button>

            {/* Repost */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (post.reposted) {
                  onRemoveRepost?.(post.id);
                } else {
                  onRepost?.(post.id);
                }
              }}
              className={`flex items-center gap-1 text-sm transition ${
                post.reposted ? 'text-green-500' : 'hover:text-green-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-medium">{post.reposts || 0}</span>
            </button>

            {/* Like */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLike?.(post.id);
              }}
              className={`flex items-center gap-1 text-sm transition ${
                post.liked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              <svg className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-medium">{post.likes || 0}</span>
            </button>

            {/* Compartilhar */}
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-sm hover:text-orange-500 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>

          {/* Seção de comentários */}
          {openComments?.[post.id] && (
            <div className="mt-4 space-y-3 border-t border-gray-100 dark:border-gray-700 pt-3">
              {/* Lista de comentários */}
              {comments?.[post.id]?.map((comment) => {
                const commentAvatarUrl = getAvatarUrl(comment.profilePicture, comment.userId);
                
                return (
                  <div key={comment.id} className="flex gap-2">
                    {commentAvatarUrl ? (
                      <img
                        src={commentAvatarUrl}
                        alt={comment.username}
                        className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <DefaultAvatar name={comment.username} size="sm" />
                    )}
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-2xl px-3 py-2">
                      <p className="font-bold text-sm text-gray-900 dark:text-white">
                        @{comment.username}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Input de novo comentário */}
              <div className="flex gap-2">
                {currentUser && (
                  <>
                    {getAvatarUrl(currentUser.profilePicture, currentUser.id) ? (
                      <img
                        src={getAvatarUrl(currentUser.profilePicture, currentUser.id)}
                        alt="Você"
                        className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <DefaultAvatar name={currentUser.username} size="sm" />
                    )}
                  </>
                )}
                <input
                  type="text"
                  value={commentInput?.[post.id] || ''}
                  onChange={(e) => setCommentInput?.({ ...commentInput, [post.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onAddComment?.(post.id);
                    }
                  }}
                  placeholder="Escreva um comentário..."
                  className="flex-1 bg-gray-100 dark:bg-gray-700 border-0 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white dark:placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => onAddComment?.(post.id)}
                  disabled={!commentInput?.[post.id]?.trim()}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold px-4 py-2 rounded-full hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Enviar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default PostCard;