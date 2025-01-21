// sockets/test.js
const userQueries = require("../queries/index.js");

module.exports = (io, socket) => {
  socket.on("Notification", async (data) => {
    try {
      if (data.status === "addNotification") {
        // type de notification : match, like, dislike, message, view
        const result = await userQueries.AddNotification(
          data.userId,
          data.type,
          data.message,
        );
        socket.emit("ReceiveNotification", result); // Émettre à l'utilisateur qui a demandé
      } else if (data.status === "deleteNotification") {
        const result = await userQueries.DeleteNotification(data.userId);
        socket.emit("ReceiveNotification", result); // Émettre à l'utilisateur qui a demandé
      } else if (data.status === "getNotification") {
        const result = await userQueries.GetNotifications(data.userId);
        socket.emit("ReceiveNotification", result); // Émettre à l'utilisateur qui a demandé
      }
      // else if (data.status === "readNotification") {
      //   const result = await userQueries.NotificationIsRead(data.userId);
      //   socket.emit("ReceiveNotification", result);
      // }
    } catch (error) {
      console.error("Error during notification handling:", error);
      socket.emit("ErrorNotification", {
        message:
          "Une erreur s'est produite lors du traitement de la notification.",
      }); // Émettre une erreur à l'utilisateur
    }
  });
};
