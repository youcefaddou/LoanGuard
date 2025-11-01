import { useState, useEffect } from "react";
import authService from "../services/authService";

const SimulationResults = ({ loanId, refreshTrigger }) => {
  const [currentScore, setCurrentScore] = useState(null);
  const [simulatedScore, setSimulatedScore] = useState(null);
  const [hasSimulation, setHasSimulation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      if (!loanId) return;

      try {
        // Récupérer l'historique des scores
        const response = await authService.secureRequest(
          `/api/risk/history/${loanId}`
        );

        if (response.ok) {
          const data = await response.json();
          const scores = data.scores || [];

          if (scores.length >= 1) {
            // Le score le plus récent = score actuel du prêt
            setCurrentScore(scores[0]);
            
            // Si refreshTrigger > 0, on a lancé une simulation
            if (refreshTrigger > 0 && scores.length >= 2) {
              setSimulatedScore(scores[0]); // Le plus récent après simulation
              setHasSimulation(true);
            }
          } else {
            // Aucun score, calculer le score actuel
            const calcResponse = await authService.secureRequest(
              `/api/risk/calculate/${loanId}`
            );
            if (calcResponse.ok) {
              const calcData = await calcResponse.json();
              setCurrentScore(calcData);
            }
          }
        }
      } catch (error) {
        console.error("Erreur récupération scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [loanId, refreshTrigger]);

  const getScoreColor = (score) => {
    if (score >= 8) return "text-red-600";
    if (score >= 6) return "text-orange-600";
    return "text-green-600";
  };

  const getBackgroundColor = (score) => {
    if (score >= 8) return "bg-red-100";
    if (score >= 6) return "bg-orange-100";
    return "bg-green-100";
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case "Élevé":
        return "text-red-800";
      case "Moyen":
        return "text-orange-800";
      default:
        return "text-green-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentScore) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Aucun score disponible pour ce prêt
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-8 mb-6">
        {/* Score actuel (toujours affiché) */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Score actuel</p>
          <div className={`w-20 h-20 rounded-full ${getBackgroundColor(currentScore.score)} flex items-center justify-center`}>
            <span className={`text-2xl font-bold ${getScoreColor(currentScore.score)}`}>
              {currentScore.score.toFixed(1)}
            </span>
          </div>
          <p className={`text-sm mt-2 ${getRiskLevelColor(currentScore.riskLevel)}`}>
            Risque {currentScore.riskLevel}
          </p>
        </div>

        {/* Flèche */}
        <div className="text-gray-400">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Score simulé (affiché SEULEMENT après simulation) */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Nouveau score simulé</p>
          {hasSimulation && simulatedScore ? (
            <>
              <div className={`w-20 h-20 rounded-full ${getBackgroundColor(simulatedScore.score)} flex items-center justify-center`}>
                <span className={`text-2xl font-bold ${getScoreColor(simulatedScore.score)}`}>
                  {simulatedScore.score.toFixed(1)}
                </span>
              </div>
              <p className={`text-sm mt-2 ${getRiskLevelColor(simulatedScore.riskLevel)}`}>
                Risque {simulatedScore.riskLevel}
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                <span className="text-3xl font-light text-gray-400">-</span>
              </div>
              <p className="text-sm mt-2 text-gray-500 italic">
                En attente
              </p>
            </>
          )}
        </div>
      </div>

      {!hasSimulation && (
        <p className="text-sm text-gray-500 mt-4">
          Configurez et lancez une simulation pour voir l'impact sur le score
        </p>
      )}
    </div>
  );
};

export default SimulationResults;