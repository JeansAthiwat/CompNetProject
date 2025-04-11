import express from "express";
import {
  createNotification,
  getAllNotifications,
  getNotification,
  updateNotification,
  deleteNotification,
  getUserNotifications,
  markAllAsRead,
} from "../controllers/notificationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get all notifications or create a new notification
router.route("/").get(getAllNotifications).post(createNotification);

// Route to get notifications for a specific user (using learner_id or tutor_id)
router.route("/user").get(authMiddleware, getUserNotifications);

router.route("/user/read-all").put(authMiddleware, markAllAsRead);

// Routes to get, update, or delete a notification by its ID
router
  .route("/:id")
  .get(getNotification)
  .put(updateNotification)
  .delete(deleteNotification);

export default router;
