import { useState } from 'react';

const LoanItem = ({ loan, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Fonction pour déterminer la couleur du badge de risque
  const getRiskBadgeStyle = (riskLevel) => {
    const styles = {
      'Faible': 'bg-green-100 text-green-800 border-green-200',
      'Moyen': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Élevé': 'bg-red-100 text-red-800 border-red-200'
    };
    return styles[riskLevel] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  //formatage du montant en euros
  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`;
    }
    return `€${amount}`;
  };

  // formatage de la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
      {/* Ligne principale du prêt */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Informations principales */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Nom de l'entreprise */}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {loan.company?.name || 'Entreprise inconnue'}
            </h3>
            <p className="text-sm text-gray-500">
              SIRET: {loan.company?.siret || 'N/A'}
            </p>
          </div>

          {/* Montant */}
          <div className="text-right">
            <div className="font-semibold text-lg text-gray-900">
              {formatAmount(loan.amount)}
            </div>
            <div className="text-sm text-gray-500">
              Échéance {formatDate(loan.dueDate)}
            </div>
          </div>

          {/* Badge de risque */}
          <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getRiskBadgeStyle(loan.riskLevel)}`}>
            {loan.riskLevel}
          </div>
        </div>

        {/* Icône d'expansion */}
        <div className="ml-4">
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Détails expandables */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Informations financières */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Détails financiers</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taux d'intérêt:</span>
                  <span className="font-medium">{loan.interestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée:</span>
                  <span className="font-medium">{loan.duration} mois</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mensualité:</span>
                  <span className="font-medium">{formatAmount(loan.monthlyPayment)}</span>
                </div>
              </div>
            </div>

            {/* Informations de l'entreprise */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Entreprise</h4>
              <div className="text-sm space-y-1">
                <div className="text-gray-600">{loan.company?.address}</div>
                <div className="text-gray-600">{loan.company?.postalCode} {loan.company?.city}</div>
                <div className="text-gray-600">Secteur: {loan.company?.sector}</div>
              </div>
            </div>

            {/* Actions */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(loan.id);
                  }}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Voir détails
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Logique pour simulation
                  }}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
                >
                  Simuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanItem;
