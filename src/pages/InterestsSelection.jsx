// src/pages/InterestsSelection.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';
import api from '../services/api';

const INTERESTS = [
  'Cinema',
  'Arte',
  'Livros',
  'Jogos',
  'Estudos',
  'Grupo de estudos',
  'Matemática',
  'Psicologia',
  'Tecnologia',
  'Música',
  'Esportes',
  'Fotografia',
  'Programação',
  'Empreendedorismo',
  'Idiomas',
  'Carreira',
  'Viagens',
  'Culinária',
  'Moda',
  'Saúde',
];

function InterestsSelection() {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (interest) => {
    const isSelected = selectedInterests.includes(interest);

    if (isSelected) {
      setSelectedInterests((prev) => prev.filter((item) => item !== interest));
      return;
    }

    if (selectedInterests.length < 3) {
      setSelectedInterests((prev) => [...prev, interest]);
    }
  };

  const canContinue = selectedInterests.length === 3;

  const handleContinue = async () => {
    if (!canContinue) return;

    setIsLoading(true);
    try {
      // Salvar interesses no perfil (se você tiver esse campo no backend)
      // Você pode adicionar um campo "interests" na tabela users ou criar uma tabela separada
      await api.put('/users/me', {
        interests: selectedInterests.join(', ')
      });

      showToast.success('Interesses salvos com sucesso!');
      navigate('/feed');
    } catch (error) {
      console.error('Erro ao salvar interesses:', error);
      // Mesmo com erro, permite continuar
      showToast.warning('Não foi possível salvar os interesses, mas você pode continuar');
      navigate('/feed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/feed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl mb-4">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quais são seus interesses?
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base">
            Escolha 3 assuntos que te interessam para personalizar sua experiência
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
              {selectedInterests.length}/3 selecionados
            </span>
          </div>
        </div>

        {/* Grid de interesses */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            const disableNew = !isSelected && selectedInterests.length >= 3;

            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                disabled={disableNew}
                className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all transform hover:scale-105 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-transparent shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 hover:text-orange-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                }`}
              >
                #{interest}
              </button>
            );
          })}
        </div>

        {/* Interesses selecionados */}
        {selectedInterests.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Seus interesses:
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-semibold rounded-full"
                >
                  #{interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue || isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Salvando...' : 'Continuar para o AlfaFeed'}
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

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          Você poderá alterar seus interesses depois nas configurações
        </p>
      </div>
    </div>
  );
}

export default InterestsSelection;