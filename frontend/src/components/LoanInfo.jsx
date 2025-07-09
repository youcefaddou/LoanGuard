import React from "react";

const LoanInfo = ({ loan }) => {
  const formatAmount = (amount) => {
    if (!amount) return "0€";

    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`;
    } else {
      return `€${amount.toLocaleString()}`;
    }
  };

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { bg: "bg-green-100", text: "text-green-800", label: "Actif" },
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "En attente",
      },
      OVERDUE: { bg: "bg-red-100", text: "text-red-800", label: "En retard" },
      COMPLETED: { bg: "bg-gray-100", text: "text-gray-800", label: "Terminé" },
    };

    const config = statusConfig[status] || statusConfig["ACTIVE"];

    return (
      <span
        className={`px-2 py-1 ${config.bg} ${config.text} rounded-full text-xs font-medium`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Informations prêt</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Montant</span>
          <span className="font-semibold text-lg">
            {formatAmount(loan?.amount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Statut</span>
          {getStatusBadge(loan?.status)}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Prochaine échéance</span>
          <span className="font-medium">{formatDate(loan?.dueDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Taux</span>
          <span className="font-medium">{loan?.interestRate}% annuel</span>
        </div>
      </div>
    </div>
  );
};

export default LoanInfo;
