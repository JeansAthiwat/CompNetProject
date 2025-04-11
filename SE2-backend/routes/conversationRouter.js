import express from "express";
import {
  getAllConversations,
  getConversationById,
  createConversation,
  deleteConversation,
  getConversationByUserId,
} from "../controllers/conversationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authRole from "../middleware/authRole.js";

const router = express.Router();

// Get all conversations for the logged-in user
router.get("/", authMiddleware, authRole('admin'), getAllConversations);

// Get all conversations of a specific user
router.get("/user", authMiddleware, getConversationByUserId);

// Get a specific conversation by ID
router.get("/:id", authMiddleware, getConversationById);

// Create a new conversation
router.post("/", authMiddleware, createConversation);

// Delete a conversation
router.delete("/:id", authMiddleware, authRole('admin'), deleteConversation);

export default router;