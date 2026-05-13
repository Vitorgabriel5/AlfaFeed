import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Cadastro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const criarConta = (event) => {
    event.preventDefault();
    if (!nome || !email || !senha) return;
    navigate('/profile-setup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            Nova Conta
          </h1>
          <p className="text-gray-500 text-sm mt-2">Junte-se ao AlfaFeed</p>
        </div>

        <form onSubmit={criarConta} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Nome Completo</label>
            <input
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ex: João Silva"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">E-mail da Unialfa</label>
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
            <label className="block text-gray-700 text-sm font-bold mb-2">Crie uma Senha</label>
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
            Cadastrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/" className="text-orange-500 font-bold hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
