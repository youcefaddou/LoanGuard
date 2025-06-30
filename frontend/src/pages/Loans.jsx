import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"
import { useState } from "react"
import AddLoanModal from "../components/AddLoanModal"

const Loans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loans, setLoans] = useState([]) // pour stocker la liste des prets

  //fonction pour gérer l'ajout d'un pret
  const handleLoanAdded = (newLoan) => {
    setLoans((prevLoans) => [...prevLoans, newLoan])
  }
  return (
    <div className="flex bg-gray-100">
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header onAddLoan={() => setIsModalOpen(true)} />
        <main className="flex-1 p-2 sm:p-2 lg:p-2">
          {/* Contenu des prêts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-black-800">Liste des Prêts</h2>
            </div>
            <div className="p-4">
              {loans.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun prêt enregistré pour le moment</p>
              ) : (
                <div className="space-y-3">
                  {loans.map(loan => (
                    <div key={loan.id} className="border border-gray-200 p-4 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-900">{loan.company?.name || 'Entreprise inconnue'}</h3>
                          <p className="text-sm text-gray-600">Montant: {loan.amount}€ - Statut: {loan.status}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          Taux: {loan.interestRate}%
                        </div>
                      </div>
                    </div>
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