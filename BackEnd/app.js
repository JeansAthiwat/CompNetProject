// app.js
import express from "express";
import mongoose from 'mongoose'
import http from "http";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { setUpSocket } from "./socket.js";
// import router from "./router.js";
import authRouter from "./router/auth.js"
import userRouter from "./router/user.js"
import conversationRouter from "./router/conversation.js"
import messageRouter from "./router/message.js"

dotenv.config();

const app = express();

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

// app.use('/api',router)
app.use('/auth',authRouter)
app.use('/user',userRouter)
app.use('/conversation',conversationRouter)
app.use('/message', messageRouter)

const server = http.createServer(app);

setUpSocket(server)

// ✅ Start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log("✅ Connected to DB & listening on port", PORT);
    })
  }). catch((error) => {
    console.error('❌ MongoDB Connection Error:', error);
  });
