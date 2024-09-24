// sockets/test.js
const userQueries = require("../queries/index.js");

module.exports = (io, socket) => {
	socket.on("Send message", async (data) => {
		try {
		const { message, receiver_id, sender_id } = data;
		const result = await userQueries.AddMessage(sender_id, receiver_id, message);
		const roomId = sender_id < receiver_id ? `room_${sender_id}_${receiver_id}` : `room_${receiver_id}_${sender_id}`;
		const clients = await io.in(roomId).allSockets();
		console.log(`Nombre d'utilisateurs dans la room ${roomId}: ${clients.size}`);
		io.to(roomId).emit("Receive message", result);
		} catch (error) {
			console.error("Error during message handling:", error);
			socket.emit("Error message", { message: "Une erreur s'est produite lors du traitement du message." });
		}
	});
	socket.on("joinRoom", (data) => {
		const { roomId } = data;
		socket.join(roomId);
		console.log(`La room qui est ete creer dans join roomId, ${roomId}`);
	});
};
