// src/socket.js
import { io } from "socket.io-client";

let socket;

export const getSocket = (userId, username, avatarIndex) => {
  if (!socket) {
    console.log("new socket")
    socket = io("http://localhost:39189", {
        auth: { userId, username, avatarIndex },
      });
      socket.on("connect", () => {
        console.log("Socket connected with ID:", socket.id, username);
      });
  }
  return socket
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};