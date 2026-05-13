import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileSetup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [errors, setErrors] = useState({});

  const usernameWithAt = useMemo(() => {
    if (!username) return '';
    return username.startsWith('@') ? username : `@${username}`;
  }, [username]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, avatar: 'Selecione apenas imagens.' }));
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: 'A imagem deve ter no máximo 3MB.' }));
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, avatar: '' }));
  };

  const validate = () => {
    const cleanUsername = username.replace('@', '').trim();
    const nextErrors = {};

    if (!avatarFile) {
      nextErrors.avatar = 'Adicione uma foto de perfil para continuar.';
    }

    if (!cleanUsername) {
      nextErrors.username = 'Informe seu nome de usuário.';
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(cleanUsername)) {
      nextErrors.username = 'Use entre 3 e 20 caracteres (letras, números ou _).';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    navigate('/interesses', {
      state: {
        username: usernameWithAt,
        avatarPreview,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            Seu Perfil
          </h1>
          <p className="text-gray-500 text-sm mt-2">Personalize como seus colegas vão te encontrar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <label
              htmlFor="avatar"
              className="h-24 w-24 rounded-full border-2 border-dashed border-orange-300 bg-orange-50 flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview do avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-gray-500 text-center px-2">Upload da foto</span>
              )}
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <p className="text-xs text-gray-500">PNG, JPG ou JPEG (até 3MB)</p>
            {errors.avatar && <p className="text-xs text-red-500">{errors.avatar}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Escolha seu @</label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="seuusuario"
              required
            />
            {usernameWithAt && <p className="text-xs text-gray-500 mt-2">Seu @ ficará: {usernameWithAt}</p>}
            {errors.username && <p className="text-xs text-red-500 mt-2">{errors.username}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition duration-300"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;
