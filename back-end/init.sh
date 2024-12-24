#!/bin/bash
echo "Initialisation du schéma SQL..."

# Création de l'utilisateur postgres (optionnel si nécessaire)
psql -U root -d "$POSTGRES_DB" -c "CREATE ROLE postgres WITH SUPERUSER CREATEDB CREATEROLE LOGIN PASSWORD '$POSTGRES_PASSWORD';"

# Importer le schéma SQL
psql -U root -d "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/schema.sql
