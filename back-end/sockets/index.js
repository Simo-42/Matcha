// sockets/index.js
module.exports = (io) => {
	// Tu écoutes la connexion une seule fois ici
	io.on("connection", (socket) => {
		const userId = socket.handshake.query.userId;
		console.log("Utilisateur connecté :", userId);
		if (userId) {
			socket.join(`user_${userId}`);
			console.log(`Utilisateur ${userId} a rejoint la room user_${userId}`);
		} else {
			console.error("Aucun userId trouvé dans la connexion.", socket.handshake.query);
		}
		require("./chat")(io, socket); // Passer l'objet socket, pas io
		// Importer et utiliser la logique des événements dans test.js

		socket.on("disconnect", (reason) => {
			console.log(`Utilisateur déconnecté : ${socket.id}`);
			console.log(`Raison de la déconnexion : ${reason}`);
		  });
	});
};
