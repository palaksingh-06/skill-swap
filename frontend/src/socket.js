import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL || "https://skill-swap-zkfd.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;