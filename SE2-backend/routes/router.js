import express from 'express';
import {home} from '../controllers/controller.js'; 
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router()

//example home page
router.get('/',home)

// 🔒 Protected Route (Only logged-in users can access)
router.get('/dashboard', authMiddleware, (req, res) => {
    res.send(`Welcome ${req.session.user.display_name}, this is your dashboard.`);
});



import { deleteAllUsers } from '../controllers/userController.js';

router.get('/delete-all', deleteAllUsers); // 👍 delete this later

//export router
export default router