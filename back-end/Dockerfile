
# Utiliser une image de base officielle Node.js 18 alpine
FROM node:16.13

# Créer un répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer uniquement les dépendances de production (ou développement si nécessaire)
RUN npm ci --only=production

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port de l'application
EXPOSE 3005

# Démarrer l'application Express
CMD ["npm", "start"]
