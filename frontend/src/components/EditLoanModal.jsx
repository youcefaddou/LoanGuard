import { useState, useEffect } from "react";
import authService from "../services/authService";
import useAuth from "../hooks/useAuth";

const EditLoanModal = ({ isOpen, onClose, onLoanUpdated, loan }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    id: "",
    companyId: "",
    amount: "",
    interestRate: "",
    duration: "",
    startDate: "",
    status: "Actif",
  });
  const updateFormData = (field, value) => {
    setFormData({
      id: field === "id" ? value : formData.id,
      companyId: field === "companyId" ? value : formData.companyId,
      amount: field === "amount" ? value : formData.amount,
      interestRate: field === "interestRate" ? value : formData.interestRate,
      duration: field === "duration" ? value : formData.duration,
      startDate: field === "startDate" ? value : formData.startDate,
      status: field === "status" ? value : formData.status,
    });
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isRes = user && user.role === "RES";

  // Pré-remplir les champs avec les données du prêt
  useEffect(() => {
    if (loan) {
      setFormData({
        id: loan.id,
        companyId: loan.companyId || "",
        amount: loan.amount || "",
        interestRate: loan.interestRate || "",
        duration: loan.duration || "",
        startDate: loan.startDate ? loan.startDate.split("T")[0] : "",
        status: loan.status || "Actif",
      });
    }
  }, [loan]);

  // Si l'utilisateur n'est pas responsable, ne pas afficher la modal
  if (!isRes) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await authService.secureRequest(
        `/api/loans/${formData.id}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        const result = await response.json();
        onLoanUpdated(result.loan); //callback pour mettre à jour la liste des prêts
        onClose(); //fermer la modale
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erreur lors de la modification du prêt");
      }
    } catch (erreur) {
      console.error("Erreur réseau:", erreur);
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-blue-800">
          Modifier un prêt
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant (€)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => updateFormData("amount", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2500000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taux (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.interestRate}
                onChange={(e) => updateFormData("interestRate", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3.2"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée (mois)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => updateFormData("duration", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="60"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => updateFormData("startDate", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={formData.status}
              onChange={(e) => updateFormData("status", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Actif">Actif</option>
              <option value="En attente">En attente</option>
              <option value="Suspendu">Suspendu</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-[#153290] to-[#10B981] text-white rounded-md hover:bg-blue-700 hover:from-teal-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg cursor-pointer"
            >
              {loading ? "Modification..." : "Modifier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLoanModal;
