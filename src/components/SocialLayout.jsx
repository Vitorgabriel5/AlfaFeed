import { useEffect, useState } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { TRENDING } from '../data/socialData';
import api from '../services/api';

function useTheme() {
  const [dark, setDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return { dark, toggleTheme: () => setDark(prev => !prev) };
}

function SocialLayout({ currentUser, children, rightContent }) {
  const location = useLocation();
  const { dark, toggleTheme } = useTheme();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchCounts = () => {
      api.get('/notifications/unread-count')
        .then(res => setUnreadNotifications(res.data.count))
        .catch(console.error);
      api.get('/chat/unread-count')
        .then(res => setUnreadMessages(res.data.count))
        .catch(console.error);
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location.pathname === '/notificacoes') setUnreadNotifications(0);
    if (location.pathname === '/chat') setUnreadMessages(0);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/perfil') return !!matchPath('/perfil/*', location.pathname);
    return location.pathname === path;
  };

  const NAV_ITEMS = [
    { label: 'Home', path: '/feed', icon: '🏠' },
    { label: 'Explorar', path: '/explorar', icon: '🔎' },
    { label: 'Notificações', path: '/notificacoes', icon: '🔔', count: unreadNotifications },
    { label: 'Mensagens', path: '/chat', icon: '✉️', count: unreadMessages },
    { label: 'Perfil', path: '/perfil', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            AlfaFeed
          </h1>
          <button
            type="button"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-lg"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-12 gap-6">
        {/* Sidebar esquerda */}
        <aside className="col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 h-fit sticky top-24">
          <Link to="/perfil" className="flex items-center gap-3 pb-5 border-b border-gray-100 dark:border-gray-700">
            <img
              src={
                currentUser.avatar && currentUser.avatar.startsWith('/api/files/')
                  ? `http://localhost:8080${currentUser.avatar}`
                  : currentUser.avatar || `https://i.pravatar.cc/120?u=${currentUser.id}`
              }
              alt="Avatar do usuário"
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white">{currentUser.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser.username}</p>
            </div>
          </Link>

          <nav className="mt-5 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition ${
                  isActive(item.path)
                    ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  {item.label}
                </div>
                {item.count > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {item.count > 99 ? '99+' : item.count}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="col-span-6 space-y-4">{children}</section>

        {/* Sidebar direita */}
        <aside className="col-span-3 space-y-4">
          {rightContent || (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Trending topics</h2>
              <ul className="space-y-2">
                {TRENDING.map((topic) => (
                  <li key={topic} className="text-sm text-gray-700 dark:text-gray-300 font-semibold hover:text-orange-500 cursor-pointer">
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