// sockets/test.js
const userQueries = require("../queries/index.js");

module.exports = (io, socket) => {
	socket.on("Send message", async (data) => {
		const { message, receiver_id , sender_id} = data;
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
	  
	  // Envoyer le message à l'utilisateur destinataire
	  io.to(`user_${receiver_id}`).emit("Receive message", result);
	  
	  //  : Envoyer aussi le message à l'expéditeur pour qu'il voit son message
	  socket.emit("Receive message", result);
	});
  };
  