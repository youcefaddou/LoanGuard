import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../services/validation';

const Login = () => {
  const navigate = useNavigate();
  
  // État pour les données du formulaire
  const [role, setRole] = useState('CHG');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation des champs 
  // Gestion des changements dans les champs
  const handleRoleChange = (e) => {
    setRole(e.target.value)
  };

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    setEmailError('') // effacer l'erreur lors de la saisie
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    setPasswordError('')
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setEmailError('')
    setPasswordError('')
    setLoading(true)

    // Validation côté client
    const emailValidation = validateEmail(email)
    const passwordValidation = validatePassword(password)

    if (emailValidation || passwordValidation) {
      setEmailError(emailValidation)
      setPasswordError(passwordValidation)
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          role: role
        }),
      })

      const result = await response.json()

      if (response.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        // Si RES avec plusieurs agences, redirect vers selection de la banque
        if (result.requiresBankSelection) {
          navigate('/select-bank');
        } else {
          if (result.selectedBank) {
            localStorage.setItem('selectedBankId', result.selectedBank.id);
            localStorage.setItem('selectedBank', JSON.stringify(result.selectedBank));
          }
          // Redirection vers le dashboard
          navigate('/dashboard');
        }
      } else {
        setError(result.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Erreur connexion:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2FE] to-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-auto">
        {/* Logo et titre */}
        <div className="text-center pt-8 pb-8 px-8">
          <div className="flex items-center justify-center mb-3">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1E40AF] rounded-xl mr-3">
              <span className="text-white text-lg font-bold">LG</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1E40AF]">LoanGuard</h1>
          </div>
          <p className="text-gray-500 ">La prévention devient votre stratégie</p>
        </div>

        {/* Formulaire */}
        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Champ Rôle */}
            <div className="!px-4 mx-auto">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Rôle
              </label>
              <select
                id="role"
                value={role}
                onChange={handleRoleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white shadow-sm"
              >
                <option value="CHG">Chargé de risques</option>
                <option value="RES">Responsable d'agence</option>
              </select>
            </div>

            {/* Champ Email */}
            <div className="px-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="votre.email@entreprise.com"
                required
                className={`w-full px-4 py-3 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm`}
              />
              {emailError && (
                <p className="text-red-600 text-xs mt-1">{emailError}</p>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div className="px-4">
              <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="motDePasse"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••••••"
                required
                className={`w-full px-4 py-3 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm`}
              />
              {passwordError && (
                <p className="text-red-600 text-xs mt-1">{passwordError}</p>
              )}
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="px-4">
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              </div>
            )}

            {/* Bouton de connexion */}
            <div className="px-4 pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#1E40AF] to-[#10B981] text-white py-3 px-4 rounded-lg text-sm font-medium hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>

            {/* Lien mot de passe oublié */}
            <div className="px-4 text-center pt-2">
              <a 
                href="#" 
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                Mot de passe oublié ?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
