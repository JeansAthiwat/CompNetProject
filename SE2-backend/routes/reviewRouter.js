import express from "express";
import { getUserReviews, getReviewsForCourse, createReview, deleteReview } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/user", getUserReviews); // Get all past reviews of a learner
router.get("/course/:course_id", getReviewsForCourse); // Get reviews for a specific course
router.post("/", createReview); // Submit a review for a purchased course
router.delete("/:id", deleteReview); // Delete a review

export default router;
