##  Architecture Technique
- **Backend** : Node.js + Express.js (MVC)
- **Frontend** : React + Vite + Tailwind CSS
- **Base de données** : MySQL + Prisma ORM
- **Authentification** : JWT + Argon2
- **Conteneurisation** : Docker 

##  Rôles Utilisateurs
- **RES** : Responsable d'agence (tous droits)
- **CHG** : Chargé de risques (droits limités) 
- **ADM** : Administrateur système

##  Structure du Projet
```
LoanGuard/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Logique métier
│   │   ├── middlewares/     # Middleware auth, validation
│   │   ├── routes/          # Routes API
│   │   └── utils/           # Utilitaires (JWT, etc.)
│   └── prisma/
│       ├── schema.prisma    # Schéma DB principal
│       └── models/          # Modèles séparés
└── frontend/
    └── src/
        ├── components/      # Composants réutilisables
        ├── pages/          # Pages de l'application
        └── services/       # Services API
```

##  Standards de Sécurité
-  Argon2 pour hachage des mots de passe (PAS bcrypt)
-  JWT pour l'authentification
-  Validation des données côté serveur ET client
-  Middleware d'authentification sur routes protégées
-  Jamais de mots de passe en clair

##  Standards de Code
- **Langue** : Variables et commentaires en français (contexte métier)
- **Style** : Code propre, bien indenté, fonctions courtes
- **Architecture** : MVC strict pour le backend
- **Frontend** : Composants fonctionnels avec hooks React
- **CSS** : Tailwind CSS uniquement

##  Installation et Démarrage

### Backend
```bash
cd backend
npm install
npm install argon2 jsonwebtoken
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend  
```bash
cd frontend
npm install
npm run dev
```

dans le dossier racine: 

npm create vite@latest frontend -- --template react

dans le dossier frontend:

npm install tailwindcss @tailwindcss/vite

ensuite on place dans src/index.css tout en haut:

@import "tailwindcss";

Lance les projets

Pour le backend (depuis le dossier backend) :

bash
npx nodemon index.js

Pour le frontend (depuis le dossier frontend) :

bash
npm run dev