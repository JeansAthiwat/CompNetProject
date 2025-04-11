import express from 'express';
import { getReservations,getWeeklyReservations,getReservation,createReservation,updateReservation,deleteReservation } from '../controllers/reservationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authRole from '../middleware/authRole.js';

const router = express.Router({mergeParams:true});

router.route('/').get(authMiddleware,getReservations).post(authMiddleware,authRole('learner','admin'),createReservation);
router.route('/weekly').get(authMiddleware,getWeeklyReservations);
router.route('/:id').get(authMiddleware,getReservation).put(authMiddleware,authRole('learner','admin'),updateReservation)
.delete(authMiddleware,authRole('learner','admin'),deleteReservation);
export default router