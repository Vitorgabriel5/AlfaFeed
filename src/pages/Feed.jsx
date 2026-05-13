import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import { DEFAULT_CURRENT_USER, INITIAL_POSTS, SUGGESTIONS } from '../data/socialData';
import { buildProfilePath, normalizeUsername } from '../utils/profileRoutes';
import { getCurrentUser, saveCurrentUser } from '../utils/currentUserStorage';

function Feed() {
  const location = useLocation();
  const onboardingUser = location.state?.user;

  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState([]);
  const [following, setFollowing] = useState([]);

  const currentUser = useMemo(() => {
    const saved = getCurrentUser();

    if (!onboardingUser) {
      return saved;
    }

    return {
      ...saved,
      username: onboardingUser.username ?? saved.username,
      avatar: onboardingUser.avatarPreview || saved.avatar,
      interests: onboardingUser.interests || saved.interests,
    };
  }, [onboardingUser]);

  useEffect(() => {
    saveCurrentUser(currentUser);
  }, [currentUser]);

  const handleCreatePost = () => {
    const content = newPost.trim();
    if (!content) return;

    const post = {
      id: Date.now(),
      name: currentUser.name || DEFAULT_CURRENT_USER.name,
      username: currentUser.username,
      avatar: currentUser.avatar,
      text: content,
      time: 'agora',
      likes: 0,
      comments: 0,
      shares: 0,
    };

    setPosts((prev) => [post, ...prev]);
    setNewPost('');
  };

  const handleLike = (postId) => {
    const alreadyLiked = likedPosts.includes(postId);
    setLikedPosts((prev) => (alreadyLiked ? prev.filter((id) => id !== postId) : [...prev, postId]));
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          likes: alreadyLiked ? Math.max(0, post.likes - 1) : post.likes + 1,
        };
      }),
    );
  };

  const handleFollowToggle = (userId) => {
    setFollowing((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  return (
    <SocialLayout
      currentUser={currentUser}
      rightContent={
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Quem seguir</h2>
          <div className="space-y-3">
            {SUGGESTIONS.map((suggestion) => {
              const isFollowing = following.includes(suggestion.id);

              return (
                <div key={suggestion.id} className="flex items-center justify-between gap-2">
                  <Link to={buildProfilePath(suggestion.username)} className="flex items-center gap-2 min-w-0 hover:opacity-90">
                    <img src={suggestion.avatar} alt={suggestion.name} className="h-10 w-10 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{suggestion.name}</p>
                      <p className="text-xs text-gray-500 truncate">{suggestion.username} • {suggestion.course}</p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleFollowToggle(suggestion.id)}
                    className={`text-xs font-bold px-3 py-1 rounded-full transition ${
                      isFollowing ? 'bg-gray-200 text-gray-700' : 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                    }`}
                  >
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      }
    >
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <textarea
          value={newPost}
          onChange={(event) => setNewPost(event.target.value)}
          placeholder="Compartilhe algo com a galera da sua universidade..."
          className="w-full h-28 border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleCreatePost}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition"
          >
            Publicar
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => {
          const isLiked = likedPosts.includes(post.id);
          const profilePath = buildProfilePath(post.username);

          return (
            <article key={post.id} className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-start gap-3">
                <Link to={profilePath}>
                  <img src={post.avatar} alt={post.name} className="h-11 w-11 rounded-full object-cover" />
                </Link>

                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link to={profilePath} className="font-bold text-gray-800 hover:underline">
                        {post.name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        <Link to={profilePath} className="hover:text-orange-600">
                          {post.username}
                        </Link>{' '}
                        • {post.time}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-3">{post.text}</p>

                  <div className="mt-4 flex items-center gap-5 text-sm text-gray-500 font-medium">
                    <button
                      type="button"
                      onClick={() => handleLike(post.id)}
                      className={`hover:text-orange-500 transition ${isLiked ? 'text-orange-500' : ''}`}
                    >
                      ❤️ Curtir ({post.likes})
                    </button>
                    <button type="button" className="hover:text-orange-500 transition">
                      💬 Comentar ({post.comments})
                    </button>
                    <button type="button" className="hover:text-orange-500 transition">
                      🔁 Compartilhar ({post.shares})
                    </button>
                    {normalizeUsername(post.username) !== normalizeUsername(currentUser.username) && (
                      <Link to={profilePath} className="text-orange-500 hover:underline">
                        Ver perfil
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SocialLayout>
  );
}

export default Feed;
