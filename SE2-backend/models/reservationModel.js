import mongoose, { Schema } from 'mongoose';

const ReservationSchema = new mongoose.Schema({
    learner:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: true
    },
    tutor:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: true
    },
    course:{
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        require: true
    },
    createAt:{
        type: Date,
        default: Date.now
    },
    status:{
        type: String, enum:['pending','complete','fail'],
        require: true
    },
    price:{
        type: Number,
        require: true
    },
    payment_date:{
        type: Date,
        default: Date.now
    },
    logged: {  // New flag field to ensure log is done only once
        type: Boolean,
        default: false
    }
});

export default mongoose.model("Reservation", ReservationSchema);