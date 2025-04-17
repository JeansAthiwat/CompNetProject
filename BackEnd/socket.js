import { Server } from "socket.io";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import Message from './model/messageModel.js'

dotenv.config();

export const onlineUsers = new Map();

export const setUpSocket = (server) => {
    const io = new Server(server, {
        cors: {
          origin: "*", // Replace with your React app's URL
          methods: ["GET", "POST"], // Allow specific HTTP methods
        }
      }); // ✅ Attach Socket.IO

    io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        socket.uid = uid;
        socket.displayName = socket.handshake.auth.displayName;
        socket.avatarIndex = socket.handshake.auth.avatarIndex;
        next();
      } catch (err) {
        return next(new Error("Authentication error"));
      }
    });

    io.on("connection", (socket) => {
      const uid = socket.uid
      const displayName = socket.displayName;
      const avatarIndex = socket.avatarIndex
      const socketId = socket.id

      // Track the user
      onlineUsers.set(uid, {displayName,avatarIndex,socketId});
      console.log(`${displayName} connected`);

      // Broadcast to others
      socket.broadcast.emit("user:joined", {
        sid: socket.id,
        uid
      });
        
      socket.on("private message", async ({cid, sender, reciever, text}) => {
        // console.log(cid, sender, reciever, text)
        
        const newMssg = new Message({conversationId:cid, sender, text})
        await newMssg.save()
        io.to(onlineUsers.get(reciever).socketId).emit('private message', {
          sender:{displayName, avatarIndex}, text
        })
        // const senderData = userToSocket.get(sender)
        // const recieverData = userToSocket.get(reciever)
        // console.log(recieverData)
        // io.to(recieverData.socketId).emit("private message", {
        //   sender: {id:sender ,name:senderData.username, avatarIndex:senderData.avatarIndex},
        //   text,
        //   });
      });
  
      socket.on("disconnect", () => {
        onlineUsers.delete(uid);
        socket.broadcast.emit("user:leaved");
        console.log(displayName,"disconnecting")
      });
    });
    
    return io;
}