# Utiliser une image de base node
FROM node:20

# Installer pnpm globalement
RUN npm install -g pnpm

# Définir le shell et configurer le dossier global de pnpm
ENV SHELL=/bin/sh
RUN pnpm config set global-bin-dir /usr/local/bin
RUN pnpm add -g nodemon

# Créer et définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration pour installer les dépendances
COPY package.json pnpm-lock.yaml ./

# Installer toutes les dépendances, y compris les devDependencies
RUN pnpm install --prod=false

# Copier le reste des fichiers dans le conteneur
COPY . .

# Exposer le port de l'application
EXPOSE 3005

# Utiliser nodemon pour le démarrage en développement
CMD ["nodemon", "server.js"]
