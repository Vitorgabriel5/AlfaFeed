// src/pages/Cadastro.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, oauthService, userService } from '../services';
import { showToast } from '../utils/toast';
import { setCurrentUser } from '../utils/currentUserStorage';
import GoogleLoginButton from '../components/GoogleLoginButton';

function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    username: '',
    email: '',
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

    // Validações
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError('O nome de usuário deve ter pelo menos 3 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      // ✅ REGISTRAR
      const response = await authService.register(formData);
      
      // ✅ SALVAR TOKEN
      localStorage.setItem('token', response.token);
      
      // ✅ BUSCAR DADOS DO USUÁRIO
      const user = await userService.getCurrentUser();
      setCurrentUser(user);
      
      // ✅ SUCESSO
      showToast.success('Conta criada com sucesso!');
      navigate('/feed');
      
    } catch (err) {
      console.error(err);
      
      // Tratar erros específicos
      if (err.response?.status === 409) {
        setError('Este email ou nome de usuário já está em uso');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
      
      showToast.error('Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (accessToken) => {
    setIsLoading(true);
    try {
      // ✅ BUSCAR DADOS DO GOOGLE
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const userData = await userResponse.json();
      
      // ✅ LOGIN COM GOOGLE
      const authResponse = await oauthService.loginWithGoogle(accessToken);
      localStorage.setItem('token', authResponse.token);
      
      // ✅ BUSCAR DADOS COMPLETOS DO USUÁRIO
      const user = await userService.getCurrentUser();
      setCurrentUser(user);
      
      showToast.success('Conta criada com Google!');
      navigate('/feed');
      
    } catch (err) {
      console.error('Erro no Google signup:', err);
      showToast.error('Erro ao criar conta com Google');
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
            Crie sua conta
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Junte-se à comunidade AlfaFeed
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
              Ou cadastre-se com email
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
              Nome completo
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
              required
              disabled={isLoading}
              placeholder="João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome de usuário
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
              required
              disabled={isLoading}
              placeholder="joaosilva"
              minLength={3}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Mínimo 3 caracteres, sem espaços
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
              required
              disabled={isLoading}
              placeholder="joao@exemplo.com"
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
              placeholder="••••••••"
              minLength={6}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Mínimo 6 caracteres
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-orange-600 dark:text-orange-400 hover:underline font-medium">
            Faça login
          </Link>
        </p>

        {/* Termos */}
        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Ao criar uma conta, você concorda com nossos{' '}
          <a href="#" className="text-orange-600 hover:underline">Termos de Serviço</a>
          {' '}e{' '}
          <a href="#" className="text-orange-600 hover:underline">Política de Privacidade</a>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;