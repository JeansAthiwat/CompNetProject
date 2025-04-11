import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a user by email
const getUser = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    const { select } = req.query; // รับค่าจาก query parameter
    
    try {
        // สร้าง query ให้รองรับการเลือก field
        const fields = select ? select.split(',').join(' ') : ''; // แปลงเป็นรูปแบบที่ Mongoose ใช้
        const user = await User.findOne({ _id: id }).select(fields); // ใช้ .select() เพื่อดึงเฉพาะ field ที่ระบุ

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Create a new user
const createUser = async (req, res) => {
    const userData = req.body;
    try {
        const today = new Date().toISOString().split("T")[0];
        if (!userData.birthdate || userData.birthdate > today) {
            return res.status(400).json({ message: 'Invalid birthdate: Cannot be in the future.' });
        }


        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const newUser = new User(userData);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a user by email
const updateUser = async (req, res) => {
    const { email } = req.params;
    const updateData = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate({ email }, updateData, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a user by email
const deleteUser = async (req, res) => {
    const { email } = req.params;

    try {
        const deletedUser = await User.findOneAndDelete({ email });
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAllUsers = async (req, res) => {
    try {
        const result = await User.deleteMany({}); // ✅ Deletes all users
        res.status(200).json({ message: `Successfully deleted ${result.deletedCount} users` });
    } catch (error) {
        console.error("❌ Error deleting users:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { getAllUsers, getUser, createUser, updateUser, deleteUser, deleteAllUsers, getUserById };