import { useNavigate } from "react-router-dom";
import { formatAmountCompact, formatDate } from "../utils/formatters";

const LoanItem = ({ loan }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/loans/${loan.id}`);
  };

  // Fonction pour obtenir le style du badge de risque
  const getRiskBadgeStyle = (riskLevel) => {
    switch (riskLevel) {
      case "Faible":
        return "bg-green-100 text-green-800 border-green-200";
      case "Moyen":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Élevé":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0 flex-1">
          {/* Nom de l'entreprise - responsive */}
          <div className="min-w-0 flex-1 md:w-60 md:flex-none">
            <h3 className="font-semibold text-gray-900 truncate">
              {loan.companyName || "Entreprise inconnue"}
            </h3>
          </div>

          {/* Montant */}
          <div className="ml-2 md:ml-4 md:w-32 text-right flex-shrink-0">
            <span className="font-semibold text-gray-900 text-sm md:text-base">
              {formatAmountCompact(loan.amount)}
            </span>
          </div>

          {/* Date d'échéance  */}
          <div className="hidden md:block md:w-44 text-center ml-4">
            <span className="text-sm text-gray-600">
              Échéance: {formatDate(loan.dueDate)}
            </span>
          </div>

          {/* Taux d'intérêt */}
          <div className="hidden md:block md:w-16 text-center ml-4">
            <span className="text-sm text-gray-600">{loan.interestRate}%</span>
          </div>
        </div>

        {/* Badge de risque */}
        <div className="flex-shrink-0 ml-2">
          <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium border ${getRiskBadgeStyle(loan.riskLevel)}`}>
            {loan.riskLevel || "-"}
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
