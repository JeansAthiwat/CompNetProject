import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();


const authMiddleware = async (req, res, next) => {
    console.log(req)
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("❌ Missing or Malformed Authorization Header");
            return res.status(401).json({ msg: 'Unauthorized - No token' });
        }

        const token = authHeader.split(' ')[1];
        console.log("🔍 Extracted Token:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decoded);

        // Check if user exists in database
        const user = await User.findById(decoded.id);
        if (!user) {
            console.log("❌ User not found in DB");
            return res.status(404).json({ msg: 'User not found' });
        }

        req.user = user; // ✅ Attach user to request
        next();
    } catch (error) {
        console.error("❌ Auth Middleware Error:", error);
        res.status(401).json({ msg: 'Invalid token', error });
    }
};


export default authMiddleware;
