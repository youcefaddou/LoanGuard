import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import authService from "../services/authService";
import {
  BellIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Header = ({ onAddLoan }) => {
  const location = useLocation();

  // État pour les données utilisateur et banque
  const [user, setUser] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);

  //état pour les menus
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);
  const [isBankMenuOpen, setIsBankMenuOpen] = useState(false);
  const [availableBanks, setAvailableBanks] = useState([]); // pour les banques dispo

  // Récupérer les données utilisateur au chargement
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData.user);
        setSelectedBank(userData.selectedBank);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        // ne faire l'appel que si on n'a pas déjà des banques et qu'on est sur une page avec sélecteur
        const pagesWithBankSelector = ["/dashboard", "/companies"];
        if (
          availableBanks.length === 0 &&
          pagesWithBankSelector.includes(location.pathname)
        ) {
          const response = await authService.secureRequest("/api/banks", {
            method: "GET",
          });

          if (response && response.ok) {
            const result = await response.json();
            setAvailableBanks(result.banks || result);
          }
        }
      } catch (error) {
        console.error("Erreur récupération banques:", error);
      }
    };

    const pagesWithBankSelector = ["/dashboard", "/companies"];
    if (user && pagesWithBankSelector.includes(location.pathname)) {
      fetchBanks();
    }
  }, [user, location.pathname, availableBanks.length]);

  // Fermer les menus quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setIsBankMenuOpen(false);
      setIsLogoutMenuOpen(false);
      setIsMobileMenuOpen(false);
    };

    if (isBankMenuOpen || isLogoutMenuOpen || isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isBankMenuOpen, isLogoutMenuOpen, isMobileMenuOpen]);

  //déterminer le type de header selon la page
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/select-bank";
  const isConnectedPage = user && !isAuthPage;

  const handleBankChange = (bank) => {
    // Mettre à jour le cache mémoire
    authService.updateSelectedBankCache(bank);
    setSelectedBank(bank);
    setIsBankMenuOpen(false);
    
    // Déclencher un événement personnalisé pour notifier les composants
    window.dispatchEvent(new CustomEvent('bankChanged', { 
      detail: { bank, bankId: bank.id } 
    }));
    
    // Recharger la page pour mettre à jour les données
    window.location.reload();
  };

  // fonction de déconnexion sécurisée
  const handleLogout = async () => {
    await authService.logout();
  };

  //determiner le titre de la page
  const getPageTitle = () => {
    if (location.pathname === "/dashboard") return null;
    if (location.pathname === "/companies") return null;
    if (location.pathname === "/loans") return "Gestion des prêts";
    if (location.pathname === "/simulator") return "Simulation d'impact";
    if (location.pathname === "/settings") return "Gestion des Utilisateurs";
    if (location.pathname === "/alerts") return "Alertes";
  };

  return (
    <>
      {/* Header Homepage - Supprimé car géré par la landing page Next.js */}

      {/*header Pages Connectées */}
      {isConnectedPage && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Titre de page OU Sélecteur d'agence */}
              <div className="flex items-center space-x-4">
                {/* Menu burger - caché sur lg+ */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(!isMobileMenuOpen);
                    // Déclencher l'événement pour la Sidebar
                    window.dispatchEvent(new CustomEvent("toggleMobileMenu"));
                  }}
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
                {getPageTitle() ? (
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                    {getPageTitle()}
                  </h1>
                ) : (
                  selectedBank && (
                    <div className="relative">
                      {/* CHG: sélecteur grisé et non cliquable */}
                      {user.role === "CHG" ? (
                        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md cursor-not-allowed opacity-60">
                          <span className="text-gray-700 text-sm sm:text-base">
                            {selectedBank.name.replace("BNP Paribas -", "")}
                          </span>
                          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsBankMenuOpen(!isBankMenuOpen);
                          }}
                          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md cursor-pointer"
                        >
                          <span className="text-gray-700 text-sm sm:text-base">
                            {selectedBank.name.replace("BNP Paribas -", "")}
                          </span>
                          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                        </button>
                      )}

                      {/* Menu déroulant des agences (RES uniquement) */}
                      {isBankMenuOpen && user.role !== "CHG" && (
                        <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-48">
                          {availableBanks.map((bank) => (
                            <button
                              key={bank.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBankChange(bank);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
                            >
                              {bank.name.replace("BNP Paribas -", "")}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
              {/* actions droite */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Bouton spécial selon page */}
                {location.pathname === "/loans" && (
                  <button
                    onClick={user.role === "CHG" ? undefined : onAddLoan}
                    disabled={user.role === "CHG"}
                    className={`bg-blue-800 text-white px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base ${
                      user.role === "CHG"
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:bg-blue-700 cursor-pointer"
                    }`}
                  >
                    <span className="hidden sm:inline">Ajouter un prêt</span>
                    <span className="sm:hidden sm:text-sm">Ajout Prêt</span>
                  </button>
                )}

                {/* notification (seulement dashboard) */}
                {location.pathname === "/dashboard" && (
                  <button className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer">
                    <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                )}

                {/* Profil utilisateur */}
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xs sm:text-sm">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </span>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.role === "RES"
                        ? "Responsable"
                        : "Chargé de risques"}
                    </p>
                  </div>
                </div>

                {/* Bouton déconnexion */}
                <div className="relative">
                  {/* Version desktop (sm et plus) */}
                  <button
                    onClick={handleLogout}
                    className="hidden sm:flex bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 hover:border-gray-400 font-medium text-base cursor-pointer"
                  >
                    Déconnexion
                  </button>

                  {/* Version mobile (moins de sm) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLogoutMenuOpen(!isLogoutMenuOpen);
                    }}
                    className="sm:hidden bg-gray-100 border border-gray-300 text-gray-700 px-2 py-2 rounded-md hover:bg-gray-200 hover:border-gray-400 font-medium text-sm"
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>

                  {/* Menu déroulant mobile */}
                  {isLogoutMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 sm:hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogout();
                          setIsLogoutMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
