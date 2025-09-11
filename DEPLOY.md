# Déploiement simple - LoanGuard

Cette page décrit la procédure minimale pour construire et lancer les services de LoanGuard en local avec Docker, et les commandes utilisées en développement.

Prérequis
- Docker installé
- Node.js et npm (pour les développements locaux)
- Fichiers .env configurés dans chaque dossier (backend/.env, frontend/.env si besoin)

Étapes rapides (local / conteneur)
1. Backend
```bash
# depuis la racine du repo
cd backend
# installer si nécessaire (pour tests locaux)
npm install

# générer le client Prisma (si changement du schema)
npx prisma generate

# construire l'image Docker
docker build -t loanguard-backend .

# lancer le conteneur (exemple, adapter ports et .env)
docker run -d --name loanguard-backend --env-file ./backend/.env -p 3000:3000 loanguard-backend
```

2. Frontend
```bash
cd frontend
npm install

# construire l'image Docker
docker build -t loanguard-frontend .

# lancer le conteneur (adapter port selon Vite)
docker run -d --name loanguard-frontend -p 5173:5173 loanguard-frontend
```

3. Option : utiliser docker-compose  
Si tu souhaites centraliser : ajouter un fichier docker-compose.yml à la racine et lancer :
```bash
docker compose up -d --build
```

Bonnes pratiques
- Toujours utiliser un fichier `.env.example` pour lister les variables nécessaires sans y mettre de secrets.
- Ne pas committer les fichiers `.env`.
- Vérifier les logs avec `docker logs -f <container>` après démarrage.
- Pour appliquer des migrations Prisma : `npx prisma migrate deploy` / `npx prisma migrate dev` selon le contexte.

Exemples et notes
- Les README déjà présents dans backend/ et frontend/ contiennent les commandes exactes tapées lors du développement (npm install, prisma generate, npm run dev...). Ce fichier DEPLOY.md regroupe les commandes Docker et les étapes de base pour déployer rapidement en local.
