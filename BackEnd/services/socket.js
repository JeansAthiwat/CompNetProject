import { Server } from "socket.io";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Message from '../models/messageModel.js';
import Conversation from '../models/conversationModel.js';

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
        const token = socket.handshake.auth.token;
        try {
          const user = jwt.verify(token, process.env.JWT_SECRET);
          socket.user = user;
          next();
        } catch (err) {
          return next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.user.id;
        onlineUsers.set(userId, socket.id);
        console.log("✅ User", userId, "connected with socketID", socket.id);
        
        socket.on("private message", async ({ conversationId, recipient, message }) => {
            try {
                console.log("ay yo")
                const newMessage = new Message({ conversationId, sender:userId , text: message });
                await newMessage.save();
    
                await Conversation.findByIdAndUpdate(
                    conversationId,
                    { lastMessage: newMessage._id },
                    { new: true }
                  );
                
                const toSocketId = onlineUsers.get(recipient);
                console.log("eiei",toSocketId)
                if (toSocketId) {
                    io.to(toSocketId).emit("private message", {
                    from: userId,
                    message,
                    });
                }
                socket.emit("message stored", { success: true, message: newMessage });
            } catch(error) {
                console.error("Error saving message:", error);

                socket.emit("message stored", { success: false, error: error });
            }
        });
    
        socket.on("disconnect", () => {
          onlineUsers.delete(userId);
        });
    });
    
    return io;
}