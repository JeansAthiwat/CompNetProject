import express from 'express';
import {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getSupplementaryFile,
  getWeeklyCourses,
  getCoursesByTutorID
} from '../controllers/courseController.js';
import { createReservation } from '../controllers/reservationController.js';
import upload from '../middleware/uploadMiddleware.js';
import reservationRouter from './reservationRouter.js';
import supplementaryRouter from './supplementaryRouter.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authRole from '../middleware/authRole.js';

const router = express.Router();

// ✅ Get all courses (Public)
router.get('/', getAllCourses);

// ✅ Create a new course (Only Tutor & Admin, with file upload)
router.post('/', authMiddleware, authRole('tutor', 'admin'), upload.single('supplementaryFile'), createCourse);

// ✅ Get weekly live courses (Only Tutor & Admin)
router.get('/weekly', authMiddleware, authRole('tutor', 'admin'), getWeeklyCourses);

// ✅ Get courses by Tutor ID (Public)
router.get('/tutor/:UID', getCoursesByTutorID);

// ✅ Get a specific course by ID (Public)
router.get('/:id', getCourse);

// ✅ Update a course (Only Tutor & Admin)
router.put('/:id', authMiddleware, authRole('tutor', 'admin'), updateCourse);

// ✅ Delete a course (Only Tutor & Admin)
router.delete('/:id', authMiddleware, authRole('tutor', 'admin'), deleteCourse);

// ✅ Retrieve the supplementary file (Public Access)
router.use('/:courseId/supplementary', supplementaryRouter);

// ✅ See course reservation (Only Tutor & Admin)
router.use('/:courseId/reservation', authMiddleware, authRole('tutor', 'admin'), reservationRouter);

// ✅ Reserve a course (For learner)
router.post('/:courseId/enroll', authMiddleware, createReservation)

export default router;
