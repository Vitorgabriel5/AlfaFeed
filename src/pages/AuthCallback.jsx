import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setCurrentUser } from '../utils/currentUserStorage';
import api from '../services/api';
import { showToast } from '../utils/toast';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');

      if (!token) {
        showToast.error('Erro no login com Google');
        navigate('/login');
        return;
      }

      try {
        // Salvar token
        localStorage.setItem('token', token);

        // Buscar dados do usuário
        const res = await api.get('/users/me');
        setCurrentUser(res.data);

        showToast.success('Login realizado com sucesso!');
        navigate('/feed');
      } catch (error) {
        console.error(error);
        showToast.error('Erro ao processar login');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          Processando login com Google...
        </p>
      </div>
    </div>
  );
}

export default AuthCallback;