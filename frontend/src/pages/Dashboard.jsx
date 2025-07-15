import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import LoanWatchlist from "../components/LoanWatchlist";
import QuickActions from "../components/QuickActions";
import RiskChart from "../components/RiskChart";
import RiskMap from "../components/RiskMap";
import Footer from "../components/Footer";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-2 sm:p-3 lg:p-2">
          {/* Grid 2x2 pour les 4 containers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-1">
            {/* Container 1 - Top Left: Prêts à surveiller */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
              <LoanWatchlist />
            </div>

            {/* Container 2 - Top Right: Carte des risques */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
              <RiskMap />
            </div>

            {/* Container 3 - Bottom Left: Évolution des scores */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
              <RiskChart />
            </div>

            {/* Container 4 - Bottom Right: Actions rapides */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
              <QuickActions />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
