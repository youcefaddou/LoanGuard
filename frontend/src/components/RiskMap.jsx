import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import departementsGeoJson from "../data/departements-geojson.json";
import useAuth from '../hooks/useAuth';

// Style CSS pour la carte plein écran
const fullscreenMapStyle = {
  height: '100vh',
  width: '100vw',
  minHeight: '100vh',
  maxHeight: '100vh'
};

// Icône personnalisée pour les marqueurs d'entreprises selon le risque
const createCompanyIcon = (riskScore) => {
  let color = "#9ca3af"; // gris par défaut (pas de risque)

  if (riskScore >= 0 && riskScore < 6) {
    color = "#22c55e"; // vert (risque faible)
  } else if (riskScore >= 6 && riskScore < 8) {
    color = "#f59e0b"; // orange (risque moyen)
  } else if (riskScore >= 8) {
    color = "#ef4444"; // rouge (risque élevé)
  }

  return new L.divIcon({
    className: "custom-company-marker",
    html: `<div style="
      width: 12px;
      height: 12px;
      background-color: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6],
  });
};

const RiskMap = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [companiesData, setCompaniesData] = useState([]);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRiskColor = (riskLevel) => {
    if (riskLevel >= 0 && riskLevel < 6) return "#22c55e"; // vert
    if (riskLevel >= 6 && riskLevel < 8) return "#f59e0b"; // orange
    if (riskLevel >= 8) return "#ef4444"; // rouge
    return "#9ca3af"; // gris par défaut
  };

  // Style pour les départements
  const departmentStyle = (feature) => {
    const departmentCode = feature.properties.code;
    let deptData = null;

    // Chercher dans le tableau des données de département
    if (Array.isArray(departmentData)) {
      for (let i = 0; i < departmentData.length; i++) {
        if (departmentData[i].code === departmentCode) {
          deptData = departmentData[i];
          break;
        }
      }
    }

    const riskLevel = deptData ? deptData.averageRiskScore : 0;

    return {
      fillColor: getRiskColor(riskLevel),
      weight: 1,
      opacity: 1,
      color: "#374151",
      fillOpacity: 0.6,
    };
  };

  // Événements sur les départements
  const onEachDepartment = (feature, layer) => {
    const departmentCode = feature.properties.code;
    const departmentName = feature.properties.nom;

    // Chercher dans le tableau des données de département
    let deptData = null;
    if (Array.isArray(departmentData)) {
      for (let i = 0; i < departmentData.length; i++) {
        if (departmentData[i].code === departmentCode) {
          deptData = departmentData[i];
          break;
        }
      }
    }

    const averageRisk = deptData ? deptData.averageRiskScore : null;
    const companyCount = deptData ? deptData.companiesCount : 0;

    layer.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-lg">${departmentName}</h3>
        <p class="text-sm">Code: ${departmentCode}</p>
        <p class="text-sm">Risque moyen: ${
          averageRisk ? averageRisk.toFixed(2) : "N/A"
        }</p>
        <p class="text-sm">Nombre d'entreprises: ${companyCount}</p>
      </div>
    `);

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          weight: 3,
          fillOpacity: 0.8,
        });
      },
      mouseout: (e) => {
        e.target.setStyle({
          weight: 1,
          fillOpacity: 0.6,
        });
      },
    });
  };

  // Chargement initial du GeoJSON
  useEffect(() => {
    setGeoJsonData(departementsGeoJson);
  }, []);

  const { user } = useAuth();

  // Fonction pour récupérer les données de risque par département avec authentification
  const fetchDepartmentRisks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/map/risk-data`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setDepartmentData(result.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des risques:', error);
    }
  };

  // Fonction pour récupérer les données des entreprises avec authentification
  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/map/companies-data`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setCompaniesData(result.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des entreprises:', error);
    }
  };

  // useEffect pour charger les données avec authentification
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          setLoading(true);
          setError(null);
          await Promise.all([
            fetchDepartmentRisks(),
            fetchCompanies()
          ]);
        } catch (err) {
          setError("Erreur lors du chargement des données");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadUserData();
  }, [user]);
  // Fonction pour filtrer le GeoJSON et n'afficher que les départements avec des entreprises
  const getFilteredGeoJsonData = () => {
    if (!geoJsonData || !Array.isArray(departmentData)) return null;

    // Créer un ensemble des codes de départements qui ont des entreprises
    const departmentsWithCompanies = new Set();
    for (let i = 0; i < departmentData.length; i++) {
      if (departmentData[i].companiesCount > 0) {
        departmentsWithCompanies.add(departmentData[i].code);
      }
    }

    // Filtrer le GeoJSON pour ne garder que les départements avec des entreprises
    const filteredFeatures = [];
    for (let i = 0; i < geoJsonData.features.length; i++) {
      const feature = geoJsonData.features[i];
      if (departmentsWithCompanies.has(feature.properties.code)) {
        filteredFeatures.push(feature);
      }
    }

    // Créer un nouvel objet avec les features filtrées
    const filteredGeoJsonData = {
      type: geoJsonData.type,
      features: filteredFeatures
    };
    
    return filteredGeoJsonData;
  };

  const MapContent = () => {
    const filteredGeoJson = getFilteredGeoJsonData();

    return (
      <>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Départements GeoJSON - seulement ceux avec des entreprises */}
        {filteredGeoJson && (
          <GeoJSON
            data={filteredGeoJson}
            style={departmentStyle}
            onEachFeature={onEachDepartment}
          />
        )}

        {/* Marqueurs des entreprises */}
        {companiesData &&
          Array.isArray(companiesData) &&
          companiesData.length > 0 &&
          companiesData.map((company) => (
            <Marker
              key={company.id}
              position={[company.latitude, company.longitude]}
              icon={createCompanyIcon(company.averageRiskScore || 0)}
            >
              <Popup>
                <div className="p-2 max-w-xs">
                  <h3 className="font-bold text-lg mb-2">{company.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {company.address}
                  </p>
                  <div className="mb-2">
                    <span className="text-sm font-semibold">
                      Score de risque:{" "}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        company.averageRiskScore >= 8
                          ? "text-red-600"
                          : company.averageRiskScore >= 6
                          ? "text-yellow-600"
                          : company.averageRiskScore > 0
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {company.averageRiskScore
                        ? company.averageRiskScore.toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">Prêts:</h4>
                    {company.loans && company.loans.length > 0 ? (
                      company.loans.map((loan, index) => (
                        <div
                          key={index}
                          className="text-xs bg-gray-100 p-1 rounded"
                        >
                          <span className="font-medium">
                            {loan.amount.toLocaleString()}€
                          </span>
                          <span className="text-gray-500 ml-2">
                            Risque: {loan.riskScore}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">Aucun prêt</p>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </>
    );
  };

  const MapComponent = ({ isFullscreen = false }) => (
    <MapContainer
      center={[46.603354, 1.888334]} // Centre de la France
      zoom={isFullscreen ? 6 : 5}
      className={`${
        isFullscreen ? "h-full w-full" : "h-64 md:h-80 lg:h-96 w-full"
      } ${isFullscreen ? "" : "rounded-lg"}`}
      style={isFullscreen ? fullscreenMapStyle : {}}
      zoomControl={true} // Contrôles de zoom toujours activés
      key={isFullscreen ? "fullscreen" : "normal"} // Key différente pour forcer le remount
    >
      <MapContent />
    </MapContainer>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <>
      {/* Composant principal */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Carte des Risques
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg hover:cursor-pointer transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
            <span className="hidden sm:inline ">Agrandir</span>
          </button>
        </div>

        {/* Légende */}
        <div className="mb-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Entreprises:</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
              <span>Risque faible (0-6)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>
              <span>Risque moyen (6-8)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
              <span>Risque élevé (8+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full border border-white"></div>
              <span>Pas de risque</span>
            </div>
          </div>
        </div>

        {/* Carte normale - cachée quand la modal est ouverte */}
        {!isModalOpen && <MapComponent />}
      </div>

      {/* Modal plein écran */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" style={{ height: '100vh', width: '100vw' }}>
          <div className="bg-white w-full h-full flex flex-col" style={{ height: '100vh' }}>
            <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
              <h2 className="text-xl font-bold">
                Carte des Risques - Vue étendue
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-red-700 p-2 hover:cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
              <MapComponent isFullscreen={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RiskMap;