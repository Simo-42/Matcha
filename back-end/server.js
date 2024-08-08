// Importation des différents modules
const express = require('express');
const cors = require('cors'); // Importer le middleware CORS
require('dotenv').config(); // Charger les variables d'environnement depuis le fichier .env

const app = express(); // Initialisation de l'application express

app.use(express.json()); // Middleware pour parser le corps des requêtes JSON
app.use(cors()); // Utiliser le middleware CORS pour autoriser toutes les origines

// Importation des routes
const authRouter = require('./routes/auth');
const passwordForgotRouter = require('./routes/pass_forgot');

app.use('/api/auth', authRouter);
app.use('/api/password', passwordForgotRouter);

// Définir le port et démarrer le serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
