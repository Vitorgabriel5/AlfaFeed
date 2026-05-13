import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const fazerLogin = (event) => {
    event.preventDefault();
    if (!email || !senha) return;
    navigate('/feed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            AlfaFeed
          </h1>
          <p className="text-gray-500 text-sm mt-2">Conecte-se com a sua universidade</p>
        </div>

        <form onSubmit={fazerLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">E-mail do Aluno</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="seu.nome@unialfa.com.br"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition duration-300"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Novo por aqui?{' '}
            <Link to="/cadastro" className="text-orange-500 font-bold hover:underline">
              Crie sua conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
