import { useState, useEffect } from "react";
import authService from "../services/authService";
import riskService from "../services/riskService";
import userService from "../services/userService";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import UserModal from "../components/UserModal";
import DeleteUserModal from "../components/DeleteUserModal";

const Settings = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainMessage, setTrainMessage] = useState("");
  // états pour les utilisateurs
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const user = authService.getCurrentUser();

  const handleTrainModel = async () => {
    try {
      setIsTraining(true);
      setTrainMessage("Entraînement du modèle en cours...");
      const result = await riskService.trainModel();

      setTrainMessage(
        `${result.message} (${result.dataPoints} prêts utilisés)`
      );
      setTimeout(() => setTrainMessage(""), 5000);
    } catch {
      setTrainMessage("Erreur lors de l'entraînement");
      setTimeout(() => setTrainMessage(""), 5000);
    } finally {
      setIsTraining(false);
    }
  };

  // Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await userService.getUsers();
      setUsers(response.users);
    } catch (err) {
      console.error("Erreur récupération utilisateurs:", err);
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsUserModalOpen(true);
  };
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await userService.deleteUser(userToDelete.id);
      await fetchUsers();
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  const handleSaveUser = async (userData) => {
    if (isEditing) {
      await userService.updateUser(selectedUser.id, userData);
    } else {
      await userService.createUser(userData);
    }
    await fetchUsers(); // Pour rafraîchir la liste
  };
  //charger les utilisateurs au démarrage de la page
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-6 sm:space-y-8">
              {/* Tableau des utilisateurs */}
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h1 className="text-lg font-medium text-gray-900">
                    Utilisateurs
                  </h1>
                  {user.role === "RES" && (
                    <button
                      onClick={handleAddUser}
                      className="bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-900 hover:cursor-pointer"
                    >
                      Ajouter un utilisateur
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nom
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            Chargement des utilisateurs...
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-4 text-center text-red-500"
                          >
                            {error}
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            Aucun utilisateur trouvé
                          </td>
                        </tr>
                      ) : (
                        users.map((userItem) => (
                          <tr key={userItem.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {userItem.firstName} {userItem.lastName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {userItem.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {userItem.role === "RES"
                                ? "Responsable"
                                : "Chargé de risques"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {/* Logique pour CHG vs RES */}
                              {user.role === "CHG" ? (
                                /* CHG peut seulement modifier sa propre ligne */
                                user.id === userItem.id ? (
                                  <>
                                    <button
                                      onClick={() => handleEditUser(userItem)}
                                      className="text-blue-600 hover:text-blue-900 hover:cursor-pointer mr-4"
                                    >
                                      Modifier
                                    </button>
                                    <button
                                      disabled
                                      className="text-gray-400 cursor-not-allowed"
                                      title="Vous ne pouvez pas supprimer votre propre compte"
                                    >
                                      Supprimer
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-gray-400">Accès restreint</span>
                                )
                              ) : (
                                /* RES peut tout faire */
                                user.role === "RES" ? (
                                  <>
                                    <button
                                      onClick={() => handleEditUser(userItem)}
                                      className="text-blue-600 hover:text-blue-900 hover:cursor-pointer mr-4"
                                    >
                                      Modifier
                                    </button>
                                    <button
                                      onClick={() => handleDeleteUser(userItem)}
                                      className="text-red-600 hover:text-red-900 hover:cursor-pointer"
                                    >
                                      Supprimer
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-gray-400">Accès restreint</span>
                                )
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section Intelligence Artificielle - Seulement pour RES */}
              {user.role === "RES" && (
                <div className="bg-white rounded-lg shadow mb-8">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      Intelligence Artificielle
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="flex space-x-4 mb-4">
                      {/* Bouton Entraîner modèle IA - VERT */}
                      <button
                        onClick={handleTrainModel}
                        disabled={isTraining}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                          isTraining
                            ? "bg-green-300 text-green-800 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {isTraining ? "Entraînement..." : "Entraîner modèle IA"}
                      </button>

                      {/* Bouton Statistiques */}
                      <button className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
                        Statistiques
                      </button>
                    </div>

                    {/* Message de retour */}
                    {trainMessage && (
                      <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200">
                        <p className="text-sm text-green-700">{trainMessage}</p>
                      </div>
                    )}

                    {/* Informations sur le modèle */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">
                          Dernière mise à jour:
                        </span>
                        <span className="ml-2 text-gray-900">Aujourd'hui</span>
                      </div>
                      <div>
                        <span className="text-gray-500">
                          Précision actuelle:
                        </span>
                        <span className="ml-2 text-gray-900">72%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Logs d'activité */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Logs d'activité
                  </h2>
                </div>

                <div className="p-6">
                  <p className="text-gray-500 text-sm">
                    Aucune activité enregistrée pour le moment.
                  </p>
                  {/* Plus tard on pourra ajouter une vraie liste d'activités */}
                </div>
              </div>
            </div>
          </div>
          <UserModal
            isOpen={isUserModalOpen}
            onClose={() => setIsUserModalOpen(false)}
            onSave={handleSaveUser}
            user={selectedUser}
            isEditing={isEditing}
            isOwnProfile={user.role === "CHG" && isEditing && user.id === selectedUser?.id}
          />

          <DeleteUserModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDeleteUser}
            user={userToDelete}
          />
        </main>
      </div>
    </div>
  );
};

export default Settings;
