import { ArrowDownTrayIcon, PlayIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import SimulatorModal from './SimulatorModal';

const QuickActions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSimulateEvent = () => {
    setIsModalOpen(true);
  }

  const handleExportData = () => {
    // Logique d'export à implémenter
  };

  const handleAdvancedSettings = () => {
    // Navigation vers paramètres avancés à implémenter
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
      <div className="space-y-3 flex-1">
        {/* Bouton Simuler un événement */}
        <button
          onClick={handleSimulateEvent}
          className="w-full bg-gradient-to-r from-[#153290] to-[#10B981] text-white py-3 px-4 rounded-md font-medium hover:from-green-600 hover:to-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <PlayIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Simuler un événement</span>
          <span className="sm:hidden">Simuler</span>
        </button>

        {/* Bouton Exporter les données */}
        <button
          onClick={handleExportData}
          className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center gap-2 sm:text-base"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Exporter les données</span>
          <span className="sm:hidden">Export</span>
        </button>

        {/* Bouton Paramètres avancés */}
        <button
          onClick={handleAdvancedSettings}
          className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center gap-2 sm:text-base"
        >
          <Cog6ToothIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Paramètres avancés</span>
          <span className="sm:hidden">Paramètres</span>
        </button>
      </div>
      {/* Modale de simulation d'événement */}
      {isModalOpen && (
        <SimulatorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default QuickActions;