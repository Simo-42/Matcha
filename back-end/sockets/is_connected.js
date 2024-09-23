const userQueries = require("../queries/index.js");

module.exports = (io, socket) => {
  socket.on("user_connected", async (data) => {
    try {
      console.log("User connected: in socket is connected", data.userId);
      const result = await userQueries.updateConnectionStatus(data.userId, true);
      if (!result) {
        console.error("Error updating user connection status");
        return;
      }

      io.emit("user_status", { userId: data.userId, status: "connected" });
    } catch (error) {
      console.error("Error during connection status update:", error);
    }
  });

  socket.on("get_status", async () => {
    const userId = socket.handshake.query.userId; // Récupérer userId depuis le handshake
    try 
	{
	  user_status = await userQueries.GetUserStatus(userId);

      io.emit("user_status", { userId, user_status});
    } catch (error) {
      console.error("Error during disconnection status update:", error);
    }
  });
};
