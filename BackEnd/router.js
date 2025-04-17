// import express from 'express'
// import { onlineUsers, userToSocket } from './socket.js';

// const router = express.Router();

// router.get('/users', (req, res) => {
//     try{
//         if (onlineUsers)
//             res.status(201).json({success:true, users:Array.from(onlineUsers.values())})
//         else
//             res.status(500).json({success:false, msg:"Internal server error."})
//     } catch(err) {
//         res.status(500).json({success:false, msg:"Internal server error."})
//     }
// })

// router.get('/user/:id', (req,res) => {
//     try {
//         if (userToSocket)
//             res.status(201).json({success:true, user:userToSocket.get(req.params.id)})
//         else
//             res.status(500).json({success:false, msg:"Internal server error."})
//     } catch(err) {
//         res.status(500).json({success:false, msg:"Internal server error."})
//     }
// })

// export default router