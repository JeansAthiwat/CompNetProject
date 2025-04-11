// app.js
import express from "express";
import http from "http";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Basic middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: true,
  })
);

// ✅ Sample endpoint (test)
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  socket.on("chat message", (msg) => {
    console.log("💬 Message:", msg);
    io.emit("chat message", msg); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🟢 Server listening on http://localhost:${PORT}`);
});
