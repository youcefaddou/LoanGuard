// Service pour les alertes de LoanGuard
import authService from './authService';

const alertService = {
  // Récupérer toutes les alertes de la banque
  async getAllAlerts() {
    try {
      const response = await authService.secureRequest('/api/alerts');
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Erreur lors de la récupération des alertes');
      }
    } catch (error) {
      console.error('Erreur service alertes:', error);
      throw error;
    }
  },

  // récupérer les alertes d'un pret spécifique
  async getAlertsByLoan(loanId) {
    try {
      const response = await authService.secureRequest(`/api/alerts/loan/${loanId}`);
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Erreur lors de la récupération des alertes du prêt');
      }
    } catch (error) {
      console.error('Erreur service alertes par prêt:', error);
      throw error;
    }
  },

  // Créer une nouvelle alerte
  async createAlert(loanId, type, message) {
    try {
      const response = await authService.secureRequest('/api/alerts', {
        method: 'POST',
        body: JSON.stringify({
          loanId,
          type,
          message
        })
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Erreur lors de la création de l\'alerte');
      }
    } catch (error) {
      console.error('Erreur création alerte:', error);
      throw error;
    }
  }
};

export default alertService;