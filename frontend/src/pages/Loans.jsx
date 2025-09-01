import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"
import { useState, useEffect } from "react"
import AddLoanModal from "../components/AddLoanModal"
import LoanItem from "../components/LoanItem"
import authService from "../services/authService"

const Loans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loans, setLoans] = useState([]) // pour stocker la liste des prets
  const [filter, setFilter] = useState('') // pour la recherche par nom d'entreprise
  const [selectedStatus, setSelectedStatus] = useState('') // pour filtrer par statut

  // Fonction pour charger les prêts depuis l'API
  const fetchLoans = async () => {
    try {
      const response = await authService.secureRequest('/api/loans', { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        setLoans(data.loans || []);
      } else {
        console.error('Erreur lors du chargement des prêts');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
  };

  // Charger les prêts au montage du composant
  useEffect(() => {
    fetchLoans();
  }, []);

  //fonction pour gérer l'ajout d'un pret
  const handleLoanAdded = () => {
    fetchLoans(); // Recharger la liste complète
  };

  // Filtrer les prêts
  const filteredLoans = loans.filter(loan => {
    const matchesCompany = loan.companyName ? 
      loan.companyName.toLowerCase().includes(filter.toLowerCase()) : true;
    const matchesStatus = selectedStatus === '' || loan.status === selectedStatus;
    return matchesCompany && matchesStatus;
  });

  // Obtenir les statuts uniques pour le filtre
  const uniqueStatuses = [];
  for (let i = 0; i < loans.length; i++) {
    const status = loans[i].status;
    if (!uniqueStatuses.includes(status)) {
      uniqueStatuses.push(status);
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header onAddLoan={() => setIsModalOpen(true)} />
        <main className="flex-1 p-2 sm:p-3 lg:p-2">
          {/* Contenu des prêts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-screen">
            {/* Header avec titre et filtres sur la même ligne */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Titre */}
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Liste des Prêts</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredLoans.length} prêt{filteredLoans.length !== 1 ? 's' : ''} trouvé{filteredLoans.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Filtres - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 lg:w-auto w-full lg:max-w-md">
                  {/* Recherche par entreprise */}
                  <div className="lg:w-48">
                    <input
                      type="text"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      placeholder="Rechercher une entreprise..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  {/* Filtre par statut */}
                  <div className="lg:w-40">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm hover:cursor-pointer"
                    >
                      <option value="">Tous les statuts</option>
                      {uniqueStatuses.map(status => (
                        <option key={status} value={status}>
                          {status === 'EN_COURS' ? 'En cours' : 
                           status === 'TERMINE' ? 'Terminé' : 
                           status === 'EN_RETARD' ? 'En retard' : status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              {filteredLoans.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {loans.length === 0 ? 'Aucun prêt enregistré pour le moment' : 'Aucun prêt ne correspond à vos critères de recherche'}
                </p>
              ) : (
                <div className="space-y-1">
                  {filteredLoans.map(loan => (
                    <LoanItem key={loan.id} loan={loan} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
      
      {/* Modale d'ajout de prêt */}
      <AddLoanModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoanAdded={handleLoanAdded}
      />
    </div>
  );
};

export default Loans;