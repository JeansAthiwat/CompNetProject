import Conversation from  '../model/conversationModel.js'

export const getConversationByUserID  = () => {

}

export const getPrivateConversation = async (req, res) => {
    try {
        const {participants} = req.body
        let conv = await Conversation.findOne({
            participants: { $all: participants, $size: participants.length },
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
        console.log(err)
    }
}

export const createGroupConversation = async (req, res) => {
    try {
        const { uid } = req.user
        const conv = new Conversation({is_private:false, participants:[uid]})
        await conv.save()
        res.status(200).json({success:true, message:"Create new group conversation successfully"})
    } catch(err) {
        res.status(500).json({success:false, err})
        console.log(err)
    }
}

export const getgroupConversation = async (req, res) => {
    try {
    } catch(err) {
    }
}

export const joinGroupConversation = async (req,res) => {

}