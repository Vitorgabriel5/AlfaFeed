import { Link } from 'react-router-dom';
import SocialLayout from '../components/SocialLayout';
import { INITIAL_POSTS, SUGGESTIONS, TRENDING } from '../data/socialData';
import { buildProfilePath } from '../utils/profileRoutes';
import { getCurrentUser } from '../utils/currentUserStorage';

function Explore() {
  const currentUser = getCurrentUser();

  return (
    <SocialLayout currentUser={currentUser}>
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h2 className="text-2xl font-bold text-gray-800">Explorar</h2>
        <p className="text-sm text-gray-500 mt-1">Descubra pessoas, assuntos e discussões em alta na Unialfa.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Assuntos em alta</h3>
        <div className="flex flex-wrap gap-2">
          {TRENDING.map((topic) => (
            <button
              type="button"
              key={topic}
              className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-semibold hover:bg-orange-100"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Pessoas sugeridas</h3>
        <div className="space-y-3">
          {SUGGESTIONS.map((person) => (
            <Link
              key={person.id}
              to={buildProfilePath(person.username)}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img src={person.avatar} alt={person.name} className="h-11 w-11 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 truncate">{person.name}</p>
                  <p className="text-xs text-gray-500 truncate">{person.username} • {person.course}</p>
                </div>
              </div>
              <span className="text-xs text-orange-600 font-semibold">Ver perfil</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Posts para descobrir</h3>
        <div className="space-y-3">
          {INITIAL_POSTS.map((post) => (
            <article key={post.id} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <Link to={buildProfilePath(post.username)} className="text-sm font-bold text-gray-800 hover:underline">
                  {post.name}
                </Link>
                <span className="text-xs text-gray-400">{post.time}</span>
              </div>
              <p className="text-sm text-gray-700 mt-2">{post.text}</p>
            </article>
          ))}
        </div>
      </div>
    </SocialLayout>
  );
}

export default Explore;
