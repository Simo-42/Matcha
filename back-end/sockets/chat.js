// sockets/test.js
const userQueries = require("../queries/index.js");

module.exports = (io, socket) => {
	socket.on("Send message", async (data) => {
		const { message, receiver_id, sender_id } = data;
		const result = await userQueries.AddMessage(sender_id, receiver_id, message);
		console.log("Message sent :", result);

		io.to(`user_${receiver_id}`).emit("Receive message", result);
	});
};

module.exports = (io, socket) => {
	socket.on("Send message", async (data) => {
		const { message, receiver_id, sender_id } = data;
		const result = await userQueries.AddMessage(sender_id, receiver_id, message);
		console.log("Message sent :", result);
		console.log("Receiver ID:", receiver_id);
		console.log("Sender ID:", sender_id);
		// envoyer le message à l'utilisateur destinataire
		console.log("Message sent :", result);
		io.to(`user_${receiver_id}`).emit("Receive message", result);

		//  : Envoyer aussi le message à l'expéditeur pour qu'il voit son message
		socket.emit("Receive message", result);
	});
};
