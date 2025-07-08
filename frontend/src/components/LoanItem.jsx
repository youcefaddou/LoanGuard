import React from 'react';

const LoanItem = ({ loan }) => {
  //formatage du montant en euros (compact pour responsive)
  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M €`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K €`;
    }
    return `${amount} €`;
  };

  //formatage de la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0 flex-1">
          {/* Nom de l'entreprise - responsive */}
          <div className="min-w-0 flex-1 md:w-60 md:flex-none">
            <h3 className="font-semibold text-gray-900 truncate">
              {loan.companyName || 'Entreprise inconnue'}
            </h3>
          </div>

          {/* Montant - responsive avec espace réduit */}
          <div className="ml-2 md:ml-4 md:w-32 text-right flex-shrink-0">
            <span className="font-semibold text-gray-900 text-sm md:text-base">
              {formatAmount(loan.amount)}
            </span>
          </div>

          {/* Date d'échéance - masquée sur mobile, visible sur md+ */}
          <div className="hidden md:block md:w-44 text-center ml-4">
            <span className="text-sm text-gray-600">
              Échéance: {formatDate(loan.dueDate)}
            </span>
          </div>

          {/* Taux d'intérêt - masqué sur mobile, visible sur md+ */}
          <div className="hidden md:block md:w-16 text-center ml-4">
            <span className="text-sm text-gray-600">
              {loan.interestRate}%
            </span>
          </div>
        </div>

        {/* Badge de risque temporaire - toujours visible */}
        <div className="flex-shrink-0 ml-2">
          <span className="px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
            -
          </span>
        </div>
      </div>

      {/* Infos supplémentaires visibles seulement sur mobile */}
      <div className="md:hidden mt-2 pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>Échéance: {formatDate(loan.dueDate)}</span>
          <span>Taux: {loan.interestRate}%</span>
        </div>
      </div>
    </div>
  );
};

export default LoanItem;
