import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import {
  ChartBarIcon,
  BanknotesIcon,
  BellAlertIcon,
  CalculatorIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      name: "Tableau de bord",
      icon: ChartBarIcon,
      route: "/dashboard",
      roles: ["CHG", "RES"],
    },
    {
      id: "prets",
      name: "Prêts",
      icon: BanknotesIcon,
      route: "/loans",
      roles: ["CHG", "RES"],
    },
    {
      id: "alertes",
      name: "Alertes",
      icon: BellAlertIcon,
      route: "/alerts",
      roles: ["CHG", "RES"],
    },
    {
      id: "simulateur",
      name: "Simulateur de prêt",
      icon: CalculatorIcon,
      route: "/simulator",
      roles: ["CHG", "RES"],
    },
    {
      id: "entreprises",
      name: "Entreprises",
      icon: BuildingOfficeIcon,
      route: "/companies",
      roles: ["CHG", "RES"],
    },
    {
      id: "parametres",
      name: "Paramètres",
      icon: Cog6ToothIcon,
      route: "/settings",
      roles: ["RES", "CHG"],
    },
  ];

  // Récupérer les données utilisateur au chargement
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData.user);
      }
    };
    fetchUserData();
  }, []);

  // Écouter les changements depuis le Header
  useEffect(() => {
    const handleMenuToggle = () => {
      setIsMobileOpen((prev) => !prev);
    };

    // Écouter l'événement personnalisé
    window.addEventListener("toggleMobileMenu", handleMenuToggle);

    return () => {
      window.removeEventListener("toggleMobileMenu", handleMenuToggle);
    };
  }, []);

  // Si les données ne sont pas encore chargées, afficher un squelette de chargement
  if (!user) {
    return (
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
            <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="ml-3 h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const userRole = user.role;

  const menuFilter = menuItems.filter((item) => item.roles.includes(userRole));

  const isActive = (route) => location.pathname === route;
  const handleNavigation = (route) => {
    navigate(route);
    setIsMobileOpen(false);
  };

  //si aucun menu autorisé pour ce role
  if (menuFilter.length === 0) {
    return null;
  }

  return (
    <>
      {/* Sidebar Desktop - toujours visible sur lg+ */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            {/* Logo desktop */}
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LG</span>
                </div>
                <h1 className="ml-3 text-gray-900 text-lg font-semibold">
                  LoanGuard
                </h1>
              </div>
            </div>

            {/* Navigation desktop */}
            <nav className="mt-5 flex-1 px-2 space-y-1 overflow-y-auto">
              {menuFilter.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.route)}
                  className={`${
                    isActive(item.route)
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-l-md w-full text-left hover:cursor-pointer`}
                >
                  <item.icon
                    className={`${
                      isActive(item.route)
                        ? "text-blue-700"
                        : "text-gray-400 group-hover:text-gray-600"
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar Mobile - seulement sur mobile/tablette */}
      {isMobileOpen && (
        <div className="lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 flex z-[1001]"
            onClick={() => setIsMobileOpen(false)}
          >
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm bg-opacity-75"></div>

            {/* Sidebar panel */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white border-r border-gray-200">
              {/* Logo mobile */}
              <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">LG</span>
                  </div>
                  <h1 className="ml-3 text-gray-900 text-lg font-semibold">
                    LoanGuard
                  </h1>
                </div>
              </div>

              {/* Navigation mobile */}
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {menuFilter.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.route)}
                    className={`${
                      isActive(item.route)
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-l-md w-full text-left`}
                  >
                    <item.icon
                      className={`${
                        isActive(item.route)
                          ? "text-blue-700"
                          : "text-gray-400 group-hover:text-gray-600"
                      } mr-3 flex-shrink-0 h-5 w-5`}
                    />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
