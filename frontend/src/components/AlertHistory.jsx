import { useState,useEffect } from "react";
import alertService from "../services/alertService";

const AlertHistory = ({ loanId, refreshTrigger}) => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null);

    useEffect( () => {
        const fetchAlerts = async () => {
            try {
                setLoading(true);
                const alertsData = await alertService.getAlertsByLoan(loanId);
                setAlerts(alertsData);
                setError(null)
            } catch (error) {
                console.error('Erreur récupération alertes:', error);
                setError('Erreur lors de la récupération des alertes');
            } finally {
                setLoading(false);
            }
        }
        if (loanId) {
            fetchAlerts()
        }
    }, [loanId, refreshTrigger])

    const getAlertIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'retard':
                case 'warning': 
                return (
                   <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
      case 'update':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'success':
      case 'paiement':
        return (
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getAlertStyle = (type) => {
    switch (type.toLowerCase()) {
      case 'retard':
      case 'warning':
        return 'bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800';
      case 'info':
      case 'update':
        return 'bg-blue-50 border-l-4 border-blue-400 text-blue-800';
      case 'success':
      case 'paiement':
        return 'bg-green-50 border-l-4 border-green-400 text-green-800';
      default:
        return 'bg-gray-50 border-l-4 border-gray-400 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Il y a 1 jour';
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? 'Il y a 1 semaine' : `Il y a ${weeks} semaines`;
    } else {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? 'Il y a 1 mois' : `Il y a ${months} mois`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Historique des alertes</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Historique des alertes</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-4">
            Aucune alerte pour ce prêt
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={`p-3 rounded ${getAlertStyle(alert.type)}`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {alert.message}
                  </p>
                  <p className="text-xs opacity-75">
                    {formatDate(alert.date)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertHistory;