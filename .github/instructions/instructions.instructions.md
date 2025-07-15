---
applyTo: '**'
---
# Instructions GitHub Copilot - LoanGuard

## Contexte du Projet
Tu travailles sur **LoanGuard**, une application bancaire de gestion des risques de crédit.

**IMPORTANT** : C'est un projet de certification développeur web niveau débutant.

## Architecture Technique
- **Backend** : Node.js + Express.js (architecture MVC stricte)
- **Frontend** : React + Vite + Tailwind CSS
- **Base de données** : MySQL avec Prisma ORM
- **Authentification** : JWT + Argon2 (JAMAIS bcrypt)

## Rôles Utilisateurs
- **RES** : Responsable d'agence (tous droits)
- **CHG** : Chargé de risques (droits limités)
- **ADM** : Administrateur

## Règles de Code OBLIGATOIRES

### Backend
- Architecture MVC stricte
- Toujours utiliser Prisma ORM pour la DB
- Argon2 pour hachage mots de passe (PAS bcrypt)
- JWT pour authentification
- Messages d'erreur en français
- Gestion d'erreurs avec try/catch
- Validation des données d'entrée

### Frontend
- Composants React fonctionnels avec hooks
- Tailwind CSS uniquement
- Interface responsive
- Appels API avec fetch
- Jamais de popups ou alertes JavaScript genre `alert()`, `confirm()`, `prompt()`


### Sécurité
- Jamais de mots de passe en clair
- Middleware d'auth sur routes protégées
- Validation côté serveur ET client
- Tokens JWT sécurisés

## Style de Code
- INTERDICTION d'utiliser le chainage optionnel (`?.`) dans le code
- Variables en anglais 
- commentaires ainsi que messages en français (contexte bancaire)
- Code propre et bien commenté (pour jury)
- Fonctions courtes et spécifiques
- Indentation cohérente
- pas d'émotes


## Exemples de Code Attendu

### Authentification (Backend)
```javascript
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, motDePasse, role } = req.body;
  
  try {
    // Recherche utilisateur avec Prisma
    const utilisateur = await prisma.user.findFirst({
      where: { email, role }
    });
    
    if (!utilisateur) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérification avec Argon2
    const motDePasseValide = await argon2.verify(utilisateur.motDePasse, motDePasse);
    
    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }
    
    // Génération token JWT
    const token = jwt.sign(
      { id: utilisateur.id, role: utilisateur.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Connexion réussie',
      token,
      utilisateur: { id: utilisateur.id, nom: utilisateur.nom, role: utilisateur.role }
    });
    
  } catch (erreur) {
    console.error('Erreur connexion:', erreur);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
```

### Composant React (Frontend)
```jsx
import { useState } from 'react';

const LoginForm = () => {
  const [donnees, setDonnees] = useState({
    email: '',
    motDePasse: '',
    role: 'CHG'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donnees)
      });
      
      if (reponse.ok) {
        const resultat = await reponse.json();
        localStorage.setItem('token', resultat.token);
        // Redirection...
      }
    } catch (erreur) {
      console.error('Erreur connexion:', erreur);
    }
  };

  return (
    <form onSubmit={gererSoumission} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Connexion LoanGuard</h2>
      {/* ... champs du formulaire ... */}
    </form>
  );
};
```

## Points d'Attention pour Jury
- Code lisible et commenté
- Sécurité correctement implémentée
- Architecture MVC respectée
- Bonnes pratiques web suivies
- Interface utilisateur professionnelle
