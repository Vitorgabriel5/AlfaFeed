// src/pages/Settings.jsx
import { useState } from 'react';
import SocialLayout from '../components/SocialLayout';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useDarkMode } from '../contexts/DarkModeContext';
import { showToast } from '../utils/toast';

function Settings() {
  const { currentUser } = useCurrentUser(true);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  if (!currentUser) {
    return (
      <SocialLayout currentUser={currentUser}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </SocialLayout>
    );
  }

  return (
    <SocialLayout currentUser={currentUser}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Configurações</h1>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {/* Aparência */}
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Aparência</h2>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Modo Escuro</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {darkMode ? 'Tema escuro ativado' : 'Tema claro ativado'}
              </p>
            </div>
            <button
              onClick={() => {
                toggleDarkMode();
                showToast.success(darkMode ? 'Modo claro ativado' : 'Modo escuro ativado');
              }}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                darkMode ? 'bg-[rgb(29,155,240)]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notificações */}
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Notificações</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Push Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receber notificações no app</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                  notifications ? 'bg-[rgb(29,155,240)]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                    notifications ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Email Updates</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receber atualizações por email</p>
              </div>
              <button
                onClick={() => setEmailUpdates(!emailUpdates)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                  emailUpdates ? 'bg-[rgb(29,155,240)]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                    emailUpdates ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Conta */}
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Conta</h2>
          
          <div className="space-y-2">
            <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <p className="font-semibold text-gray-900 dark:text-white">Alterar senha</p>
            </button>
            
            <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <p className="font-semibold text-gray-900 dark:text-white">Privacidade e segurança</p>
            </button>
          </div>
        </div>

        {/* Sobre */}
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Sobre</h2>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">AlfaFeed</span> v1.0.0
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Rede social desenvolvida com React e Spring Boot
            </p>
          </div>
        </div>
      </div>
    </SocialLayout>
  );
}

export default Settings;