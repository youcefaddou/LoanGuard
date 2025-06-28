import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Tableau de bord LoanGuard
          </h1>

          {/* Zone de contenu temporaire */}
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">
              Bienvenue sur votre dashboard ! Contenu à venir...
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
