// Composant Button réutilisable
const Button = ({ 
  children, 
  type, 
  disabled, 
  onClick,
  className 
}) => {
  
  // classes CSS de base pour le bouton
  let buttonClasses = 'font-medium rounded-lg px-4 py-2 text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // couleurs du bouton principal 
  buttonClasses += ' bg-gradient-to-r from-teal-600 to-blue-800 hover:from-teal-600 hover:to-blue-700 text-white focus:ring-blue-500';
  
  // Si le bouton est désactivé
  if (disabled) {
    buttonClasses += ' opacity-50 cursor-not-allowed';
  }
  
  // Ajouter les classes personnalisées si elles existent
  if (className) {
    buttonClasses += ' ' + className;
  }

  return (
    <button
      type={type || 'button'}
      disabled={disabled}
      onClick={onClick}
      className={buttonClasses}
    >
      {children}
    </button>
  );
};

export default Button;
