import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js"

// Get all messages
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};

export const getMessagesByConversation = async (req, res) => {
    try {
      // Find the conversation by ID and check if the user is a participant
      const conversation = await Conversation.findById(req.params.conversationId);
      // Check if the user is a participant of the conversation
      if (!conversation || !conversation.participants.includes(req.user.id)) {
        return res.status(403).json({ message: "You are not a participant in this conversation." });
      }
  

      const createdBefore = req.query ? (req.query.createdBefore || Date.now()) : Date.now();
      console.log("eiei",createdBefore, Date.now())
      // If the user is a participant, fetch the messages
      const messages = await Message.find({ conversationId: req.params.conversationId, createdAt: {$lt:new Date(createdBefore)} }).sort({ createdAt: -1 }).limit(25);
      
      res.status(200).json(messages.reverse());
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages", error });
    }
};

export const sendMessage = async (req, res) => {
    try {
      const { conversationId, text } = req.body;
      const sender = req.user.id;
      // Create a new message
      const message = new Message({ conversationId, sender, text });
      await message.save();
  
      // Update the conversation with the new last message
      await Conversation.findByIdAndUpdate(
        conversationId,
        { lastMessage: message._id },  // Set the last message to the newly created message's _id
        { new: true }  // Return the updated conversation object
      );
  
      // Respond with the new message
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: "Error sending message", error });
    }
};

// Delete a message by ID
export const deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message", error });
  }
};