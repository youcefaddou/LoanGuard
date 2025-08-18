import authService from './authService';

const loanService = {
  // Récupérer la liste de surveillance des prêts
  getWatchlist: async () => {
    try {
      const response = await authService.secureRequest('/api/loans/watchlist', {
        method: 'GET',
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de la watchlist:', error);
      throw error;
    }
  },

  // Ici, ajouter d'autres fonctions comme :
  // getAllLoans, getLoanById, etc.
};

export default loanService;