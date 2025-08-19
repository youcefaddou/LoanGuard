import authService from './authService';

const riskService = {
  // Récupérer l'évolution des scores de risque pour le dashboard
  getRiskEvolution: async () => {
    try {
      const response = await authService.secureRequest('/api/risk/evolution', {
        method: 'GET',
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'évolution des risques:', error);
      throw error;
    }
  },

  // Récupérer l'historique des scores d'un prêt spécifique
  getRiskHistory: async (loanId) => {
    try {
      const response = await authService.secureRequest(`/api/risk/history/${loanId}`, {
        method: 'GET',
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  },

  // Calculer le score de risque d'un prêt
  calculateRiskScore: async (loanId) => {
    try {
      const response = await authService.secureRequest(`/api/risk/calculate/${loanId}`, {
        method: 'GET',
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du calcul du score de risque:', error);
      throw error;
    }
  },

  // Entraîner le modèle IA (temporaire)
  trainModel: async () => {
    try {
      const response = await authService.secureRequest('/api/risk/train-model', {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'entraînement du modèle:', error);
      throw error;
    }
  }
};

export default riskService;


