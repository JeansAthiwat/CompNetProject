import mongoose, {Schema} from 'mongoose';

const MessageSchema = new Schema(
    {
      conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" }, // Chat session
      sender: { type: Schema.Types.ObjectId, ref: "User" }, // Sender of the message
      text: { type: String, required: true }, // Message content
    },
    { timestamps: true }
  );
  
export default mongoose.model("Message", MessageSchema);