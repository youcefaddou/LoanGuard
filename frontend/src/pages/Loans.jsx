import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Loans = () => {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {/* Contenu des prêts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-full">
            <h2 className="text-xl font-semibold p-4">Liste des Prêts</h2>
            {/* Ici vous pouvez ajouter le contenu spécifique aux prêts */}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Loans;