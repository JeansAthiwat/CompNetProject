import mongoose from 'mongoose';
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User" }, // Tutor & Student
    ],
    courseId: { type: Schema.Types.ObjectId, ref: "Course" }, // Optional: link to a specific course
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" }, // Latest message reference
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);