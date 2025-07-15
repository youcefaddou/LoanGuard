import { useState, useEffect } from "react";
import authService from "../services/authService";

const SimulationResults = ({ loanId, refreshTrigger }) => {
  const [currentScore, setCurrentScore] = useState(null);
  const [previousScore, setPreviousScore] = useState(null);
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

          if (scores.length >= 2) {
            setCurrentScore(scores[0]); // Plus récent
            setPreviousScore(scores[1]); // Précédent
          } else if (scores.length === 1) {
            setCurrentScore(scores[0]);
            setPreviousScore({ score: 5.0, riskLevel: "Faible" });
          } else {
            // Aucun score, essayer de calculer
            const calcResponse = await authService.secureRequest(
              `/api/risk/calculate/${loanId}`
            );
            if (calcResponse.ok) {
              const calcData = await calcResponse.json();
              setCurrentScore(calcData);
              setPreviousScore({ score: 5.0, riskLevel: "Faible" });
            }
          }
        } else {
          setCurrentScore(null);
          setPreviousScore(null);
        }
      } catch (error) {
        console.error("Erreur récupération scores:", error);
        setCurrentScore(null);
        setPreviousScore(null);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [loanId, refreshTrigger]);

  const getScoreColor = (score) => {
    if (score >= 8) return "text-red-600";      // Élevé = Rouge
    if (score >= 6) return "text-orange-600";   // Moyen = Orange  
    return "text-green-600";                    // Faible = Vert
  };

  const getBackgroundColor = (score) => {
    if (score >= 8) return "bg-red-100";        // Élevé = Rouge
    if (score >= 6) return "bg-orange-100";     // Moyen = Orange
    return "bg-green-100";                      // Faible = Vert
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case "Élevé":
        return "text-red-800";    // Rouge
      case "Moyen":
        return "text-orange-800"; // Orange
      default:
        return "text-green-800";  // Vert (Faible)
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
        Aucune simulation disponible
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-8 mb-6">
        {/* Score actuel (précédent) */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Score actuel</p>
          <div className={`w-20 h-20 rounded-full ${getBackgroundColor(
            previousScore && previousScore.score ? previousScore.score : 5.0
          )} flex items-center justify-center`}>
            <span
              className={`text-2xl font-bold ${getScoreColor(
                previousScore && previousScore.score ? previousScore.score : 5.0
              )}`}
            >
              {previousScore && previousScore.score ? previousScore.score.toFixed(1) : "5.0"}
            </span>
          </div>
          <p
            className={`text-sm mt-2 ${getRiskLevelColor(
              previousScore && previousScore.riskLevel ? previousScore.riskLevel : "Faible"
            )}`}
          >
            Risque {previousScore && previousScore.riskLevel ? previousScore.riskLevel : "Faible"}
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

        {/* Score simulé (actuel) */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Score simulé</p>
          <div className={`w-20 h-20 rounded-full ${getBackgroundColor(currentScore.score)} flex items-center justify-center`}>
            <span
              className={`text-2xl font-bold ${getScoreColor(currentScore.score)}`}
            >
              {currentScore.score.toFixed(1)}
            </span>
          </div>
          <p
            className={`text-sm mt-2 ${getRiskLevelColor(currentScore.riskLevel)}`}
          >
            Risque {currentScore.riskLevel}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimulationResults;