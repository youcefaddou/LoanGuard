const LoanDetailHeader = ({ 
  onBack, 
  onExport, 
  onEdit, 
  onDelete,
  companyName = "Entreprise ABC",
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm md:text-base cursor-pointer"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>
          <div>
            <h1 className="text-sm md:text-xl font-semibold text-gray-900">
              Détail du prêt - {companyName}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Boutons responsive */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Layout desktop - tous sur une ligne */}
            <button 
              onClick={onExport}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Exporter les détails du prêt
            </button>
            <button 
              onClick={onEdit}
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Modifier
            </button>
            <button 
              onClick={onDelete}
              className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
            >
              Supprimer
            </button>
          </div>
          
          {/* Layout mobile */}
          <div className="flex md:hidden flex-col items-end space-y-2">
            <div className="flex space-x-2 w-full">
              <button 
                onClick={onEdit}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Modifier
              </button>
              <button 
                onClick={onDelete}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
              >
                Supprimer
              </button>
            </div>
            <button 
              onClick={onExport}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Exporter les détails du prêt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailHeader;
