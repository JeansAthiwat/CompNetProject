import express from 'express';
import { getAllUsers, getUser, createUser, updateUser, deleteUser , getUserById} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/:email').get(getUser).put(authMiddleware,updateUser).delete(authMiddleware,deleteUser);
router.route('/id/:id').get(getUserById)
export default router;
