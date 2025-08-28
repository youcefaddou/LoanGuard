# Stage de build
FROM node:20-alpine3.19 as build

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci && npm cache clean --force

# Copier le code source
COPY . .

# Changer la propriété vers l'utilisateur non-root
RUN chown -R nodeuser:nodejs /app
USER nodeuser

# Build Next.js en mode export statique
RUN npm run build

# Stage de production avec CHAINGUARD
FROM cgr.dev/chainguard/nginx:latest

# Copier les fichiers buildés depuis le stage précédent
COPY --from=build /app/out /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Démarrer Nginx en mode non-daemon
CMD ["nginx", "-g", "daemon off;"]