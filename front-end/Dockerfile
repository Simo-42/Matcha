# Utiliser une image de base Node.js pour le développement
FROM node:18-alpine AS development

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

COPY package*.json ./

# Installer les dépendances de développement
RUN npm install

# Copier tout le reste des fichiers du projet
COPY . .

EXPOSE 3000

# Commande pour démarrer Nuxt en mode développement
CMD ["npm", "run", "dev"]