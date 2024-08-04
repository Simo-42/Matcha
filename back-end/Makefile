# Nom du fichier docker-compose
DOCKER_COMPOSE_FILE = docker-compose.yml

# Nom du service de l'application dans docker-compose
APP_SERVICE = app

# Commande pour démarrer les conteneurs en mode détaché
start:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d --build

# Commande pour arrêter les conteneurs
stop:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

# Commande pour exécuter les migrations Prisma
migrate:
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec $(APP_SERVICE) npx prisma migrate dev --name init

# Commande pour générer Prisma Client
generate:
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec $(APP_SERVICE) npx prisma generate

# Commande pour vérifier l'état des conteneurs
status:
	docker-compose -f $(DOCKER_COMPOSE_FILE) ps

# Commande pour afficher les logs des conteneurs
logs:
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f

# Commande pour redémarrer les conteneurs
restart: down up

# Commande pour lancer Prisma Studio
studio:
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec $(APP_SERVICE) npx prisma studio --port 5555

# Commande pour réinitialiser la base de données et appliquer les migrations
reset:
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec $(APP_SERVICE) npx prisma migrate reset --force --skip-seed

# Commande pour afficher les aides
help:
	@echo "Usage:"
	@echo "  make start       - Build and start the containers in detached mode"
	@echo "  make stop        - Stop and remove the containers"
	@echo "  make migrate     - Run Prisma migrations"
	@echo "  make generate    - Generate Prisma client"
	@echo "  make status      - Show the status of the containers"
	@echo "  make logs        - Follow the logs of the containers"
	@echo "  make restart     - Restart the containers"
	@echo "  make studio      - Launch Prisma Studio"
	@echo "  make reset       - Reset the database and apply migrations"
	@echo "  make help        - Show this help message"
