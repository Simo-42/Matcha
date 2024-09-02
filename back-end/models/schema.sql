DROP TABLE IF EXISTS users, matches, likes, messages, blocks, profile_visits, reports, notifications;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    age INTEGER ,
    fame_rating INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    profile_complete BOOLEAN DEFAULT FALSE,
    gender VARCHAR(255),  -- Nouvelle colonne pour le genre
    sexual_preference VARCHAR(255),  -- Nouvelle colonne pour la préférence sexuelle
    biography TEXT,  -- 
    interests JSON,  -- Tableau JSON pour les intérêts
    photos VARCHAR(255)[],  -- Tableau pour les photos
    location VARCHAR(255),  -- Nouvelle colonne pour la localisation
    reset_token_expires TIMESTAMP,  -- pour email forget
    reset_token VARCHAR(255),  -- pour email forget
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Nouvelle colonne pour la dernière connexion
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Many to many relation between users for matches
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    user_id_1 INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user_id_2 INTEGER REFERENCES users(id) ON DELETE CASCADE,
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX unique_match_index ON matches (
    LEAST(user_id_1, user_id_2),
    GREATEST(user_id_1, user_id_2)
);
-- One to many relation between users for likes
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id_from INT NOT NULL,
    user_id_to INT NOT NULL,
    liked BOOLEAN NOT NULL,  -- true for like, false for dislike
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id_from) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id_to) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id_from, user_id_to) -- Prevent duplicate likes
);

-- One to many relation between users for messages
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,  -- Identifiant unique pour chaque message
    sender_id INT NOT NULL,  -- ID de l'utilisateur qui envoie le message
    receiver_id INT NOT NULL,  -- ID de l'utilisateur qui reçoit le message
    message_text TEXT NOT NULL,  -- Contenu du message
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Date et heure d'envoi du message
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,  -- Lien avec l'utilisateur qui envoie le message
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE  -- Lien avec l'utilisateur qui reçoit le message
);
-- One to many relation between users for blocks
CREATE TABLE blocks (
    id SERIAL PRIMARY KEY,  -- Identifiant unique pour chaque blocage
    user_id_from INT NOT NULL,  -- L'utilisateur qui bloque
    user_id_to INT NOT NULL,  -- L'utilisateur qui est bloqué
    blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Date et heure du blocage
    FOREIGN KEY (user_id_from) REFERENCES users(id) ON DELETE CASCADE,  -- Relation avec la table users, supprime le blocage si l'utilisateur qui bloque est supprimé
    FOREIGN KEY (user_id_to) REFERENCES users(id) ON DELETE CASCADE,  -- Relation avec la table users, supprime le blocage si l'utilisateur bloqué est supprimé
    UNIQUE(user_id_from, user_id_to)  -- Assure qu'un utilisateur ne peut bloquer un autre utilisateur qu'une seule fois
);
-- One to many relation between users for profile visits
CREATE TABLE profile_visits ( 
    id SERIAL PRIMARY KEY,                         -- Clé primaire pour identifier chaque visite unique
    user_id_from INT NOT NULL,                     -- L'utilisateur qui visite un autre profil
    user_id_to INT NOT NULL,                       -- L'utilisateur dont le profil est visité
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- La date et l'heure de la visite
    FOREIGN KEY (user_id_from) REFERENCES users(id) ON DELETE CASCADE,  -- Relation avec l'utilisateur visiteur
    FOREIGN KEY (user_id_to) REFERENCES users(id) ON DELETE CASCADE     -- Relation avec l'utilisateur visité
);
-- One to many relation between users for reports 
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    user_id_from INT NOT NULL,
    user_id_to INT NOT NULL,
    reason TEXT,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id_from) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id_to) REFERENCES users(id) ON DELETE CASCADE
);
-- Relation one to many entre les utilisateurs et les notifications
CREATE TABLE notifications ( 
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,  -- L'utilisateur qui reçoit la notification
    type VARCHAR(50) NOT NULL,  -- Type de notification (ex: 'like', 'message', 'visit', 'match', etc.)
    message TEXT,  -- Optionnel : Message associé à la notification
    is_read BOOLEAN DEFAULT FALSE,  -- Indique si la notification a été lue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Date et heure de création de la notification
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Relation avec l'utilisateur qui reçoit la notification
);
