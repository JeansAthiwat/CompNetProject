import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  price: {
    type: Number,
    required: true,
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
  payment_date: {
    type: Date,
    default: Date.now,
  },
  payment_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "failed", "expired", "reminder"],
    required: true,
  },
  is_live: {
    type: Boolean,
    default: false,
  },
  start_time: {
    type: Date,
  },
  end_time: {
    type: Date,
  },
  message: {
    type: String,
  },
  type: {
    type: String,
    default: "in-app", // No need, as per your note
  },
  read_status: {
    type: String,
    enum: ["unread", "read"],
    default: "unread",
  },
  send_at: {
    type: Date,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Notification", notificationSchema);
