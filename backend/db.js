// db.js fichier qui permet de gerer la connexion a la db
const { Pool } = require('pg'); 
require('dotenv').config();

const pool = new Pool({ // Classe existance qui gere la connexion avec la db
  user: process.env.POSTGRES_USER,
  host: 'db',  // Nom du service Docker pour le conteneur PostgreSQL
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRE_PORT,
});

module.exports = pool; // Rendre pool dispo aux autres fichiers 