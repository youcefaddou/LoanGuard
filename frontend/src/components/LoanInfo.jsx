import { formatAmount, formatDate } from "../utils/formatters";

const LoanInfo = ({ loan }) => {
  // Fonction pour formater le montant exact (sans centimes)
  const formatExactAmount = (amount) => {
    if (!amount) return "€0";
    return `€${Math.round(amount).toLocaleString()}`;
  };

  // fonction pour calculer la prochaine échéance
  const getNextPaymentDate = (loan) => {
    if (!loan || !loan.payments || !loan.startDate) return "N/A";
    
    // calculer combien de paiements ont déjà été effectués
    const paymentsCount = loan.payments.length;
    
    // calculer la date de la prochaine échéance
    const startDate = new Date(loan.startDate);
    const nextPaymentDate = new Date(startDate);
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + paymentsCount);
    
    // si on a dépassé la fin du prêt, le prêt est terminé
    const endDate = new Date(loan.dueDate);
    if (nextPaymentDate > endDate) {
      return "Terminé";
    }
    
    return formatDate(nextPaymentDate);
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full">
      <h3 className="font-semibold text-gray-900 mb-3">Informations prêt</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Montant</span>
          <span className="font-semibold text-lg">
            {formatAmount(loan && loan.amount ? loan.amount : 0)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Statut</span>
          {getStatusBadge(loan && loan.status ? loan.status : 'ACTIVE')}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Prochaine échéance</span>
          <span className="font-medium">{getNextPaymentDate(loan)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Mensualité</span>
          <span className="font-medium">{formatExactAmount(loan && loan.monthlyPayment ? loan.monthlyPayment : 0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Taux</span>
          <span className="font-medium">{loan && loan.interestRate ? loan.interestRate : 0}% annuel</span>
        </div>
      </div>
    </div>
  );
};

export default LoanInfo;
