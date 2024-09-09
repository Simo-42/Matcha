// Importation des différents modules
const express = require('express');
const cors = require('cors'); // Importer le middleware CORS
const cookieParser = require('cookie-parser'); // Importer cookie-parser pour gérer les cookies
require('dotenv').config(); // Charger les variables d'environnement depuis le fichier .env
const path = require('path');
const app = express(); // Initialisation de l'application express

app.use(express.json({ limit: '10mb' })); // Permettre à l'application d'accepter les données JSON surtout pour les images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  origin: 'http://localhost:3000', // Remplace par le domaine de ton frontend
  credentials: true // Permet l'envoi des cookies

})); // Utiliser le middleware CORS pour autoriser toutes les origines


app.use(cookieParser()); // Pour gérer les cookies


const authRouter = require('./routes/auth');
const passwordForgotRouter = require('./routes/pass_forgot');
const jwtRouter = require('./routes/jwt');
const afterAuthRouter = require('./routes/after_auth');
const SwipeRouter = require('./routes/swipe');
const uploadRouter = require('./routes/upload'); // Importer le routeur upload

app.use('/api/auth', authRouter);
app.use('/api/password', passwordForgotRouter);
app.use('/api/jwt', jwtRouter);
app.use('/api/after_auth', afterAuthRouter);
app.use('/api/swipe', SwipeRouter);
app.use('/api/upload', uploadRouter); // Utiliser le routeur upload
// Définir le port et démarrer le serveur
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
