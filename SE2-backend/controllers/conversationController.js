import Conversation from "../models/conversationModel.js";

// Get all conversations
export const getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find();
    // Must do pagination?
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching conversations", error });
  }
};

// Get conversation by ID
export const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });
    if(!conversation.participants.some(id => id.equals(req.user.id))) return res.status(403).json("Forbidden: You don't have access to this resource.");
    //pagination?
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching conversation", error });
  }
};

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { participants, courseId, message: lastMessage } = req.body;

    // Create a new Conversation with lastMessage if available
    const conversation = new Conversation({
        participants, courseId,
        ...(lastMessage && { lastMessage }) // Only add lastMessage if it exists
    });
    
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Error creating conversation", error });
  }
};

// Delete a conversation by ID
export const deleteConversation = async (req, res) => {
  try {
    await Conversation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Conversation deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting conversation", error });
  }
};

export const getConversationByUserId = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: { $in: [req.user.id] }
          }).populate({
            path: 'participants',
            select: 'firstname lastname'  // Specify the fields you want to populate
          }).populate({
            path: 'lastMessage',
            select: 'text'
          })
        res.status(201).json(conversations);
    }catch(error) {
        res.status(500).json({ message: "Error fetching conversation", error });
    }
}