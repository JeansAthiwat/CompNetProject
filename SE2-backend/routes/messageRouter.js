import express from "express";
import {
  getAllMessages,
  getMessagesByConversation,
  sendMessage,
  deleteMessage,
} from "../controllers/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authRole from "../middleware/authRole.js";

const router = express.Router();

// Get all messages from all conversations (if needed)
router.get("/", authMiddleware, authRole("admin"), getAllMessages);

// Get messages for a specific conversation
router.get("/:conversationId", authMiddleware, getMessagesByConversation);

// Send a new message
router.post("/", authMiddleware, sendMessage);

// Delete a message
router.delete("/:id", authMiddleware, authRole("admin"), deleteMessage);

export default router;