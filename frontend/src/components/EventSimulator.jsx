import { useState } from "react";
import authService from "../services/authService";

const EventSimulator = ({ loanId, onSimulationComplete, hideTitle }) => {
  const [eventType, setEventType] = useState("weather");
  const [parameters, setParameters] = useState({
    type: "canicule",
    intensity: 1.5,
  });
  const [loading, setLoading] = useState(false);

  // Fonction pour initialiser les paramètres selon le type d'événement
  const handleEventTypeChange = (newEventType) => {
    setEventType(newEventType);
    switch (newEventType) {
      case "weather":
        setParameters({ type: "canicule", intensity: 1.5 });
        break;
      case "economic":
        setParameters({ type: "recession_sectorielle", severity: 1.0 });
        break;
      case "regulatory":
        setParameters({ type: "nouvelle_reglementation", severity: 1.0 });
        break;
      default:
        setParameters({});
    }
  };

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const response = await authService.secureRequest(
        `/api/simulation/run/${loanId}`,
        {
          method: "POST",
          body: JSON.stringify({ eventType, parameters }),
        }
      );

      if (response.ok) {
        // Déclencher le rafraîchissement du RiskScore
        if (onSimulationComplete) {
          onSimulationComplete();
        }
      } else {
        console.error("Erreur simulation");
      }
    } catch (err) {
      console.error("Erreur lors de l'appel à l'API", err);
    } finally {
      setLoading(false);
    }
  };
  const renderParameters = () => {
    switch (eventType) {
      case "weather":
        return (
          <div className="space-y-2">
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={parameters.type || "canicule"}
              onChange={(e) =>
                setParameters({
                  type: e.target.value,
                  intensity: parameters.intensity || 1.5,
                })
              }
            >
              <option value="canicule">Canicule</option>
              <option value="inondation">Inondation</option>
              <option value="gel">Gel</option>
            </select>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={parameters.intensity || 1.5}
              className="w-full"
              onChange={(e) =>
                setParameters({
                  type: parameters.type,
                  intensity: parseFloat(e.target.value),
                })
              }
            />
            <span className="text-sm text-gray-600">
              Intensité: {parameters.intensity || 1.5}
            </span>
          </div>
        );
      case "economic":
        return (
          <div className="space-y-2">
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={parameters.type || "recession_sectorielle"}
              onChange={(e) =>
                setParameters({
                  type: e.target.value,
                  severity: parameters.severity || 1.5,
                })
              }
            >
              <option value="recession_sectorielle">
                Récession sectorielle
              </option>
              <option value="hausse_taux">Hausse des taux</option>
            </select>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={parameters.severity || 1.0}
              className="w-full"
              onChange={(e) =>
                setParameters({
                  type: parameters.type,
                  severity: parseFloat(e.target.value),
                })
              }
            />
            <span className="text-sm text-gray-600">
              Sévérité: {parameters.severity || 1.0}
            </span>
          </div>
        );
      case "regulatory":
        return (
          <div className="space-y-2">
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={parameters.type || "nouvelle_reglementation"}
              onChange={(e) =>
                setParameters({
                  type: e.target.value,
                  severity: parameters.severity || 1,
                })
              }
            >
              <option value="nouvelle_reglementation">
                Nouvelle réglementation
              </option>
              <option value="changement_fiscal">Changement fiscal</option>
              <option value="reforme_bancaire">Réforme bancaire</option>
            </select>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={parameters.severity || 1}
              className="w-full"
              onChange={(e) =>
                setParameters({
                  type: parameters.type,
                  severity: parseFloat(e.target.value),
                })
              }
            />
            <span className="text-sm text-gray-600">
              Sévérité: {parameters.severity || 1}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={hideTitle ? "" : "bg-white rounded-lg shadow-sm border border-gray-200 p-4"}>
      {!hideTitle && (
        <h3 className="font-semibold text-gray-900 mb-3">
          Configuration de la simulation
        </h3>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scénario d'événement
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={eventType}
            onChange={(e) => handleEventTypeChange(e.target.value)}
          >
            <option value="weather">Événement météorologique</option>
            <option value="economic">Événement économique</option>
            <option value="regulatory">Événement réglementaire</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paramètres de l'événement
          </label>
          {renderParameters()}
        </div>

        <button
          className="w-full bg-gradient-to-r from-[#153290] to-[#10B981] text-white py-2 px-4 rounded-md font-medium hover:from-green-600 hover:to-blue-700 transition-colors cursor-pointer disabled:opacity-50"
          onClick={handleRunSimulation}
          disabled={loading}
        >
          {loading ? "Simulation en cours..." : "Lancer la simulation"}
        </button>
      </div>
    </div>
  );
};

export default EventSimulator;
