import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const SelectBank = () => {
  const navigate = useNavigate();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Vérifier que l'utilisateur est connecté
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Récupérer les banques depuis les données de connexion
    const banksFromStorage = localStorage.getItem('banksToSelect');
    if (banksFromStorage) {
      setBanks(JSON.parse(banksFromStorage));
      setLoading(false);
    } else {
      // Si pas de banques en attente de sélection, rediriger vers dashboard
      navigate('/dashboard');
    }
  }, [navigate]);

  // Sélection d'une agence
  const handleBankSelection = async (bank) => {
    try {
      setLoading(true);
      
      // Appeler l'API pour sélectionner la banque
      await authService.selectBank(bank.id);
      
      // Nettoyer les données temporaires
      localStorage.removeItem('banksToSelect');
      
      // Rediriger vers le dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur sélection banque:', error);
      setError(error.message || 'Erreur lors de la sélection de la banque');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E0F2FE] to-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-auto p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos agences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2FE] to-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-auto">
        {/* Logo et titre */}
        <div className="text-center pt-8 pb-6 px-8">
          <div className="flex items-center justify-center mb-3">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1E40AF] rounded-xl mr-3">
              <span className="text-white text-lg font-bold">LG</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1E40AF]">LoanGuard</h1>
          </div>
          <p className="text-gray-500 text-sm">Sélectionnez votre agence</p>
        </div>

        {/* Contenu */}
        <div className="px-8 pb-8">
          {error && (
            <div className="mb-6 text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {banks.length === 0 && !error ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Aucune agence trouvée</p>
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Retour à la connexion
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Choisissez votre agence
              </h2>
              
              {banks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => handleBankSelection(bank)}
                  disabled={loading}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-800">
                        {bank.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {bank.address}
                      </p>
                      <p className="text-sm text-gray-500">
                        {bank.city}
                      </p>
                    </div>
                    <div className="text-blue-500 group-hover:text-blue-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Bouton retour */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              ← Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectBank;
