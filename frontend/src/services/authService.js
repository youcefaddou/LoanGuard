// Service d'authentification pour LoanGuard
const API_URL = import.meta.env.VITE_API_URL 

const authService = {
  // Connexion utilisateur
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour les cookies httpOnly
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker les données utilisateur (pas de token car c'est en cookie)
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
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
    
    // Nettoyer le localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('selectedBank');
    localStorage.removeItem('selectedBankId');
    
    // Rediriger vers login
    window.location.href = '/login';
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  // requête sécurisée avec cookies
  async secureRequest(url, options = {}) {
    const response = await fetch(`${API_URL}${url}`, {
      method: options.method || 'GET',
      credentials: 'include', // inclure les cookies
      headers: {
        'Content-Type': 'application/json'
      },
      body: options.body 
    })
    // ne pas rediriger automatiquement, laisser le composant gérer l'erreur 401
    return response;
  }
};

export default authService;