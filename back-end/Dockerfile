# Utiliser une image de base node
FROM node:20

# Installer pnpm globalement
RUN npm install -g pnpm

# Définir le shell par défaut pour le conteneur
# Cela aide certaines commandes (comme `pnpm setup`) à identifier quel shell est utilisé.
# Ici, nous utilisons "/bin/sh" pour indiquer un shell compatible POSIX.
ENV SHELL=/bin/sh

# Configurer le répertoire global des binaires pour pnpm
# Cette commande indique à pnpm d'utiliser /usr/local/bin pour installer les packages globaux.
# Ce répertoire est généralement inclus dans le PATH, ce qui rend les packages accessibles partout.
RUN pnpm config set global-bin-dir /usr/local/bin

# Installer nodemon globalement avec pnpm
# Le flag "-g" (global) installe nodemon dans le répertoire global défini précédemment.
# Cela permet d’utiliser `nodemon` depuis n'importe où dans le conteneur, notamment dans la commande CMD.
RUN pnpm add -g nodemon

# Créer et définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration pour installer les dépendances
COPY package.json pnpm-lock.yaml ./

# Installer toutes les dépendances, y compris les devDependencies
RUN pnpm install --prod=false

COPY init.sh /docker-entrypoint-initdb.d/
RUN chmod +777 /docker-entrypoint-initdb.d/init.sh

# Copier le reste des fichiers dans le conteneur
COPY . .

# Exposer le port de l'application
EXPOSE 3005

# Utiliser nodemon pour le démarrage en développement
CMD ["nodemon", "server.js"]
