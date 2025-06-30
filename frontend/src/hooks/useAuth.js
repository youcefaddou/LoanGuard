import { useState, useEffect } from 'react';
import authService from '../services/authService';

// Hook pour gestion de l'authentification
function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérification de l'état de connexion au chargement
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  // Connexion
  const login = async (credentials) => {
    const result = await authService.login(credentials);
    setUser(result.user);
    return result;
  };

  // Déconnexion
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // Requête API sécurisée
  const secureRequest = async (url, options = {}) => {
    return authService.secureRequest(url, options);
  };

  return {
    user,
    loading,
    login,
    logout,
    secureRequest,
    isAuthenticated: authService.isAuthenticated()
  };
}

export default useAuth;