import mongoose, {Schema} from 'mongoose';

const adminSchema = new Schema({
    email: {
        type:String,
        required: [true, 'An email is required'],
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address']
    },
    phone_number: {
        type:String, // 0x-xxxxxxxx ?
        required: true
    }
})

export default mongoose.model('Admin',adminSchema);