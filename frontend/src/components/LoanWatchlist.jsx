import React, { useState, useEffect } from "react";
import loanService from "../services/loanService";
import { useNavigate } from "react-router-dom";

const LoanWatchlist = () => {
  const [watchlistLoans, setWatchlistLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const response = await loanService.getWatchlist();

        if (response.data) {
          setWatchlistLoans(response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la watchlist:", error);
        // En cas d'erreur, vous pouvez garder une liste vide ou des données simulées
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  // Fonction pour déterminer la couleur du badge selon le score
  const getBadgeColor = (score) => {
    if (score >= 8) return "bg-red-100 text-red-800"; // Élevé
    if (score >= 6.5) return "bg-orange-100 text-orange-800"; // Moyen
    return "bg-green-100 text-green-800"; // Faible
  };

  // Fonction pour déterminer le texte du badge
  const getBadgeText = (score) => {
    if (score >= 8) return "Élevé";
    if (score >= 6.5) return "Moyen";
    return "Faible";
  };

  // Formater le montant
  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`;
    }
    return `€${amount}`;
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) {
      return "Non définie";
    }
    
    try {
      const date = new Date(dateString);
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        return "Date invalide";
      }
      
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", error);
      return "Erreur date";
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Prêts à surveiller
          </h3>
          <a
            href="#"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Voir tout →
          </a>
        </div>
        <div className="space-y-4">
          {Array(5).fill(0).map((item, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Prêts à surveiller
        </h3>
        <button
          onClick={() => navigate("/loans")}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Voir tout →
        </button>
      </div>

      <div className="space-y-4">
        {watchlistLoans.length > 0 ? (
          watchlistLoans.map((loan) => (
            <div
              key={loan.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {loan.companyName}
                </h4>
                <p className="text-sm text-gray-500">
                  {formatAmount(loan.amount)} - Échéance{" "}
                  {formatDate(loan.endDate)}
                </p>
              </div>
              <div className="ml-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
                    loan.riskScore
                  )}`}
                >
                  {getBadgeText(loan.riskScore)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun prêt à surveiller pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanWatchlist;
