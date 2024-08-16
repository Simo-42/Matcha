// Importation des différents modules
const express = require('express');
const cors = require('cors'); // Importer le middleware CORS
const cookieParser = require('cookie-parser'); // Importer cookie-parser pour gérer les cookies
require('dotenv').config(); // Charger les variables d'environnement depuis le fichier .env
const app = express(); // Initialisation de l'application express

app.use(express.json()); // Middleware pour parser le corps des requêtes JSON
app.use(cors({
  origin: 'http://localhost:3000', // Remplace par le domaine de ton frontend
  credentials: true // Permet l'envoi des cookies
})); // Utiliser le middleware CORS pour autoriser toutes les origines
app.use(cookieParser()); // Pour gérer les cookies

// Importation des routes


// Toutes les routes cote serveur ici 
const authRouter = require('./routes/auth');
const passwordForgotRouter = require('./routes/pass_forgot');
const jwtRouter = require('./routes/jwt');
const afterAuthRouter = require('./routes/after_auth');

app.use('/api/auth', authRouter);
app.use('/api/password', passwordForgotRouter);
app.use('/api/jwt', jwtRouter);
app.use('/api/after_auth', afterAuthRouter);

// Définir le port et démarrer le serveur
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
