import Message from '../model/messageModel.js'

export const getMessageFromConversationID = async (req,res) => {
    try {
        const { cid } = req.params
        // console.log("cid",cid)
        const messages = await Message.find({conversationId:cid}).populate('sender', 'displayName avatarIndex');
        // console.log("messages", messages)
        if(!messages) {
            return res.status(404).json({success:false, mssg:"This convo has no messages!"})
        }
        res.status(200).json({success:true, messages})
    } catch(err) {
        console.log(err)
        res.status(500).json({success:false, err})
    }
}

// export const createNewMessage = (res,req) => {
//     try {
//         const { uid } = res.user
//         const { cid }
//         const newMssg = new Message({})
//     }
// }

// export const deleteMessage = (res,req) => {
    
// }