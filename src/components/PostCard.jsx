import { useState } from 'react';
import { Link } from 'react-router-dom';
import { timeAgo } from '../utils/dateUtils';
import { getAvatarUrl, getImageUrl } from '../utils/imageUtils';
import { buildProfilePath } from '../utils/profileRoutes';
import RepostModal from './RepostModal';
import { useNavigate } from 'react-router-dom';

function PostCard({ 
  post, 
  currentUser, 
  onLike, 
  onRepost, 
  onRemoveRepost, 
  onComment,
  onDelete,
  openComments = {},
  comments = {},
  commentInput = {},
  setCommentInput = () => {},
  onAddComment = () => {},
  showActions = true 
}) {
  const profilePath = buildProfilePath('@' + post.username);
  const isMe = currentUser.username === post.username;
  const postComments = comments[post.id] || [];
  const isCommentsOpen = openComments[post.id];
  
  const [showRepostModal, setShowRepostModal] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const navigate = useNavigate();

  const handleLikeClick = async () => {
    if (isLiking) return;
    setIsLiking(true);
    await onLike(post.id);
    setTimeout(() => setIsLiking(false), 300);
  };
    const handlePostClick = (e) => {
    if (
      e.target.closest('button') || 
      e.target.closest('a') || 
      e.target.closest('input') ||
      e.target.closest('textarea')
    ) {
      return;
    }
    navigate(`/post/${post.id}`);
  };

  const handleRepostClick = () => {
    if (isMe) return;
    setShowRepostModal(true);
  };

  const handleConfirmRepost = async () => {
    if (post.reposted) {
      await onRemoveRepost(post.id);
    } else {
      await onRepost(post.id);
    }
    setShowRepostModal(false);
  };

  const handleCommentSubmit = async () => {
    if (isCommenting) return;
    setIsCommenting(true);
    await onAddComment(post.id);
    setIsCommenting(false);
  };

  return (
    <>
      <article className="border-b border-gray-100 dark:border-gray-700 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
        {post.repostOfId && (
          <div className="flex items-center gap-2 mb-2 ml-12 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.77 15.67a.749.749 0 0 0-1.06 0l-2.22 2.22V7.65a3.755 3.755 0 0 0-3.75-3.75h-4.5a.75.75 0 0 0 0 1.5h4.5c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22a.749.749 0 1 0-1.06 1.06l3.5 3.5a.747.747 0 0 0 1.06 0l3.5-3.5a.749.749 0 0 0 0-1.06Zm-10.66 3.28H8.5c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22a.752.752 0 0 0 1.062 0 .749.749 0 0 0 0-1.06l-3.5-3.5a.747.747 0 0 0-1.06 0l-3.5 3.5a.749.749 0 1 0 1.06 1.06l2.22-2.22V16.7a3.755 3.755 0 0 0 3.75 3.75h4.61a.75.75 0 0 0 0-1.5Z"/>
            </svg>
            <span className="font-semibold">{post.repostByUsername}</span>
            <span>repostou</span>
          </div>
        )}

        <div className="flex gap-3">
          <Link to={profilePath} className="flex-shrink-0">
            <img 
              src={getAvatarUrl(post.profilePicture, post.userId)} 
              alt={post.username}
              className="h-10 w-10 rounded-full object-cover hover:opacity-90 transition" 
            />
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <Link to={profilePath} className="font-bold text-gray-900 dark:text-white hover:underline text-[15px]">
                {post.username}
              </Link>
              <span className="text-gray-500 dark:text-gray-400 text-[15px]">
                @{post.username}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-[15px]">·</span>
              <span className="text-gray-500 dark:text-gray-400 text-[15px] hover:underline">
                {timeAgo(post.createdAt)}
              </span>
            </div>

            <p className="text-gray-900 dark:text-gray-100 mt-0.5 text-[15px] leading-normal whitespace-pre-wrap break-words">
              {post.content}
            </p>

            {post.imageUrl && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img 
                  src={getImageUrl(post.imageUrl)} 
                  alt="Post"
                  className="w-full object-cover max-h-[500px]" 
                />
              </div>
            )}

            {showActions && (
              <div className="mt-3 flex items-center justify-between max-w-[425px] -ml-2">
                {/* Comentários */}
                <button 
                  type="button" 
                  onClick={() => onComment(post.id)}
                  className="group flex items-center gap-1 px-2 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <div className={`p-1.5 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors ${isCommentsOpen ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className={`text-[13px] font-normal group-hover:text-blue-500 transition-colors ${isCommentsOpen ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {post.comments || 0}
                  </span>
                </button>

                {/* Repost */}
                {!isMe && (
                  <button 
                    type="button"
                    onClick={handleRepostClick}
                    className="group flex items-center gap-1 px-2 py-1.5 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    <div className={`p-1.5 rounded-full group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-colors ${post.reposted ? 'text-green-600 dark:text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
                      <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.77 15.67a.749.749 0 0 0-1.06 0l-2.22 2.22V7.65a3.755 3.755 0 0 0-3.75-3.75h-4.5a.75.75 0 0 0 0 1.5h4.5c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22a.749.749 0 1 0-1.06 1.06l3.5 3.5a.747.747 0 0 0 1.06 0l3.5-3.5a.749.749 0 0 0 0-1.06Zm-10.66 3.28H8.5c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22a.752.752 0 0 0 1.062 0 .749.749 0 0 0 0-1.06l-3.5-3.5a.747.747 0 0 0-1.06 0l-3.5 3.5a.749.749 0 1 0 1.06 1.06l2.22-2.22V16.7a3.755 3.755 0 0 0 3.75 3.75h4.61a.75.75 0 0 0 0-1.5Z"/>
                      </svg>
                    </div>
                    <span className={`text-[13px] font-normal group-hover:text-green-600 transition-colors ${post.reposted ? 'text-green-600 dark:text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
                      {post.reposts || 0}
                    </span>
                  </button>
                )}

                {/* Like */}
                <button 
                  type="button" 
                  onClick={handleLikeClick}
                  disabled={isLiking}
                  className="group flex items-center gap-1 px-2 py-1.5 rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                >
                  <div className={`p-1.5 rounded-full group-hover:bg-pink-100 dark:group-hover:bg-pink-900/40 transition-all ${post.liked ? 'text-pink-600 dark:text-pink-500' : 'text-gray-500 dark:text-gray-400'} ${isLiking ? 'scale-125' : ''}`}>
                    {post.liked ? (
                      <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"/>
                      </svg>
                    ) : (
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-[13px] font-normal group-hover:text-pink-600 transition-colors ${post.liked ? 'text-pink-600 dark:text-pink-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {post.likes || 0}
                  </span>
                </button>

                {/* Share */}
                <button 
                  type="button"
                  className="group flex items-center gap-1 px-2 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <div className="p-1.5 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors text-gray-500 dark:text-gray-400">
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                </button>

                {/* Delete (só aparece para posts próprios) */}
                {isMe && onDelete && (
                  <button 
                    type="button"
                    onClick={() => onDelete(post.id)}
                    className="group flex items-center gap-1 px-2 py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-auto"
                  >
                    <div className="p-1.5 rounded-full group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors text-gray-500 dark:text-gray-400 group-hover:text-red-600">
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                  </button>
                )}
              </div>
            )}

            {/* Seção de Comentários */}
            {isCommentsOpen && (
              <div className="mt-4 pt-3 space-y-3">
                {postComments.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                  </p>
                )}
                {postComments.map(comment => (
                  <div key={comment.id} className="flex gap-2">
                    <Link to={buildProfilePath('@' + comment.username)} className="flex-shrink-0">
                      <img 
                        src={getAvatarUrl(comment.profilePicture, comment.userId)} 
                        alt={comment.username}
                        className="h-8 w-8 rounded-full object-cover hover:opacity-90 transition" 
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-3 py-2">
                        <div className="flex items-center gap-1">
                          <Link to={buildProfilePath('@' + comment.username)} className="font-semibold text-sm text-gray-900 dark:text-white hover:underline">
                            {comment.username}
                          </Link>
                          <span className="text-gray-500 dark:text-gray-400 text-xs">
                            · {timeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-[15px] text-gray-900 dark:text-gray-100 mt-0.5 break-words">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Input de comentário */}
                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <img
                    src={getAvatarUrl(currentUser.avatar, currentUser.id)}
                    alt="Você"
                    className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 flex gap-2">
                    <input 
                      type="text"
                      value={commentInput[post.id] || ''}
                      onChange={(e) => setCommentInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => { 
                        if (e.key === 'Enter' && !isCommenting) handleCommentSubmit(); 
                      }}
                      placeholder="Escreva um comentário..."
                      className="flex-1 bg-transparent border-b border-gray-200 dark:border-gray-700 px-0 py-2 text-[15px] focus:outline-none focus:border-orange-500 dark:text-white dark:placeholder-gray-500 transition-colors"
                      disabled={isCommenting}
                    />
                    <button 
                      type="button" 
                      onClick={handleCommentSubmit}
                      disabled={!commentInput[post.id]?.trim() || isCommenting}
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity self-end"
                    >
                      {isCommenting ? 'Enviando...' : 'Comentar'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Modal de Repost */}
       <RepostModal 
        isOpen={showRepostModal}
        onClose={() => setShowRepostModal(false)}
        onConfirm={handleConfirmRepost}
        isReposted={post.reposted}
      />
    </>
  );
}

export default PostCard;