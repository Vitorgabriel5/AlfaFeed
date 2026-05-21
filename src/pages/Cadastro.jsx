// src/pages/Cadastro.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, oauthService } from '../services';
import { isValidEmail, isValidUsername, isValidPassword } from '../utils/validators';
import { showToast } from '../utils/toast';
import GoogleLoginButton from '../components/GoogleLoginButton';

function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpar erro do campo quando começar a digitar
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome || formData.nome.length < 3) {
      newErrors.nome = 'Nome deve ter no mínimo 3 caracteres';
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!isValidUsername(formData.username)) {
      newErrors.username = 'Username deve ter 3-20 caracteres (apenas letras, números e _)';
    }

    if (!isValidPassword(formData.password)) {
      newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        nome: formData.nome,
        email: formData.email,
        username: formData.username,
        password: formData.password
      });

      localStorage.setItem('token', response.token);
      localStorage.setItem('alfafeed.currentUser', JSON.stringify(response.user));
      showToast.success('Cadastro realizado com sucesso!');
      navigate('/feed');
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Erro ao criar conta';
      setErrors({ submit: errorMsg });
      showToast.error(errorMsg);
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
      
      const authResponse = await oauthService.loginWithGoogle(userData.id);
      
      localStorage.setItem('token', authResponse.token);
      localStorage.setItem('alfafeed.currentUser', JSON.stringify({
        id: userData.id,
        username: userData.email.split('@')[0],
        nome: userData.name,
        avatar: userData.picture,
        email: userData.email
      }));
      
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
            Criar conta
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
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
              {errors.submit}
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
              className={`w-full px-4 py-3 border-2 ${errors.nome ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:outline-none focus:border-orange-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors`}
              disabled={isLoading}
            />
            {errors.nome && <p className="mt-1 text-sm text-red-500">{errors.nome}</p>}
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
              className={`w-full px-4 py-3 border-2 ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:outline-none focus:border-orange-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors`}
              disabled={isLoading}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
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
              className={`w-full px-4 py-3 border-2 ${errors.username ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:outline-none focus:border-orange-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors`}
              disabled={isLoading}
            />
            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
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
              className={`w-full px-4 py-3 border-2 ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:outline-none focus:border-orange-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors`}
              disabled={isLoading}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmar senha
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:outline-none focus:border-orange-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors`}
              disabled={isLoading}
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
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
          <Link to="/" className="text-orange-600 dark:text-orange-400 hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;