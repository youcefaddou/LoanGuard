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
import AlertHistory from "../components/AlertHistory";

const LoanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loan, setLoan] = useState(null);
  const [error, setError] = useState(null);
  const [refreshRiskScore, setRefreshRiskScore] = useState(0);
  const [refreshAlerts, setRefreshAlerts] = useState(0);
  const user = authService.getCurrentUser();

  const handleSimulationComplete = () => {
    setRefreshRiskScore(prev => prev + 1);
    setRefreshAlerts(prev => prev + 1);
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
      <div className="flex-1 flex flex-col min-h-screen">
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
          userRole={user ? user.role : "RES"} // Ajout du rôle utilisateur
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
                <AlertHistory loanId={id} refreshTrigger={refreshAlerts} />
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
