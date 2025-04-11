import { Server } from "socket.io";
import dotenv from 'dotenv';

dotenv.config();

const onlineUsers = new Map();

export const setUpSocket = (server) => {
    const io = new Server(server, {
        cors: {
          origin: "*", // Replace with your React app's URL
          methods: ["GET", "POST"], // Allow specific HTTP methods
        }
      }); // ✅ Attach Socket.IO

    io.use((socket, next) => {
      const username = socket.handshake.auth.username;

      if (!username) {
        return next(new Error("invalid username"));
      }
  
      socket.username = username;
      socket.avatarIndex = socket.handshake.auth.avatarIndex;
      next();
    });

    io.on("connection", (socket) => {
      const username = socket.username;
      const avatarIndex = socket.avatarIndex

      // Track the user
      onlineUsers.set(socket.id, {username,avatarIndex});
      console.log(`${username} connected`);

      // Broadcast to others
      socket.broadcast.emit("user:joined", {
        id: socket.id,
        username,
      });
        
      socket.on("message", () => {

      });
  
      socket.on("disconnect", () => {

      });
    });
    
    return io;
}