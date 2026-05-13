import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
];

function InterestsSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedInterests, setSelectedInterests] = useState([]);

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

  const handleContinue = () => {
    if (!canContinue) return;

    navigate('/feed', {
      state: {
        user: {
          username: location.state?.username ?? '@novoaluno',
          avatarPreview: location.state?.avatarPreview ?? '',
          interests: selectedInterests,
        },
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            Seus Interesses
          </h1>
          <p className="text-gray-600 text-base mt-2 font-semibold">Marque 3 assuntos que te interessam</p>
          <p className="text-xs text-gray-500 mt-1">Selecionados: {selectedInterests.length}/3</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            const disableNew = !isSelected && selectedInterests.length >= 3;

            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                disabled={disableNew}
                className={`px-3 py-2 rounded-full border text-sm font-semibold transition ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-transparent'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400 hover:text-orange-500 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                #{interest}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

export default InterestsSelection;
