import mongoose from 'mongoose';
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    is_private: {
        type: Boolean,
        required: [true, "Please specify the privacy of this conversation"]
    },
    name: {
      type: String,
      validate: {
        validator: function (value) {
          // 'this' refers to the document
          if (!this.is_private && (!value || value.trim() === "")) {
            return false;
          }
          return true;
        },
        message: "Name is required for group conversations"
      }
    },
    participants: [
      { type: Schema.Types.ObjectId, ref: "User" }, // Tutor & Student
    ],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" }, // Latest message reference
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);