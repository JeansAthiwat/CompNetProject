import express from 'express';
import { search,searchMyCourse } from '../controllers/searchController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authRole from '../middleware/authRole.js';

const router = express.Router();
//Search Main Page
router.get('/', search);
//Search MyCourse Page
router.get('/MyCourse',authMiddleware,authRole('tutor','learner'),searchMyCourse) //Not implement for admin yet

export default router;
