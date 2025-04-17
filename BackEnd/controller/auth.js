import User from '../model/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req,res) => {
    try {
        console.log("body:",req.body)
        const { username, password } = req.body
        if(!username || !password) {
            res.status(400).json({success:false, message:"Username and Password are required"})
            return
        }
        const newUser = new User({username, password, displayName:username })
        await newUser.save()
        const payload = {uid:newUser._id}
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.status(201).json({success:true, message:"Successfully registered", user:newUser, token})
    } catch(err) {
        res.status(500).json({success:false, message:err.message})
    }
}

export const login = async (req,res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({username})
        if(!user) {
            res.status(404).json({success:false, message:"Cannot find a user with this username"})
            return
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            res.status(400).json({success:false, message:"Invalid authentication"})
            return
        }
        const payload = {uid:user._id}
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.status(200).json({success:true, message:"Login successfully", user, token})
    } catch(err) {
        res.status(500).json({success:false, message:err.message})
    }
}