const PaymentTimeline = ({ payments }) => {
    const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const formatExactAmount = (amount) => {
    if (!amount) return "€0";
    return `€${Math.round(amount).toLocaleString()}`;
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Historique des paiements</h3>
        <div className="space-y-3">
          {payments && payments.length > 0 ? (
            payments.map((payment) => {
              const isLate = payment.status === "LATE"
              
              return (
                <div key={payment.id} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${isLate ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {isLate ? "Paiement en retard" : "Paiement effectué"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(payment.date)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatExactAmount(payment.amount)} • {isLate ? "En retard" : "À temps"}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-sm text-gray-500 text-center py-4">
              Aucun paiement enregistré
            </div>
          )}
        </div>
    </div>
  )
}

export default PaymentTimeline;