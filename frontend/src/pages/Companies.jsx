import { useState, useEffect } from 'react';
import authService from '../services/authService';
import { BuildingOfficeIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar';
import { getSectorDescription } from '../utils/formatters';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  // Récupérer les entreprises au chargement
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const bankId = localStorage.getItem('selectedBankId') || 1;
      const response = await authService.secureRequest(`/api/companies/bank/${bankId}`);
      
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.companies);
      } else {
        setError('Erreur lors du chargement des entreprises');
      }
    } catch (error) {
      setError(error.message || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les entreprises
  const filteredCompanies = companies.filter(company => {
    const matchesName = company.name.toLowerCase().includes(filter.toLowerCase());
    const matchesSector = selectedSector === '' || company.sector === selectedSector;
    return matchesName && matchesSector;
  });

  // Obtenir les secteurs uniques pour le filtre 
  const uniqueSectors = [];
  for (let i = 0; i < companies.length; i++) {
    const sector = companies[i].sector;
    if (!uniqueSectors.includes(sector)) {
      uniqueSectors.push(sector);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      
      {/* Contenu principal */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-2 sm:p-4 lg:p-6">
          {/* Contenu des entreprises */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Entreprises clientes
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Liste des entreprises de votre portefeuille
              </p>
            </div>

            
            {/* Filtres */}
            <div className="px-4 pb-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                {/* Recherche par nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rechercher par nom
                  </label>
                  <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Nom de l'entreprise..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Filtre par secteur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filtrer par secteur
                  </label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Tous les secteurs</option>
                    {uniqueSectors.map(sector => (
                      <option key={sector} value={sector}>{getSectorDescription(sector)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Affichage erreur */}
            {error && (
              <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Statistiques */}
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-lg font-semibold text-blue-700">{companies.length}</div>
                  <div className="text-sm text-blue-600">Total entreprises</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-lg font-semibold text-green-700">
                    {companies.filter(c => c.isActive !== false).length}
                  </div>
                  <div className="text-sm text-green-600">Entreprises actives</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg col-span-2 lg:col-span-1">
                  <div className="text-lg font-semibold text-purple-700">{uniqueSectors.length}</div>
                  <div className="text-sm text-purple-600">Secteurs représentés</div>
                </div>
              </div>
            </div>

            {/* Liste des entreprises */}
            <div className="border-t border-gray-200">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {filteredCompanies.length} entreprise(s) trouvée(s)
                </h3>
              </div>

              {filteredCompanies.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Aucune entreprise trouvée avec ces critères.
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredCompanies.map((company) => (
                    <div key={company.id} className="p-4 hover:bg-gray-50">
                      {/* Ligne 1: Nom + Statut sur mobile, nom + statut + date sur desktop */}
                      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        {/* Nom de l'entreprise */}
                        <div className="flex items-center min-w-0">
                          <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <h4 className="text-base font-medium text-gray-900 truncate">
                            {company.name}
                          </h4>
                        </div>
                        
                        {/* Statut et date - ensemble sur desktop */}
                        <div className="flex items-center justify-between sm:justify-end sm:space-x-4 sm:flex-shrink-0">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            company.isActive !== false 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {company.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(company.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      
                      {/* Ligne 2: SIRET + Secteur + Adresse */}
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 mr-1">SIRET:</span>
                          <span className="font-mono">{company.siret}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 mr-1">Secteur:</span>
                          <span>{company.sector ? getSectorDescription(company.sector) : 'Pas de secteur'}</span>
                        </div>
                        <div className="flex items-center sm:col-span-2 lg:col-span-1">
                          <MapPinIcon className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {company.address}, {company.postalCode} {company.city}
                          </span>
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
    </div>
  );
};

export default Companies;
