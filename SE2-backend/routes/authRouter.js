import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import passport from '../config/passport.js';
import { createUser } from '../controllers/userController.js';
import { check, validationResult } from 'express-validator';

const router = express.Router();

router.post('/register', [
    check('email', 'Valid email required').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('role', 'Role must be either learner or tutor').isIn(['learner', 'tutor'])
], async (req, res) => {
    console.log("📥 Received Register Request:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("❌ Validation Errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    // ✅ Delegate user creation to createUser function
    return createUser(req, res);
});


// 📝 Login Route with Debugging
router.post('/login', [
    check('email', 'Valid email required').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        // 🔥 Prevent Google users from logging in with a password
        if (user.role === 'google_user') {
            return res.status(400).json({ msg: 'Please log in using Google' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        // ✅ Generate JWT Token
        const payload = { id: user.id, email: user.email, role: user.role};
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ msg: 'Logged in successfully', token, user: {...payload, profilePicture: user.profilePicture} });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ✅ Route to Start Google Authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// ✅ Google OAuth Callback Route
router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
    if (!req.user) {
        console.log("Google authenticate fail");
        return res.status(401).json({ msg: 'Google authentication failed' });
    }

    const user = req.user;

    // ✅ Ensure role is correctly set (learner/tutor) before generating token
    const isProfileComplete = user.firstname && user.lastname && user.phone && user.birthdate && (user.role === 'learner' || user.role === 'tutor');

    // ✅ Generate JWT Token with correct role
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, profilePicture: user.profilePicture },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    console.log("✅ JWT Token Sent:", token);

    if (isProfileComplete) {
        console.log("redirect client to /login-success");
        res.redirect(`http://localhost:3000/login-success?token=${token}&UID=${user.id}&email=${user.email}`);
    } else {
        console.log("redirect client to /complete-profile");
        console.log("data", user);
        res.redirect(`http://localhost:3000/complete-profile?token=${token}&UID=${user.id}&email=${user.email}`);
    }
});



export default router;
