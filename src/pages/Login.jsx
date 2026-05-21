// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, oauthService, userService } from '../services';
import { showToast } from '../utils/toast';
import { setCurrentUser } from '../utils/currentUserStorage';
import GoogleLoginButton from '../components/GoogleLoginButton';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    // ✅ PASSAR username e password como parâmetros separados
    const response = await authService.login(
      formData.username,
      formData.password
    );
      
       localStorage.setItem('token', response.token);
      
const user = await userService.getCurrentUser();
    setCurrentUser(user);
    
    showToast.success('Login realizado com sucesso!');
    navigate('/feed');
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || 'Usuário ou senha incorretos');
    showToast.error('Erro ao fazer login');
  } finally {
    setIsLoading(false);
  }
};

  const handleGoogleSuccess = async (accessToken) => {
    setIsLoading(true);
    try {
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const userData = await userResponse.json();
      
      const authResponse = await oauthService.loginWithGoogle(accessToken);
      localStorage.setItem('token', authResponse.token);
      
      // Buscar dados completos do usuário
      const user = await userService.getCurrentUser();
      setCurrentUser(user);
      
      showToast.success('Login com Google realizado!');
      navigate('/feed');
    } catch (err) {
      console.error('Erro no Google login:', err);
      showToast.error('Erro ao fazer login com Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl mb-4">
            <span className="text-3xl font-bold text-white">A</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Entre na sua conta para continuar
          </p>
        </div>

        {/* Botão Google */}
        <div className="mb-6">
          <GoogleLoginButton onSuccess={handleGoogleSuccess} />
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Ou continue com email
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Usuário ou Email
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senha
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link 
              to="/forgot-password" 
              className="text-orange-600 dark:text-orange-400 hover:underline font-medium"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Não tem uma conta?{' '}
          <Link to="/cadastro" className="text-orange-600 dark:text-orange-400 hover:underline font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;