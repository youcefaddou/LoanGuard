// Service de validation simple pour le frontend
// La validation sécurisée se fait côté backend

export const validateEmail = (email) => {
  if (!email) {
    return "L'adresse email est requise";
  }
  if (!email.includes('@')) {
    return "Format d'email invalide";
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Le mot de passe est requis';
  }
  if (password.length < 8) {
    return 'Le mot de passe doit contenir au moins 8 caractères';
  }
  return '';
};
