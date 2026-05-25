// src/components/SocialLayout.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { getAvatarUrl } from '../utils/imageUtils';
import DefaultAvatar from './DefaultAvatar';
import { useDarkMode } from '../contexts/DarkModeContext';

function SocialLayout({ children, currentUser, rightContent }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleLogout = () => {
    // Limpar dados do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('alfafeed.currentUser');
    
    // Redirecionar para login
    navigate('/login');
  };

  const avatarUrl = getAvatarUrl(currentUser?.profilePicture, currentUser?.id);
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/feed', label: 'Home', icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
        <path d="M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z"/>
      </svg>
    )},
    { path: '/explore', label: 'Explorar', icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
        <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"/>
      </svg>
    )},
    { path: '/notifications', label: 'Notificações', icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
        <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z"/>
      </svg>
    )},
    { path: '/messages', label: 'Mensagens', icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
        <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"/>
      </svg>
    )},
    { path: '/profile', label: 'Perfil', icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
        <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"/>
      </svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="flex max-w-[1280px] mx-auto">
        {/* SIDEBAR ESQUERDA */}
        <div className="w-[275px] flex flex-col h-screen sticky top-0 px-2">
          <div className="flex-1 flex flex-col">
            {/* Logo */}
            <div className="p-3 mb-1">
              <Link to="/feed" className="inline-flex p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition">
                <div className="w-7 h-7 bg-gradient-to-r from-orange-500 to-red-600 rounded flex items-center justify-center">
                  <span className="text-base font-bold text-white">A</span>
                </div>
              </Link>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-5 px-4 py-3 rounded-full transition ${
                    isActive(item.path)
                      ? 'font-bold'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-900 font-normal'
                  }`}
                >
                  <div className="text-gray-900 dark:text-white">
                    {item.icon}
                  </div>
                  <span className="text-xl text-gray-900 dark:text-white">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Botão Postar */}
            <button
              className="mt-4 bg-[rgb(29,155,240)] hover:bg-[rgb(26,140,216)] text-white font-bold text-[17px] py-3.5 rounded-full transition w-[90%]"
              onClick={() => navigate('/feed')}
            >
              Postar
            </button>
          </div>

          {/* User Menu (Bottom) */}
          <div className="relative mb-4 mt-auto">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 w-full transition"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <DefaultAvatar name={currentUser?.username} size="md" />
              )}
              <div className="flex-1 text-left min-w-0">
                <p className="font-bold text-[15px] text-gray-900 dark:text-white truncate">
                  {currentUser?.nome || currentUser?.username}
                </p>
                <p className="text-[15px] text-gray-500 dark:text-gray-400 truncate">
                  @{currentUser?.username}
                </p>
              </div>
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-gray-900 dark:text-white" fill="currentColor">
                <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
              </svg>
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute bottom-full mb-3 left-0 w-[300px] bg-white dark:bg-black rounded-2xl shadow-[0_0_15px_rgba(101,119,134,0.2)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-gray-200 dark:border-gray-800 overflow-hidden z-50">
                  {/* Sair da conta */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-900 transition font-bold text-[15px] text-gray-900 dark:text-white"
                  >
                    Sair de @{currentUser?.username}
                  </button>
                  
                  <div className="border-t border-gray-200 dark:border-gray-800" />
                  
                  {/* Dark Mode Toggle */}
                  <button
                    onClick={() => {
                      toggleDarkMode();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-900 transition font-bold text-[15px] text-gray-900 dark:text-white flex items-center gap-3"
                  >
                    {darkMode ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>Modo Claro</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        <span>Modo Escuro</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* FEED CENTRAL */}
        <main className="w-[600px] border-x border-gray-200 dark:border-gray-800 min-h-screen">
          {children}
        </main>

        {/* SIDEBAR DIREITA */}
        <div className="flex-1 max-w-[350px] px-8 py-2 hidden lg:block">
          {rightContent || (
            <div className="sticky top-2">
              {/* Barra de Busca */}
              <div className="mb-4">
                <div className="relative">
                  <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="currentColor">
                    <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar"
                    className="w-full bg-gray-100 dark:bg-gray-900 border-0 rounded-full py-3 pl-14 pr-4 text-[15px] focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:ring-2 focus:ring-[rgb(29,155,240)] text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* O que está acontecendo */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden mb-4">
                <h2 className="text-xl font-bold px-4 py-3 text-gray-900 dark:text-white">
                  O que está acontecendo
                </h2>
                <div>
                  {['#AlfaFeed', '#Programação', '#React'].map((trend, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition">
                      <p className="text-[13px] text-gray-500 dark:text-gray-400">Trending in Brasil</p>
                      <p className="font-bold text-[15px] text-gray-900 dark:text-white">{trend}</p>
                      <p className="text-[13px] text-gray-500 dark:text-gray-400">
                        {Math.floor(Math.random() * 10)}K posts
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SocialLayout;