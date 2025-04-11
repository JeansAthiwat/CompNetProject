import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'An email is required'],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address']
    },
    password: { 
        type: String, 
        required: function () { return !this.isGoogleUser; } // ✅ Only required for non-Google users
    },
    isGoogleUser: { type: Boolean, default: false }, // ✅ Flag to check if the user is from Google OAuth
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    birthdate: { type: Date, required: false },
    role: { type: String, enum: ['learner', 'tutor', 'admin', 'google_user'], default: 'google_user' },
    profilePicture: { 
        type: String,
        default: 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
    },
    phone: { type: String },
    bio: { type: String },

    balance: {
        type: Number,
        default: 0
    },

    // 🔹 Learner-Specific Fields
    learning_style: { type: [String], default: [] },
    interest: { type: [String], default: [] },

    // 🔹 Tutor-Specific Fields
    teaching_style: { type: [String], default: [] },
    educations: { type: [String], default: [] },
    specialization: { type: [String], default: [] },
    verification_status: { type: Boolean, default: false }

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
