import Conversation from  '../model/conversationModel.js'

export const getPrivateConversation = async (req, res) => {
    try {
        const {participants} = req.body
        let conv = await Conversation.findOne({
            participants: { $all: participants, $size: participants.length }, is_private:true
          })  .populate({
            path: 'participants',
            select: 'displayName avatarIndex',
          })
        if(conv) {
            res.status(200).json({success:true, conv})
        } else {
            conv = new Conversation({is_private:true, participants})
            await conv.save()
            res.status(200).json({success:true, message:"Create new private conversation successfully", conv})
        }
    } catch(err) {
        res.status(500).json({success:false, err})
        // console.log(err)
    }
}

export const createGroupConversation = async (req, res) => {
    try {
        const { uid } = req.user
        const { groupName } = req.body
        const conv = new Conversation({is_private:false, name:groupName , participants:[uid]})
        await conv.save()
        res.status(200).json({success:true, message:"Create new group conversation successfully", conv})
    } catch(err) {
        res.status(500).json({success:false, err})
        // console.log(err)
    }
}

export const getAllGroupConversation = async (req, res) => {
    try {
        const groups = await Conversation.find({is_private:false}, '_id name participants').populate({path:'participants', select:'avatarIndex displayName'})
        res.status(200).json({success:true, groups})
    } catch(err) {
        res.status(500).json({success:false, err})
        // console.log(err)
    }
}

export const getGroupConversationById = async (req, res) => {
    try {
        const { id } = req.params
        const conv = await Conversation.findById(id).populate({path:'participants', select:'avatarIndex displayName'})
        if(!conv) {
            return res.status(404).json({success:false, message:"There is no conversation with this id"})
        }
        res.status(200).json({success:true, conv})
    } catch(err) {
        res.status(500).json({success:false, err})
        // console.log(err)
    }
}

export const joinGroupConversation = async (req, res) => {
    try {
        const { uid } = req.user
        const { id } = req.params

        const conv = await Conversation.findByIdAndUpdate(id, { $addToSet: { participants: uid } }, { new: true })
        res.status(200).json({success:true, message:"Add user to the conversation successfully"})
    } catch(err) {
        res.status(500).json({success:false, err})
        console.log(err)
    }
}

export const leaveGroupConversation = async (req, res) => {
    try {
        const { uid } = req.user
        const { id } = req.params

        const conv = await Conversation.findByIdAndUpdate(id, { $pull: { participants: uid } }, { new: true })
        res.status(200).json({success:true, message:"Delete user from the conversation successfully"})
    } catch(err) {
        res.status(500).json({success:false, err})
        console.log(err)
    }
}