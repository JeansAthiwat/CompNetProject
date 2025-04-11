import mongoose, {Schema} from 'mongoose';
import validateEmail from '../utils/validateEmail.js';

//Combined enroll table and enrollment table, good? no?
const enrollmentSchema = new Schema({
    transaction_id: {
        type:Schema.Types.ObjectId,
        // required:true
    },
    course_id: {
        type:Schema.Types.ObjectId,
        required:true
    },
    l_email: {
        type:String,
        required:true,
        validate: {
            validator: validateEmail,
            message: 'Not a learner valid email'
        }
    },
    verify_date: { //Can't have verify date if not verified yet, correct?
        type:Date,
    },
    verify_status: {
        type:String,
        // required:true,
        enum: {
            values: ['Complete','Ongoing','Fail'],
            message: 'Invalid verify status'
        }
    },
    image_url: { //tf is this
        type:String,
        // required:true
    },
    a_email: { //Can't have the admin who verify if not verified yet, correct?
        type:String,
        validate: {
            validator: validateEmail,
            message: 'Not a valid admin email'
        }
    }
});

export default mongoose.model('Enrollment', enrollmentSchema);