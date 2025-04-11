import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

//At the end of file
//Grant access to specific roles
const authRole = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({success:false,
                message:`User role ${req.user.role} is not authirize to access this route`});
        }
        next();
    }
}

export default authRole;
