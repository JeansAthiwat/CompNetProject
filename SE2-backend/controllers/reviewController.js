import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Enrollment from "../models/reservationModel.js";

export const getUserReviews = async (req, res) => {
    try {
        const { reviewer_id } = req.query;

        const learner = await User.findOne({ reviewer_id: reviewer_id, role: "learner" });
        if (!learner) {
            return res.status(403).json({ message: "Only learners can view their past reviews." });
        }

        const reviews = await Review.find({ reviewer_id }).populate("course_id", "course_name price");
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const getReviewsForCourse = async (req, res) => {
    try {
        const { course_id } = req.params;
        const reviews = await Review.find({ course_id }).populate("reviewer_id", "email");
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const createReview = async (req, res) => {
    try {
        const { reviewer_id, reviewer_email, course_id, rating, review_text } = req.body;

        const learner = await User.findOne({ email: reviewer_email, role: "learner" });
        if (!learner) {
            return res.status(403).json({ message: "Only learners can submit reviews." });
        }

        const course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        const existingReview = await Review.findOne({ reviewer_id, course_id });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this course." });
        }

        if (rating < 0 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 0 and 5." });
        }

        // Check if learner enroll the course or not
        // const hasPurchased = await Enrollment.findOne({
        //     l_email: reviewer_email,
        //     course_id: course_id,
        //     verify_status: "Complete"
        // });

        // if (!hasPurchased) {
        //     return res.status(403).json({ message: "You can only review courses you have completed." });
        // }

        const newReview = new Review({ reviewer_id, reviewer_email, course_id, rating, review_text });
        await newReview.save();

        await updateAverageRating(course_id);

        res.status(201).json(newReview);
    } catch (error) {
        res.status(400).json({ message: "Error creating review", error });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id);

        if (!review) return res.status(404).json({ message: "Review not found." });

        await Review.findByIdAndDelete(id);
        await updateAverageRating(review.course_id);

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting review", error });
    }
};

const updateAverageRating = async (course_id) => {
    const reviews = await Review.find({ course_id });
    const totalReviews = reviews.length;
    const average = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

    await Course.findByIdAndUpdate(course_id, {
        $set: {
            "ratings.average": average,
            "ratings.totalReviews": totalReviews
        }
    });
};
