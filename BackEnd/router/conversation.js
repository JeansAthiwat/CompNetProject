import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { createGroupConversation, getPrivateConversation } from '../controller/conversation.js'

const router = express.Router()

router.route('/private').post(authMiddleware, getPrivateConversation)
router.route('/group').post(authMiddleware, createGroupConversation)

export default router