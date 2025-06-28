const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-800 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">LG</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2025 LoanGuard. Tous droits réservés.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <a 
              href="#" 
              className="hover:text-blue-600 transition-colors"
            >
              Confidentialité
            </a>
            <span className="text-gray-300">|</span>
            <a 
              href="#" 
              className="hover:text-blue-600 transition-colors"
            >
              Conditions d'utilisation
            </a>
            <span className="text-gray-300">|</span>
            <span className="text-gray-400">
              Version 1.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;