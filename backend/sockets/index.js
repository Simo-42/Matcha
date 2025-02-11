// sockets/index.js
const userQueries = require("../queries/index.js");

module.exports = (io) => {
  io.on("connection", (socket) => {
    const { userId } = socket.handshake.query;

    require("./chat")(io, socket);

    require("./is_connected")(io, socket);
    // require("./notification")(io, socket);

    socket.on("disconnect", async (reason) => {
      console.log(`Utilisateur déconnecté : ${socket.id}`);
      console.log(`Raison de la déconnexion : ${reason}`);

      try {
        const result = await userQueries.updateConnectionStatus(userId, false);
        if (!result) {
          console.error(
            "Error updating user connection status during disconnect",
          );
          return;
        }
        io.emit("user_status", { userId, status: "disconnected" });
      } catch (error) {
        console.error("Error during user disconnect status update:", error);
      }
    });
  });
};
