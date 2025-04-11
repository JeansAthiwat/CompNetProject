import mongoose from 'mongoose';
const { Schema } = mongoose;

const courseSchema = new Schema({
    tutor:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: true
    },
    course_name: {
        type: String,
        required: true,
        maxLength: [64, 'Course name must be under 64 characters']
    },
    subject: {
        type: String,
        maxLength: [128, "Course's subject must be under 128 characters"]
    },
    course_description: {
        type: String,
        maxLength: [1024, 'Course description must be under 1024 characters'] // Fixed typo from "maxLengtj"
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Course's price must be between 0-99999999.99 baht"],
        max: [99999999.99, "Course's price must be between 0-99999999.99 baht"]
    },
    course_length: {
        type: Number,
        required: true,
        min: [0, 'Course length must be between 0-999.99 hours'],
        max: [999.99, 'Course length must be between 0-999.99 hours']
    },
    reservation_count: {
        type: Number,
        default: 0,
        validate: {
                validator: Number.isInteger,
                message: 'Reservation count must be an integer',
            }
    },
    course_capacity: {
        type: Number, // Changed from `Schema.Types.Int32` (Mongoose doesn't support Int32)
        required: true,
        min: [1, 'Course capacity must be higher than 0'],
        validate: {
            validator: Number.isInteger,
            message:'Course capacity must be an integer'
        } // Validate int this way instead
    },
    session_status: {
        type: String,
        required: true,
        enum: {
            values: ['Schedule', 'Ongoing', 'Closed', 'TutorConfirm'],
            message: "Invalid session status. Allowed values are ['Schedule', 'Ongoing', 'Closed', 'TutorConfirm']. Get {VALUE}"
        }
    },
    created_date: { //This just store createdAt timestamp
        type: Date
    },
    is_publish: {
        type: Boolean,
        required: true
    },
    course_type: {
        type: String,
        required: true,
        enum: {
            values: ['Live', 'Video'],
            message: "Invalid course type. Allowed values are ['Live', 'Video']. Get {VALUE}"
        }
    },
    t_email: {
        type: String,
        required: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address']
    },
    tags: {
        type: [String],
        // enum: {
        //     values: ['Math', 'Science', 'Language', 'Social', 'Music & Arts'],
        //     message: "Invalid tag. Allowed values are ['Math', 'Science', 'Language', 'Social', 'Music & Arts']"
        // }
    },
    live_detail: {
        location: {
            type: String
        },
        start_time: {
            type: Date 
        }
    },
    videos: [{
        video_id: {
            type: String
        },
        video_title: {
            type: String
        },
        video_urls: {
            type: String
        },
        created_date: {
            type: Date,
            default: Date.now
        }
    }],
    // NEW: supplementary file storage
    supplementary_file: {
        data: Buffer,
        contentType: String,
        fileName: String,
    },
    ratings: {
        average: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
    },
    course_profile: {
        type: String,
        default:"https://d138zd1ktt9iqe.cloudfront.net/media/seo_landing_files/file-teaching-skills-1605625101.jpg"
    }
    
},{ 
    timestamps: {createdAt: 'created_date'},
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

courseSchema.virtual('reservations',{
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'course',
    justOne: false
});

courseSchema.virtual('supplementary_files',{
    ref: 'Supplementary',
    localField: '_id',
    foreignField: 'course',
    justOne: false
});

// **Pre-save hook to enforce the reservation limit**
courseSchema.pre('save', function (next) {
    if (this.reservation_count > this.course_capacity) {
        return next(new Error('Reservation count cannot exceed course capacity'));
    }
    next();
});

// **Pre-update hook to enforce the reservation limit in updates**
courseSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
    const update = this.getUpdate();
    if (update && update.$inc && update.$inc.reservation_count !== undefined) {
        const course = await this.model.findOne(this.getQuery());
        if (!course) return next(new Error('Course not found'));

        const newReservationCount = course.reservation_count + update.$inc.reservation_count;
        if (newReservationCount > course.course_capacity) {
            return next(new Error('Reservation count cannot exceed course capacity'));
        }
    }
    next();
});

export default mongoose.model("Course", courseSchema);