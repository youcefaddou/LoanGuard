```markdown
LoanGuard est une application pour simuler le risque de défaut de remboursement de crédits bancaires. Elle intègre la gestion multi-agence, la gestion des prêts et des utilisateurs, et fournit des outils d'analyse pour évaluer la probabilité de non-remboursement.

LoanGuard contient :
- un backend (API, logique métier, gestion des données),
- un frontend (interface d'administration et d'analyse),
- une landing page,
- des fichiers de configuration pour le déploiement (PM2 + Nginx en production, Docker en solution de secours).

Principales fonctionnalités
- Modélisation et simulation du risque de défaut pour un prêt.
- Gestion multi-agence (création, modification, périmètre des données).
- Gestion des prêts : création, suivi, tableau d'amortissement et statut.
- Gestion des utilisateurs et des rôles (admin, agent, analyste).
- Tableaux et rapports pour l'analyse du portefeuille de crédits.
- API REST pour intégration et automatisation.

Arborescence principale (extraits)
- backend/ — code serveur (API, logique métier)
- frontend/ — application cliente (interface utilisateur)
- landing/ — page de présentation publique
- DEPLOY.md — procédure de déploiement complète (PM2, Nginx, variables d'environnement)
- docker-compose.yml — configuration Docker (option de secours/fallback)
- nginx.conf — configuration Nginx fournie pour le reverse proxy
- package.json / package-lock.json — dépendances et scripts npm
- .vscode/ — configuration d'éditeur (locale)

Démarrage (développement)
1. Cloner le dépôt :
   git clone https://github.com/youcefaddou/LoanGuard.git
   cd LoanGuard

2. Lancer le backend et le frontend en local :
   - Backend :
     cd backend
     npm install
     npm run start
   - Frontend :
     cd frontend
     npm install
     npm run dev

3. Si vous préférez utiliser Docker (fallback) :
   docker-compose up --build

Déploiement (production)
- Procédure recommandée : utiliser PM2 pour gérer les processus Node.js et Nginx en reverse proxy. Le dépôt contient DEPLOY.md qui décrit les étapes d'installation, les variables d'environnement à définir et la configuration Nginx utilisée lors du déploiement réussi sur un VPS Ubuntu.
- Docker est fourni comme plan B si vous préférez déployer en conteneurs, mais la configuration en production utilisée ici est PM2 + Nginx.

Points d'attention
- Vérifier et sécuriser les variables d'environnement (base de données, JWT, secrets).
- Valider et tester les modèles de scoring avant usage en production.
- Respecter la protection des données personnelles si l'application traite des informations réelles.

Contribuer
- Ouvrir une issue pour signaler un bug ou proposer une amélioration.
- Soumettre des branches et PR claires, avec descriptions et tests si possible.

Auteur
- youcefaddou

Ressources et fichiers utiles
- DEPLOY.md — instructions complètes de déploiement
- nginx.conf — modèle de configuration pour le reverse proxy
- docker-compose.yml — orchestration Docker (option de secours)
```
