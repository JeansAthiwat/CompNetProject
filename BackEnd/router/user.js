import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { editProfile, getOnlineUsers, getUser } from '../controller/user.js'

const router = express.Router()

router.route('/').get(authMiddleware, getUser).put(authMiddleware, editProfile)

router.route('/online').get(getOnlineUsers)

export default router