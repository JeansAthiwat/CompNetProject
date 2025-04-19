import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { createGroupConversation, getGroupConversationById, getAllGroupConversation, getPrivateConversation, joinGroupConversation, leaveGroupConversation } from '../controller/conversation.js'

const router = express.Router()

router.route('/private').post(authMiddleware, getPrivateConversation)
router.route('/group').get(getAllGroupConversation).post(authMiddleware, createGroupConversation)
router.route('/group/:id').get(authMiddleware,getGroupConversationById).put(authMiddleware,joinGroupConversation)
router.route('/group/leave/:id').put(authMiddleware,leaveGroupConversation)

export default router