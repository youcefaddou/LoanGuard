// Service d'authentification pour LoanGuard
const API_URL = import.meta.env.VITE_API_URL; 

// Cache en mémoire pour les données utilisateur (non visible dans F12)
let userCache = null;
let selectedBankCache = null;

const authService = {
  // Connexion utilisateur
  async login(credentials) {
    try {
      const response = await fetch(API_URL + "/api/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour les cookies httpOnly
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker en mémoire au lieu de localStorage (non visible dans F12)
        if (data.user) {
          userCache = data.user;
        }
        
        // Stocker la banque sélectionnée en mémoire
        if (data.selectedBank) {
          selectedBankCache = data.selectedBank;
        }
        
        return data; // Retourner directement les données du backend
      } else {
        throw new Error(data.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Erreur service login:', error);
      throw error;
    }
  },

  // Sélection de banque après connexion
  async selectBank(bankId) {
    try {
      const response = await fetch(`${API_URL}/api/auth/select-bank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ bankId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker la banque sélectionnée en mémoire
        if (data.selectedBank) {
          selectedBankCache = data.selectedBank;
        }
        return data;
      } else {
        throw new Error(data.message || 'Erreur lors de la sélection de banque');
      }
    } catch (error) {
      console.error('Erreur service sélection banque:', error);
      throw error;
    }
  },

  // Déconnexion utilisateur
  async logout() {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
    
    // Nettoyer le cache mémoire
    userCache = null;
    selectedBankCache = null;
    
    // Nettoyer aussi localStorage (au cas où il reste des données anciennes)
    localStorage.removeItem('user');
    localStorage.removeItem('selectedBank');
    localStorage.removeItem('selectedBankId');
    
    // Rediriger vers login
    window.location.href = '/login';
  },

  // Récupérer les informations de l'utilisateur actuel depuis le backend
  async getCurrentUser() {
    try {
      // Si on a déjà les données en cache, les retourner
      if (userCache) {
        return {
          user: userCache,
          selectedBank: selectedBankCache,
        };
      }

      // Sinon, récupérer depuis le backend
      const selectedBankId = selectedBankCache?.id;
      const headers = {
        'Content-Type': 'application/json'
      };
      if (selectedBankId) {
        headers['x-bank-id'] = selectedBankId;
      }

      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: headers,
      });

      if (response.ok) {
        const data = await response.json();
        // Mettre en cache
        userCache = data.user;
        if (data.selectedBank) {
          selectedBankCache = data.selectedBank;
        }
        return data;
      } else if (response.status === 401) {
        // Non authentifié
        userCache = null;
        selectedBankCache = null;
        return null;
      } else {
        throw new Error('Erreur lors de la récupération des informations utilisateur');
      }
    } catch (error) {
      console.error('Erreur getCurrentUser:', error);
      return null;
    }
  },

  // Obtenir l'utilisateur depuis le cache (pour usage synchrone)
  getUserFromCache() {
    return userCache;
  },

  // Obtenir la banque sélectionnée depuis le cache
  getSelectedBankFromCache() {
    return selectedBankCache;
  },

  // Vérifier si l'utilisateur est connecté
  // Cette méthode est utilisée de manière synchrone, donc elle ne vérifie que le cache
  // Pour une vérification complète avec le backend, utilisez getCurrentUser()
  isAuthenticated() {
    return userCache !== null;
  },

  // Mettre à jour la banque sélectionnée dans le cache
  updateSelectedBankCache(bank) {
    selectedBankCache = bank;
  },

  // requête sécurisée avec cookies
  async secureRequest(url, options = {}) {
    const selectedBankId = selectedBankCache?.id;
    
    const headers = {
      'Content-Type': 'application/json'
    };
    if (selectedBankId) {
      headers['x-bank-id'] = selectedBankId;
    }

    const response = await fetch(`${API_URL}${url}`, {
      method: options.method || 'GET',
      credentials: 'include', // inclure les cookies
      headers: headers,
      body: options.body 
    })
    // ne pas rediriger automatiquement, laisser le composant gérer l'erreur 401
    return response;
  }
};

export default authService;