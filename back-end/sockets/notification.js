// sockets/test.js
const userQueries = require("../queries/index.js");

module.exports = (io, socket) => {
	socket.on("Notification", async (data) => {
		const { message, receiver_id, sender_id } = data;
		const result = await userQueries.AddMessage(sender_id, receiver_id, message);

		io.to(`user_${receiver_id}`).emit("Receive message", result);
		socket.emit("Receive message", result);

	});
};
