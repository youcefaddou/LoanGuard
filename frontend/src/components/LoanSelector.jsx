import { useState, useEffect } from 'react';
import authService from '../services/authService';

const LoanSelector = ({ selectedLoan, onLoanSelect }) => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await authService.secureRequest('/api/loans')
                if (response.ok) {
                    const data = await response.json();
                    setLoans(data.loans || []);
                }
            } catch (error) {
                console.error('Erreur chargement prets: ', error)
            } finally {
                setLoading(false);
            }
        }
        fetchLoans();
    }, [])

    const formatLoanLabel = (loan) => {
        const amount = loan.amount.toLocaleString('fr-FR');
        return `${loan.companyName} - ${amount}€`;
    };

    return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Prêt à analyser
      </label>
      <select
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedLoan || ''}
        onChange={(e) => onLoanSelect(e.target.value)}
        disabled={loading}
      >
        <option value="">
          {loading ? 'Chargement...' : 'Sélectionner un prêt'}
        </option>
        {loans.map((loan) => (
          <option key={loan.id} value={loan.id}>
            {formatLoanLabel(loan)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LoanSelector;