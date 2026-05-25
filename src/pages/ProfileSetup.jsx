// src/pages/ProfileSetup.jsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services';
import { showToast } from '../utils/toast';
import { setCurrentUser } from '../utils/currentUserStorage';
import api from '../services/api';

function ProfileSetup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const usernameWithAt = useMemo(() => {
    if (!username) return '';
    return username.startsWith('@') ? username : `@${username}`;
  }, [username]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, avatar: 'Selecione apenas imagens.' }));
      showToast.error('Selecione apenas imagens');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: 'A imagem deve ter no máximo 5MB.' }));
      showToast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, avatar: '' }));
  };

  const validate = () => {
    const cleanUsername = username.replace('@', '').trim();
    const nextErrors = {};

    if (!cleanUsername) {
      nextErrors.username = 'Informe seu nome de usuário.';
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(cleanUsername)) {
      nextErrors.username = 'Use entre 3 e 20 caracteres (letras, números ou _).';
    }

    // Avatar é opcional
    if (avatarFile && avatarFile.size > 5 * 1024 * 1024) {
      nextErrors.avatar = 'A imagem deve ter no máximo 5MB.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const cleanUsername = username.replace('@', '').trim();

      // 1. Atualizar username
      await api.put('/users/me/username', null, {
        params: { username: cleanUsername }
      });

      // 2. Upload da foto (se houver)
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        await api.post('/users/upload-profile-picture', formData);
      }

      // 3. Buscar dados atualizados do usuário
      const user = await userService.getCurrentUser();
      setCurrentUser(user);

      showToast.success('Perfil configurado com sucesso!');
      navigate('/interests');

    } catch (error) {
      console.error(error);
      
      if (error.response?.status === 409) {
        setErrors({ username: 'Este nome de usuário já está em uso' });
        showToast.error('Nome de usuário já está em uso');
      } else if (error.response?.data?.message) {
        showToast.error(error.response.data.message);
      } else {
        showToast.error('Erro ao atualizar perfil');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/feed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl mb-4">
            <span className="text-3xl">👤</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Configure seu Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Personalize como as pessoas vão te encontrar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <label
              htmlFor="avatar"
              className="relative h-24 w-24 rounded-full border-2 border-dashed border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center cursor-pointer overflow-hidden hover:border-orange-500 transition group"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="text-center">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Foto</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-xs font-semibold">
                  {avatarPreview ? 'Trocar' : 'Adicionar'}
                </span>
              </div>
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG ou JPEG (até 5MB) - Opcional
            </p>
            {errors.avatar && (
              <p className="text-xs text-red-500 dark:text-red-400">{errors.avatar}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome de usuário
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-medium">
                @
              </span>
              <input
                type="text"
                value={username.replace('@', '')}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                placeholder="seuusuario"
                required
                disabled={isLoading}
                minLength={3}
                maxLength={20}
              />
            </div>
            {usernameWithAt && !errors.username && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Seu perfil: <span className="font-semibold text-orange-600 dark:text-orange-400">{usernameWithAt}</span>
              </p>
            )}
            {errors.username && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-2">{errors.username}</p>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              3-20 caracteres • Apenas letras, números e _
            </p>
          </div>

          {/* Botões */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Salvando...' : 'Continuar'}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              disabled={isLoading}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Pular por enquanto
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          Você poderá alterar essas informações depois
        </p>
      </div>
    </div>
  );
}

export default ProfileSetup;