import express from 'express';
import {
    getAllSupplementary,
    createSupplementary,
    getSupplementary,
    updateSupplementary,
    deleteSupplementary
} from '../controllers/supplementaryController.js'; // Adjust the path to your controller
import authMiddleware from '../middleware/authMiddleware.js';
import authRole from '../middleware/authRole.js';
const router = express.Router();

// Routes for supplementary files
router.route('/')
    .get(authMiddleware,getAllSupplementary) // GET /course/:courseId/supplementary
    .post(authMiddleware,authRole('admin','tutor'),createSupplementary); // POST /course/:courseId/supplementary

router.route('/:id')
    .get(authMiddleware,getSupplementary) // GET /course/:courseId/supplementary/:id
    .put(authMiddleware,authRole('admin','tutor'),authMiddleware,updateSupplementary) // PUT /course/:courseId/supplementary/:id
    .delete(authMiddleware,authRole('admin','tutor'),deleteSupplementary); // DELETE /course/:courseId/supplementary/:id

export default router;