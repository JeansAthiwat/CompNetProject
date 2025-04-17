import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { getMessageFromConversationID } from '../controller/message.js'

const router = express.Router()

router.route('/id/:cid').get(authMiddleware, getMessageFromConversationID)

export default router