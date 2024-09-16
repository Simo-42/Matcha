// Importation des différents modules
require("dotenv").config(); // Charger les variables d'environnement depuis le fichier .env
const express = require("express");
const cors = require("cors"); // Importer le middleware CORS
const cookieParser = require("cookie-parser"); // Importer cookie-parser pour gérer les cookies
const http = require("http");
const path = require("path");
const app = express(); // Initialisation de l'application express
const { Server } = require("socket.io");

app.use(express.json({ limit: "10mb" })); // Permettre à l'application d'accepter les données JSON surtout pour les images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
	cors({
		origin: "http://localhost:3001", // Remplace par le domaine de ton frontend
		credentials: true, // Permet l'envoi des cookies
	})
); // Utiliser le middleware CORS pour autoriser toutes les origines

app.use(cookieParser()); // Pour gérer les cookies

// const server = http.createServer(app);
// const io = new Server(server, {
// 	// Créer une instance de socket.io
// 	cors: {
// 		origin: "http://localhost:3001",
// 		credentials: true,
// 	},
// });

// io.on("connection", (socket) => {
// 	console.log("Un utilisateur est connecté");

// 	// Écouter la déconnexion de ce client
// 	socket.on("disconnect", () => {
// 		console.log("Un utilisateur est déconnecté");
// 	});
// });

const passwordForgotRouter = require("./routes/pass_forgot");
const jwtRouter = require("./routes/jwt");
const authRouter = require("./routes/auth");
const SwipeRouter = require("./routes/swipe");
const uploadRouter = require("./routes/upload"); // Importer le routeur upload
const afterAuthRouter = require("./routes/after_auth");
const messageRouter = require("./routes/messagerie"); 

app.use("/api/auth", authRouter);
app.use("/api/password", passwordForgotRouter);
app.use("/api/jwt", jwtRouter);
app.use("/api/after_auth", afterAuthRouter);
app.use("/api/swipe", SwipeRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/message", messageRouter);
// Définir le port et démarrer le serveur

const port = process.env.PORT || 3005;
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
