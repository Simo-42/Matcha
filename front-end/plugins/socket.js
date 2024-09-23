import { io } from "socket.io-client";

export default defineNuxtPlugin(() => {
  const socket = io("http://localhost:3005", {
    withCredentials: true, // Permet l'envoi des cookies lors de la connexion au socket
    transports: ['websocket'] // Forcer l'utilisation uniquement du WebSocket
  });

  return {
    provide: {
      socket, // injecte l'objet comme $socket
    },
  };
});
