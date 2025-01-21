// sockets/test.js
const userQueries = require("../queries/index.js");

module.exports = (io, socket) => {
  socket.on("Send message", async (data) => {
    try {
      const { message, receiver_id, sender_id } = data;
      if (!message || !receiver_id || !sender_id) {
        throw new Error("Missing message, receiver_id or sender_id");
      }
      const result = await userQueries.AddMessage(
        sender_id,
        receiver_id,
        message,
      );
      const roomId =
        sender_id < receiver_id
          ? `room_${sender_id}_${receiver_id}`
          : `room_${receiver_id}_${sender_id}`;
      // logique pour créer une room id le plus petit id en premier

      const clients = await io.in(roomId).allSockets();

      console.log(
        `Nombre d'utilisateurs dans la room ${roomId}: ${clients.size}`,
      );
      io.to(roomId).emit("Receive message", result);
    } catch (error) {
      console.error("Error during message handling:", error);
      socket.emit("Error message", {
        message: "Une erreur s'est produite lors du traitement du message.",
      });
    }
  });

  socket.on("userTyping", (data) => {
    try {
      const { roomId, userId } = data;

      if (!userId || !roomId) {
        throw new Error("Missing userId or roomId");
      }

      // Émettre un événement avec un objet
      io.to(roomId).emit("userIsTyping", { userId });

      console.log(
        `L'utilisateur ${userId} est en train d'écrire dans la room ${roomId}`,
      );
    } catch (error) {
      console.error("Error during user typing event:", error);
      socket.emit("Error message", {
        message:
          "Une erreur s'est produite lors de la gestion de l'événement userTyping.",
      });
    }
  });

  socket.on("UserStopTyping", (data) => {
    try {
      const { roomId, userId } = data;
      if (!userId || !roomId) {
        throw new Error("Missing userId or roomId in UserStopTyping");
      }
      io.to(roomId).emit("userStopTyping", { userId, isTyping: false });

      console.log(
        `L'utilisateur ${userId} est en train d'écrire dans la room ${roomId}`,
      );
    } catch (error) {
      console.error("Error during user typing event:", error);
      socket.emit("Error message", {
        message:
          "Une erreur s'est produite lors de la gestion de l'événement userTyping.",
      });
    }
  });

  socket.on("joinRoom", (data) => {
    try {
      const { roomId } = data;
      if (!roomId) {
        throw new Error("Missing roomId");
      }
      socket.join(roomId);
      console.log(`La room qui est ete creer dans join roomId, ${roomId}`);
    } catch (error) {
      console.error("Error during join room:", error);
      socket.emit("Error message", {
        message: "Une erreur s'est produite lors de la connexion à la room.",
      });
    }
  });
};
