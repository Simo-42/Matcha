DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    gender VARCHAR(255),  -- Nouvelle colonne pour le genre
    sexual_preference VARCHAR(255),  -- Nouvelle colonne pour la préférence sexuelle
    biography TEXT,  -- 
    interests JSON,  -- Tableau JSON pour les intérêts
    photos JSONB,  -- Tableau JSON pour stocker jusqu'à 5 URLs ou chemins de photos
    latitude DECIMAL(9,6),  -- Nouvelle colonne pour la latitude
    longitude DECIMAL(9,6),  -- Nouvelle colonne pour la longitude
    reset_token_expires TIMESTAMP,  -- pour email forget
    reset_token VARCHAR(255),  -- pour email forget
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
