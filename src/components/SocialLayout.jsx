import { Link, matchPath, useLocation } from 'react-router-dom';
import { TRENDING } from '../data/socialData';

const NAV_ITEMS = [
  { label: 'Home', path: '/feed', icon: '🏠' },
  { label: 'Explorar', path: '/explorar', icon: '🔎' },
  { label: 'Notificações', path: '/notificacoes', icon: '🔔' },
  { label: 'Mensagens', path: '/chat', icon: '✉️' },
  { label: 'Perfil', path: '/perfil', icon: '👤' },
];

function SocialLayout({ currentUser, children, rightContent }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/perfil') {
      return !!matchPath('/perfil/*', location.pathname);
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
          AlfaFeed
        </h1>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-12 gap-6">
        <aside className="col-span-3 bg-white rounded-2xl shadow-lg p-5 h-fit sticky top-24">
          <Link to="/perfil" className="flex items-center gap-3 pb-5 border-b border-gray-100">
            <img src={currentUser.avatar} alt="Avatar do usuário" className="h-12 w-12 rounded-full object-cover" />
            <div>
              <h2 className="font-bold text-gray-800">{currentUser.name}</h2>
              <p className="text-sm text-gray-500">{currentUser.username}</p>
            </div>
          </Link>

          <nav className="mt-5 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition ${
                  isActive(item.path)
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-500'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="col-span-6 space-y-4">{children}</section>

        <aside className="col-span-3 space-y-4">
          {rightContent || (
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Trending topics</h2>
              <ul className="space-y-2">
                {TRENDING.map((topic) => (
                  <li key={topic} className="text-sm text-gray-700 font-semibold hover:text-orange-500 cursor-pointer">
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default SocialLayout;
