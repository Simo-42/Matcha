# Nom du fichier docker-compose
DOCKER_COMPOSE_FILE = docker-compose.yml

# Nom des services dans docker-compose
APP_SERVICE = backend_application
DB_SERVICE = postgres_database
PGADMIN_SERVICE = pgadmin
SCHEMA_FILE = models/schema.sql

# Commande pour démarrer les conteneurs en mode détaché
start:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up --build --remove-orphans

# Commande pour arrêter les conteneurs
stop:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down --timeout 10

# Commande pour forcer l'arrêt des conteneurs si nécessaire
force-stop:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down || docker stop $(shell docker ps -q) || docker kill $(shell docker ps -q)

# Commande pour vérifier l'état des conteneurs
status:
	docker-compose -f $(DOCKER_COMPOSE_FILE) ps

# Commande pour afficher les logs des conteneurs
logs:
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f

# Commande pour redémarrer les conteneurs (supprimer et reconstruire)
restart:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down && docker-compose -f $(DOCKER_COMPOSE_FILE) up -d --build --remove-orphans

# Commande pour copier et appliquer le fichier schema.sql
apply-schema:
	docker exec -it $(DB_SERVICE) bash -c 'psql -U $$POSTGRES_USER -d $$POSTGRES_DB -f /docker-entrypoint-initdb.d/schema.sql'


help:
	@echo "Usage:"
	@echo "  make start         - Build and start the containers in detached mode"
	@echo "  make stop          - Stop and remove the containers"
	@echo "  make force-stop    - Force stop and kill all running containers"
	@echo "  make status        - Show the status of the containers"
	@echo "  make logs          - Follow the logs of the containers"
	@echo "  make restart       - Restart the containers by removing and rebuilding them"
	@echo "  make apply-schema y and apply schema.sql to the database"
	@echo "  make help          - Show this help message"
	# @echo "  make full-rebuild  - Stop and remove all containers, images, volumes and rebuild the containers"e