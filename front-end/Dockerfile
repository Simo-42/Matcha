# Utiliser une image de base Node.js pour le développement
FROM node:18-alpine AS development

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances de développement
RUN npm install

# Copier tout le reste des fichiers du projet
COPY . .

CMD rm -rf /tmp/nitro && npm run dev -- --host 0.0.0.0 --port 3000

# Exposer le port sur lequel Nuxt.js est accessible en mode développement
ENV HOST 0.0.0.0

EXPOSE 3000

# Commande pour démarrer Nuxt en mode développement
CMD ["npm", "run", "dev"]
