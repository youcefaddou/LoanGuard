import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"
import { useState, useEffect } from "react"
import AddLoanModal from "../components/AddLoanModal"
import LoanItem from "../components/LoanItem"

const Loans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loans, setLoans] = useState([]) // pour stocker la liste des prets

  // Fonction pour charger les prêts depuis l'API
  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem('token');
      const bankId = localStorage.getItem('selectedBankId');
      
      const response = await fetch('http://localhost:4000/api/loans', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-bank-id': bankId,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

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
  const handleLoanAdded = (newLoan) => {
    fetchLoans(); // Recharger la liste complète
  };

  return (
    <div className="flex">
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header onAddLoan={() => setIsModalOpen(true)} />
        <main className="flex-1 p-2 sm:p-3 lg:p-2">
          {/* Contenu des prêts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-screen">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">Liste des Prêts</h2>
            </div>
            <div className="p-4">
              {loans.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun prêt enregistré pour le moment</p>
              ) : (
                <div className="space-y-1">
                  {loans.map(loan => (
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