import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
    ,reviewer_email: {
      type: String,
      required: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"],
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    review_text: {
      type: String,
      maxLength: 1000,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
