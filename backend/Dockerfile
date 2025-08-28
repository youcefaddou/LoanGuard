FROM node:20-alpine3.19

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production && npm cache clean --force

# Copier le code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Changer la propriété des fichiers vers l'utilisateur non-root
RUN chown -R nodeuser:nodejs /app
USER nodeuser

# Exposer le port
EXPOSE 5000

# Commande de démarrage
CMD ["npm", "start"]