import { Server } from "socket.io";
import dotenv from 'dotenv';

dotenv.config();

export const onlineUsers = new Map();
export const userToSocket = new Map();

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
      socket.userId = socket.handshake.auth.userId
      next();
    });

    io.on("connection", (socket) => {
      const userId = socket.userId
      const username = socket.username;
      const avatarIndex = socket.avatarIndex
      const socketId = socket.id

      // Track the user
      userToSocket.set(userId, {username,avatarIndex,socketId});
      onlineUsers.set(socketId, {username,avatarIndex,userId});
      console.log(`${username} connected`);

      // Broadcast to others
      socket.broadcast.emit("user:joined", {
        id: socket.id,
        username,
      });
        
      socket.on("private message", ({sender, reciever, text}) => {
        // console.log(sender)
        const senderData = userToSocket.get(sender)
        const recieverData = userToSocket.get(reciever)
        console.log(recieverData)
        io.to(recieverData.socketId).emit("private message", {
          sender: {id:sender ,name:senderData.username, avatarIndex:senderData.avatarIndex},
          text,
          });
      });
  
      socket.on("disconnect", () => {
        onlineUsers.delete(socket.id);
        socket.broadcast.emit("user:leaved");
        console.log(username,"disconnecting")
      });
    });
    
    return io;
}