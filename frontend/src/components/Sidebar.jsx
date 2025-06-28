import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChartBarIcon,
  BanknotesIcon,
  BellAlertIcon,
  CalculatorIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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
      id: "parametres",
      name: "Paramètres",
      icon: Cog6ToothIcon,
      route: "/settings",
      roles: ["RES"],
    },
  ];

  // Récupérer les données de l'utilisateur avec vérification
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  // Si pas d'utilisateur connecté, ne pas afficher la sidebar
  if (!user || !userRole) {
    return null;
  }

  const menuFilter = menuItems.filter((item) => item.roles.includes(userRole));
  const isActive = (route) => location.pathname === route;
  const handleNavigation = (route) => {
    navigate(route);
    setIsMobileOpen(false);
  };

  // Si aucun menu autorisé pour ce rôle
  if (menuFilter.length === 0) {
    return null;
  }

  return (
    <>
      {/* Bouton menu mobile intégré */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
        >
          {isMobileOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          {/* Logo et titre */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LG</span>
              </div>
              <h1 className="ml-3 text-gray-900 text-lg font-semibold">
                LoanGuard
              </h1>
            </div>
          </div>

          {/* Navigation */}
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
                    isActive(item.route) ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600"
                  } mr-3 flex-shrink-0 h-5 w-5`}
                />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar Mobile */}
      {isMobileOpen && (
        <div className="lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 flex z-40"
            onClick={() => setIsMobileOpen(false)}
          >
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>

            {/* Sidebar panel */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
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
                        isActive(item.route) ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600"
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
  )
}

export default Sidebar
