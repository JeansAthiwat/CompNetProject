// app.js
import express from "express";
import http from "http";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { setUpSocket } from "./socket.js";
import router from "./router.js";

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

app.use('/api',router)

const server = http.createServer(app);

setUpSocket(server)

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🟢 Server listening on http://localhost:${PORT}`);
});
