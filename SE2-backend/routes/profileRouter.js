import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const router = express.Router();


// ✅ Route to complete Google user's profile
router.post('/complete-profile', authMiddleware, async (req, res) => {
    try {
        console.log("📥 Received Complete Profile Request:", req.body);
        console.log("🔍 Authenticated User ID:", req.user.id); // ✅ Confirm user ID is extracted

        let user = await User.findById(req.user.id);
        if (!user) {
            console.log("❌ User not found in DB");
            return res.status(404).json({ msg: 'User not found' });
        }

        console.log("✅ User Found:", user);

        // Update user fields
        user.firstname = req.body.firstname || user.firstname;
        user.lastname = req.body.lastname || user.lastname;
        user.phone = req.body.phone || user.phone;
        user.birthdate = req.body.birthdate || user.birthdate;
        user.role = req.body.role || user.role;

        if (req.body.role === 'tutor') {
            user.teaching_style = req.body.teaching_style || [];
            user.educations = req.body.educations || [];
            user.specialization = req.body.specialization || [];
        }
        if (req.body.role === 'learner') {
            user.learning_style = req.body.learning_style || [];
            user.interest = req.body.interest || [];
        }

        await user.save();
        console.log("✅ User Profile Updated Successfully:", user);

        // Generate a new JWT token after updating the profile
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, profilePicture: user.profilePicture },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log("🆕 New Token Generated After Profile Update:", token);

        res.status(200).json({ msg: 'Profile updated successfully', token, user });
    } catch (error) {
        console.error("❌ Error Updating Profile:", error);
        res.status(500).json({ msg: 'Server error', error });
    }
});




// ✅ GET User Profile (Protected Route)
router.get('/get-profile', authMiddleware, async (req, res) => {
    try {
        console.log("🔍 Looking for User ID:", req.user.id); // ✅ Debug log

        const user = await User.findById(req.user.id).select('-password'); // Exclude password

        if (!user) {
            console.log("❌ User Not Found in DB");
            return res.status(404).json({ msg: 'User not found' });
        }

        console.log("✅ User Found:", user);
        res.json(user);
    } catch (error) {
        console.error('❌ Error fetching user profile:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});


// ✅ UPDATE Profile Picture (Protected Route)
router.put('/update-profile-picture', authMiddleware, express.json({ limit: '2mb' }), async (req, res) => {
    try {
        const { profilePicture } = req.body;

        if (!profilePicture || typeof profilePicture !== 'string') {
            return res.status(400).json({ msg: 'Invalid profile picture URL' });
        }

        // Update the user's profile picture
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { profilePicture },
            { new: true, select: '-password' } // Exclude password from response
        );

        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ msg: 'Profile picture updated successfully', user: updatedUser });

    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.put('/update-bio', authMiddleware, async (req, res) => {
    try {
        const { bio } = req.body;

        if (!bio || typeof bio !== 'string') {
            return res.status(400).json({ msg: 'Invalid Bio' });
        }

        // Update the user's profile picture
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { bio },
            { new: true, select: '-password' } // Exclude password from response
        );

        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ msg: 'Bio updated successfully', user: updatedUser });

    } catch (error) {
        console.error('Error updating bio:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.put('/update-balance', authMiddleware, async (req, res) => {
    try {
        const { balance } = req.body;

        if (balance === undefined || balance === null || typeof balance !== 'number') {
            return res.status(400).json({ msg: 'Invalid Balance' });
        }

        // Update the user's profile picture
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { balance },
            { new: true, select: '-password -profilePicture' } // Exclude password from response
        );

        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ msg: 'Balance updated successfully', user: updatedUser });

    } catch (error) {
        console.error('Error updating balance:', error);
        res.status(500).json({ msg: 'Server error' });
    }
})

router.get('/get-all-user-list', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.json(users);
    } catch (error) {
        console.error('Error fetching user list:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;
