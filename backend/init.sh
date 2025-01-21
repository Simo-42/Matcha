#!/bin/bash
echo "Initialisation du schéma SQL..."

psql -U root -d "$POSTGRES_DB" -h postgres_database -c "CREATE ROLE postgres WITH SUPERUSER CREATEDB CREATEROLE LOGIN PASSWORD '$POSTGRES_PASSWORD';"

psql -U root -d "$POSTGRES_DB" -h postgres_database -f /docker-entrypoint-initdb.d/schema.sql

