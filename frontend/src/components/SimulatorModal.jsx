import { useState } from "react";
import authService from "../services/authService";
import LoanSelector from "./LoanSelector";
import EventSimulator from "./EventSimulator";

// Affichage du score et du risque sur une ligne colorée
const SimulationResultInline = ({ result }) => {
  if (!result) return null;
  const { score, riskLevel } = result;
  const getBackgroundColor = (score) => {
    if (score >= 8) return "bg-red-100";
    if (score >= 6) return "bg-orange-100";
    return "bg-green-100";
  };
  const getTextColor = (score) => {
    if (score >= 8) return "text-red-800";
    if (score >= 6) return "text-orange-800";
    return "text-green-800";
  };
  return (
    <p
      className={`w-full rounded-md px-3 py-2 mb-2 font-medium text-center ${getBackgroundColor(
        score
      )} ${getTextColor(score)}`}
      style={{ transition: "background 0.3s" }}
    >
      Score : {score.toFixed(1)} &nbsp;|&nbsp; Risque : {riskLevel}
    </p>
  );
};

const SimulatorModal = ({ isOpen, onClose }) => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);

  if (!isOpen) return null;

  // Fonction appelée après la simulation
  const handleSimulationComplete = async () => {
    if (!selectedLoan) return;
    try {
      const response = await authService.secureRequest(
        `/api/risk/calculate/${selectedLoan}`
      );
      if (response.ok) {
        const data = await response.json();
        setSimulationResult(data);
      } else {
        setSimulationResult(null);
      }
    } catch (err) {
      console.error("Erreur lors de la simulation :", err);
      setSimulationResult(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-blue-800">
          Configuration de la simulation
        </h2>
        {simulationResult && (
          <SimulationResultInline result={simulationResult} />
        )}
        <div className="space-y-6">
          <LoanSelector
            selectedLoan={selectedLoan}
            onLoanSelect={(loanId) => {
              setSelectedLoan(loanId);
              setSimulationResult(null);
            }}
          />
          {selectedLoan && (
            <>
              <EventSimulator
                loanId={selectedLoan}
                hideTitle={true}
                onSimulationComplete={handleSimulationComplete}
              />
            </>
          )}
        </div>
        <div className="flex flex-col gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulatorModal;
