# Utiliser une image de base node
FROM node:20

# Créer et définir le répertoire de travail
WORKDIR /app

# Copier le fichier package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers dans le répertoire de travail du conteneur
COPY . .

# Exposer le port sur lequel l'application va tourner
EXPOSE 3005

# Démarrer l'application
CMD ["npm", "start"]
