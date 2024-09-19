// sockets/index.js
module.exports = (io) => {
	// Tu écoutes la connexion une seule fois ici
	io.on("connection", (socket) => {
		// Importer et utiliser la logique des événements dans test.js
		require("./chat")(io, socket); // Passer l'objet socket, pas io

		socket.on("disconnect", () => {
			console.log("Utilisateur déconnecté :", socket.id);
		});
	});
};
