import { lazy, Suspense } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

// Lazy loading des composants lourds
const RiskMap = lazy(() => import("../components/RiskMap"));
const RiskEvolutionChart = lazy(() => import("../components/RiskEvolutionChart"));
const LoanWatchlist = lazy(() => import("../components/LoanWatchlist"));
const QuickActions = lazy(() => import("../components/QuickActions"));

// Skeleton simple pour le loading
const ComponentSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-gray-200 rounded mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-h-screen ">
        <Header />
        <main className="flex-1 p-2 sm:p-3 lg:p-2">
          {/* Grid 2x2 pour les 4 containers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-1">
            {/* Container 1 - Top Left: Prêts à surveiller */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px] p-4">
              <Suspense fallback={<ComponentSkeleton />}>
                <LoanWatchlist />
              </Suspense>
            </div>

            {/* Container 2 - Top Right: Carte des risques */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px] p-4">
              <Suspense fallback={<ComponentSkeleton />}>
                <RiskMap />
              </Suspense>
            </div>

            {/* Container 3 - Bottom Left: Évolution des scores */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px] p-4">
              <Suspense fallback={<ComponentSkeleton />}>
                <RiskEvolutionChart />
              </Suspense>
            </div>

            {/* Container 4 - Bottom Right: Actions rapides */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px] p-4">
              <Suspense fallback={<ComponentSkeleton />}>
                <QuickActions />
              </Suspense>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;