import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import LoanSelector from '../components/LoanSelector';
import EventSimulator from '../components/EventSimulator';
import SimulationResults from '../components/SimulationResults';

const Simulator = () => {
  const [selectedLoan, setSelectedLoan] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLoanSelect = (loanId) => {
    setSelectedLoan(loanId);
    setRefreshTrigger(0); // Reset du trigger
  };

  const handleSimulationComplete = () => {
    setRefreshTrigger(prev => prev + 1); // Déclenche le refresh des résultats
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              IA Prédictive - Simuler l'impact d'un événement externe
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Colonne gauche - Configuration */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Configuration de la simulation
                </h2>
                
                <div className="space-y-6">
                  <LoanSelector 
                    selectedLoan={selectedLoan}
                    onLoanSelect={handleLoanSelect}
                  />
                  
                  {selectedLoan && (
                    <EventSimulator 
                      loanId={selectedLoan}
                      onSimulationComplete={handleSimulationComplete}
                      hideTitle={true}
                    />
                  )}
                </div>
              </div>
              
              {/* Colonne droite - Résultats */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Résultats de la simulation
                </h2>
                
                {!selectedLoan ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    Sélectionnez un prêt et lancez une simulation
                  </div>
                ) : (
                  <SimulationResults 
                    loanId={selectedLoan}
                    refreshTrigger={refreshTrigger}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Simulator;