import User from '../models/userModel.js';

// Approve a tutor using email
const approveUser = async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email, role: 'tutor' }, // Ensure only tutors can be approved
            { verification_status: true },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Tutor not found or not a tutor' });
        }

        res.status(200).json({ message: 'Tutor approved successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a user using email
const deleteUser = async (req, res) => {
    const { email } = req.params;
    
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const deletedUser = await User.findOneAndDelete({ email });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { approveUser, deleteUser };
