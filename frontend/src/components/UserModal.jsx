import { useState, useEffect } from "react";

const UserModal = ({ isOpen, onClose, onSave, user, isEditing, isOwnProfile }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "CHG",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Pré-remplir les champs quand user change
  useEffect(() => {
    if (user && isEditing) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: user.role || "CHG",
        password: "",
        confirmPassword: "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "CHG",
        password: "",
        confirmPassword: "",
      });
    }
    setError("");
  }, [user, isEditing, isOpen]);

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Regex pour validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[a-zA-ZÀ-ÿ\s-']+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    // Validation du prénom et nom avec regex
    if (!nameRegex.test(formData.firstName)) {
      setError("Le prénom ne doit contenir que des lettres, espaces, tirets et apostrophes");
      return;
    }

    if (!nameRegex.test(formData.lastName)) {
      setError("Le nom ne doit contenir que des lettres, espaces, tirets et apostrophes");
      return;
    }

    // Validation de l'email avec regex
    if (!emailRegex.test(formData.email)) {
      setError("Veuillez saisir un email valide");
      return;
    }

    if (!isEditing) {
      // Validation pour création
      if (!formData.password) {
        setError("Le mot de passe est obligatoire pour un nouvel utilisateur");
        return;
      }
      if (!passwordRegex.test(formData.password)) {
        setError("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)");
        return;
      }
      if (!formData.confirmPassword) {
        setError("Veuillez confirmer le mot de passe");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        return;
      }
    } else {
      // Validation pour modification
      if (formData.password && !passwordRegex.test(formData.password)) {
        setError("Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)");
        return;
      }
      if (formData.password && !formData.confirmPassword) {
        setError("Veuillez confirmer le nouveau mot de passe");
        return;
      }
      if (formData.password && formData.password !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      setError("");

      await onSave(formData);
      onClose();
    } catch (error) {
      setError(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isEditing ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-700 hover:cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Prénom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full border border-gray-300 rounded-md px-3 py-2 ${isOwnProfile ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                required
                readOnly={isOwnProfile}
              />
              {isOwnProfile && (
                <p className="text-xs text-gray-500 mt-1">Vous ne pouvez pas modifier votre prénom</p>
              )}
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full border border-gray-300 rounded-md px-3 py-2 ${isOwnProfile ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                required
                readOnly={isOwnProfile}
              />
              {isOwnProfile && (
                <p className="text-xs text-gray-500 mt-1">Vous ne pouvez pas modifier votre nom</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            {/* Rôle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full border border-gray-300 rounded-md px-3 py-2 ${isOwnProfile ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                disabled={isOwnProfile}
              >
                <option value="CHG">Chargé de risques</option>
                <option value="RES">Responsable</option>
              </select>
              {isOwnProfile && (
                <p className="text-xs text-gray-500 mt-1">Vous ne pouvez pas modifier votre rôle</p>
              )}
            </div>

            {/* Mots de passe */}
            {!isEditing ? (
              /* Création d'utilisateur */
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
              </>
            ) : (
              /* Modification d'utilisateur */
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe (optionnel)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Laissez vide pour conserver le mot de passe actuel"
                  />
                </div>
                {formData.password && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmer le nouveau mot de passe *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                )}
              </>
            )}

            {/* Message d'erreur */}
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 hover:cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 hover:cursor-pointer"
            >
              {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
