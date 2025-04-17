import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'A username is required'],
        unique: [true, 'This username is already taken'],
    },
    password: { 
        type: String, 
        required: [true, 'A password is required']
    },
    displayName: {
        type: String,
        required: true,
    },
    avatarIndex: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// 🔥 Prevent hashing if password is null (Google users)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next(); 
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// ✅ Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);