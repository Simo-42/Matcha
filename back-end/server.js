// Importation des différents modules
require("dotenv").config(); // Charger les variables d'environnement depuis le fichier .env
const express = require("express");
const cors = require("cors"); // Importer le middleware CORS
const cookieParser = require("cookie-parser"); // Importer cookie-parser pour gérer les cookies
const http = require("http");
const path = require("path");
const app = express(); // Initialisation de l'application express
const { Server } = require("socket.io");

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json'); // Le fichier généré par swagger-autogen

// Utilisation du fichier généré par swagger-autogen
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile)); 

app.use(cookieParser());  // Utiliser cookie-parser pour lire les cookies
app.use(express.json()); // permet de traiter les données JSON
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
    cors({
        origin: "http://localhost:3000", // Remplace par le domaine de ton frontend
        credentials: true, // Inclure les cookies dans les requêtes
    })
); // Utiliser le middleware CORS pour autoriser les requêtes uniquement depuis le frontend (http://localhost:3000)

// Configuration de Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
    transports: ["websocket"],  // Forcer l'utilisation de WebSocket
});

require("./sockets")(io); 
require("./routes")(app);

const port = 3005;
server.listen(port, () => { // server gere les requetes http et io gere les requetes websocket
    console.log(`Server running at http://localhost:${port}/`);
});

module.exports = app;
