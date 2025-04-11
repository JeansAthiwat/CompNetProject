import express from 'express';
import {approveUser, deleteUser} from '../controllers/adminController.js';
const router = express.Router();

router.route('/:email').put(approveUser).delete(deleteUser);

export default router;