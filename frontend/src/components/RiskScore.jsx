import { useState, useEffect } from 'react';
import authService from '../services/authService';

const RiskScore = ({ loanId, refreshTrigger }) => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRiskScore = async () => {
      if (!loanId) return;

      try {
        setLoading(true);
        
        const response = await authService.secureRequest(`/api/risk/calculate/${loanId}`, {
          method: 'GET'
        });

        if (response.ok) {
          const data = await response.json();
          setRiskData(data);
        } else if (response.status === 404) {
          setRiskData(null);
        } else if (response.status === 401) {
          setError('Session expirée, veuillez vous reconnecter');
        } else {
          setError('Erreur lors du calcul du score de risque');
        }
      } catch (erreur) {
        console.error('Erreur calcul risque:', erreur);
        setError('Erreur de connexion');
      } finally {
        setLoading(false);
      }
    };

    fetchRiskScore();
  }, [loanId, refreshTrigger]);

  // Fonction pour déterminer la couleur selon le score
  const getRiskColor = (score) => {
    if (score >= 8) return 'red';
    if (score >= 6) return 'orange';
    if (score >= 4) return 'yellow';
    return 'green';
  };

  // Fonction pour déterminer le libellé du risque
  const getRiskLabel = (score) => {
    if (score >= 8) return 'Risque Élevé';
    if (score >= 6) return 'Risque Moyen';
    if (score >= 4) return 'Risque Faible';
    return 'Risque Très Faible';
  };

  // Fonction pour déterminer les classes CSS selon la couleur
  const getColorClasses = (color) => {
    const colorMap = {
      red: {
        text: 'text-red-600',
        bg: 'bg-red-100',
        badge: 'text-red-800'
      },
      orange: {
        text: 'text-orange-600',
        bg: 'bg-orange-100',
        badge: 'text-orange-800'
      },
      yellow: {
        text: 'text-yellow-600',
        bg: 'bg-yellow-100',
        badge: 'text-yellow-800'
      },
      green: {
        text: 'text-green-600',
        bg: 'bg-green-100',
        badge: 'text-green-800'
      }
    };
    return colorMap[color] || colorMap.orange;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">
          Score de risque
        </h3>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">
          Score de risque
        </h3>
        <div className="text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!riskData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">
          Score de risque
        </h3>
        <div className="text-center text-gray-500">
          Aucune simulation n'a été lancée
        </div>
      </div>
    );
  }

  const score = riskData.score || 0;
  const evolution = riskData.evolution || 0;
  const color = getRiskColor(score);
  const label = getRiskLabel(score);
  const colorClasses = getColorClasses(color);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3">
        Score de risque
      </h3>
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <div className="w-full h-full rounded-full border-8 border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-bold ${colorClasses.text}`}>
                {score.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">/10</div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-3">
        <span className={`px-3 py-1 ${colorClasses.bg} ${colorClasses.badge} rounded-full text-sm font-medium`}>
          {label}
        </span>
        <div className={`text-sm mt-1 ${evolution >= 0 ? 'text-red-600' : 'text-green-600'}`}>
          Évolution: {evolution >= 0 ? '+' : ''}{evolution.toFixed(1)} pts
        </div>
      </div>
    </div>
  );
};

export default RiskScore;
