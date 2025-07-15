import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import LoanDetailHeader from "../components/LoanDetailHeader";
import LoanInfo from "../components/LoanInfo";
import CompanyInfo from "../components/CompanyInfo";
import PaymentTimeline from "../components/PaymentTimeline";
import EditLoanModal from "../components/EditLoanModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EventSimulator from "../components/EventSimulator";
import RiskScore from "../components/RiskScore";

const LoanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loan, setLoan] = useState(null);
  const [error, setError] = useState(null);
  const [refreshRiskScore, setRefreshRiskScore] = useState(0);

  const handleSimulationComplete = () => {
    setRefreshRiskScore(prev => prev + 1);
  };

  const handleBack = () => {
    navigate("/loans");
  };

  const handleExport = () => {
    // Logique d'export à implémenter
    console.log("Export des détails du prêt");
  }
  const handleEdit = () => {
    setIsEditModalOpen(true);
  };
  const handleLoanUpdated = (updatedLoan) => {
    setIsEditModalOpen(false);
    setLoan(updatedLoan);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await authService.secureRequest(`/api/loans/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        navigate("/loans");
      } else {
        setError("Erreur lors de la suppression");
      }
    } catch {
      setError("Erreur lors de connexion");
    } finally {
      setIsDeleteModalOpen(false);
    }
  }

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:4000/api/loans/${id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-bank-id": "1",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login");
            return;
          }
          setError("Erreur lors du chargement du prêt");
          return;
        }

        const data = await response.json();
        setLoan(data);
      } catch (error) {
        console.error("Erreur fetch prêt:", error);
        setError("Erreur de connexion");
      }
    };

    if (id) {
      fetchLoan();
    }
  }, [id, navigate]);

  return (
    <div className="flex">
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header />

        {/* Header local avec le nouveau composant */}
        <LoanDetailHeader
          onBack={handleBack}
          onExport={handleExport}
          onEdit={handleEdit}
          onDelete={handleDelete}
          companyName={
            loan && loan.company && loan.company.name ? loan.company.name : null
          }
          companySiren={
            loan && loan.company && loan.company.siret
              ? loan.company.siret
              : null
          }
          companyActivitySector={
            loan && loan.company && loan.company.sector
              ? loan.company.sector
              : null
          }
        />

        <main className="flex-1 p-2 sm:p-3 lg:p-2">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="text-red-600 mr-2">Erreur</div>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {!error && loan && (
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-2 mb-4">
              {/* Colonne 1 - Gauche */}
              <div className="space-y-4">
                {/* Ligne 1: CompanyInfo + LoanInfo côte à côte */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CompanyInfo - Composant dynamique */}
                  <CompanyInfo
                    company={loan && loan.company ? loan.company : null}
                  />
                  {/* LoanInfo */}
                  <LoanInfo loan={loan} />
                </div>

                {/* Ligne 2: RiskScore */}
                <RiskScore loanId={id} refreshTrigger={refreshRiskScore} />

                {/* Ligne 3: PaymentTimeline */}
                <PaymentTimeline
                  payments={loan && loan.payments ? loan.payments : []}
                />
              </div>

              {/* Colonne 2 - Droite */}
              <div className="space-y-4">
                {/* EventSimulator */}
                <EventSimulator loanId={id} onSimulationComplete={handleSimulationComplete} />
                {/* AlertHistory */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Historique des alertes
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-yellow-800">
                            Retard de paiement détecté
                          </p>
                          <p className="text-xs text-yellow-700">
                            Il y a 5 jours
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-blue-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-blue-800">
                            Score de risque mis à jour
                          </p>
                          <p className="text-xs text-blue-700">
                            Il y a 2 semaines
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">
                            Paiement reçu avec succès
                          </p>
                          <p className="text-xs text-green-700">
                            Il y a 3 semaines
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        {/* Modal d'édition */}
        <EditLoanModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onLoanUpdated={handleLoanUpdated}
          loan={loan}
        />
        {/* Modal de suppression */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          companyName={
            loan && loan.company && loan.company.name
              ? loan.company.name
              : "cette entreprise"
          }
          amount={loan && loan.amount ? loan.amount : 0}
        />
        <Footer />
      </div>
    </div>
  );
};

export default LoanDetail;
