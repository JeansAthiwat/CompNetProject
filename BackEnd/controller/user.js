import User from '../model/userModel.js'

export const getUser = async (req, res) => {
    try {
      const { uid } = req.user; // assumes auth middleware has set req.user
      const user = await User.findById(uid); // Correct method is findById, not findByID
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json({
        message: 'User fetched successfully',
        user: {
          id: user._id,
          username: user.username,
          displayName: user.displayName,
          avatarIndex: user.avatarIndex
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

  export const editProfile = async (req, res) => {
    try {
      const { uid } = req.user; // assumes auth middleware has set req.user
      const { displayName, avatarIndex } = req.body
      const user = await User.findByIdAndUpdate(uid,{displayName, avatarIndex});
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({
        message: 'User updated successfully',
        user: {
          id: user._id,
          username: user.username,
          displayName: user.displayName,
          avatarIndex: user.avatarIndex
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  }