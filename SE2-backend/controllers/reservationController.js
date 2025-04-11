import Reservation from '../models/reservationModel.js'
import Course from '../models/courseModel.js';
import moment from 'moment-timezone';
import User from '../models/userModel.js'
import Notification from "../models/notificationModel.js";
import {createNotification} from './notificationController.js'

//@desc     Get all reservations
//@route    GET /reservation
//@access   Private
const getReservations = async (req, res) => {
    let query;
    let filter = {};

    if (req.user.role === 'learner') {
        filter.learner = req.user.id;
        if(req.query.course) {
            filter.course = req.query.course;
        }
    } else if (req.user.role === 'tutor') {
        filter.tutor = req.user.id;
        if (req.params.courseId) {
            filter.course = req.params.courseId;
        } else if (req.query.course) {
            filter.course = req.query.course;
        }
    } else { // admin
        if (req.params.courseId) {
            filter.course = req.params.courseId;
        } else if (req.query.course) {
            filter.course = req.query.course;
        }
    }

    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);
    console.log(reqQuery);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Reservation.find(filter).populate({
        path: 'course',
        select: 'course_name price subject course_length course_type live_detail'
    });

    // Apply `select` fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Apply `sort` order
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt'); // Default sorting by creation date
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    try {
        const total = await Reservation.countDocuments(filter);
        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
            return res.status(400).json({ success: false, message: "Invalid page or limit value" });
        }

        if (startIndex < total) {
            query = query.skip(startIndex).limit(limit);
        }

        const reservations = await query;

        const pagination = {};
        if (startIndex + limit < total) {
            pagination.next = { page: page + 1, limit };
        }
        if (startIndex > 0) {
            pagination.prev = { page: page - 1, limit };
        }

        res.status(200).json({ success: true, count: reservations.length, pagination, data: reservations });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Cannot find Reservations" });
    }
};

//@desc     Get Weekly reservation
//@route    GET /reservation/weekly
//@access   Private
const getWeeklyReservations = async (req, res) => {
    try {
        let query;
        const startOfWeek = moment().startOf('isoWeek').toDate(); // วันจันทร์ของสัปดาห์
        const endOfWeek = moment().endOf('isoWeek').toDate(); // วันอาทิตย์ของสัปดาห์

        if (req.user.role === 'learner') {
            query = Reservation.find({ learner: req.user.id }).populate({
                path: 'course',
                match: { 
                    course_type: 'Live',
                    'live_detail.start_time': { $gte: startOfWeek, $lte: endOfWeek } 
                },
                select: 'course_name price subject course_length course_type live_detail.start_time'
            });
        } else if (req.user.role === 'tutor') {
            query = Reservation.find({ tutor: req.user.id }).populate({
                path: 'course',
                match: { 
                    course_type: 'Live',
                    'live_detail.start_time': { $gte: startOfWeek, $lte: endOfWeek }
                },
                select: 'course_name price subject course_length course_type live_detail.start_time'
            });
        } else { // admin
            query = Reservation.find().populate({
                path: 'course',
                match: { 
                    course_type: 'Live',
                    'live_detail.start_time': { $gte: startOfWeek, $lte: endOfWeek }
                },
                select: 'course_name price subject course_length course_type live_detail.start_time'
            });
        }

        const reservations = await query;

        // กรองออกเนื่องจาก `.populate().match()` อาจยังดึงข้อมูลที่ `null` มา
        const filteredReservations = reservations.filter(r => r.course !== null);

        res.status(200).json({
            success: true,
            count: filteredReservations.length,
            data: filteredReservations
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Cannot find Reservations" });
    }
};

//@desc     Get reservation
//@route    GET /reservation/:id
//@access   Private
const getReservation = async (req,res)=>{
    let query;

    if(req.user.role === 'learner'){
        query = Reservation.find({_id:req.params.id, learner:req.user.id}).populate({
            path: 'course',
            select: 'course_name price subject course_length course_type'
        })
    }else if(req.user.role === 'tutor'){
        query=Reservation.find({_id:req.params.id,tutor:req.user.id}).populate({
            path: 'course',
            select: 'course_name price subject course_length course_type'
        });
    }else{  //admin
        query=Reservation.find({_id:req.params.id}).populate({
            path: 'course',
            select: 'course_name price subject course_length course_type'  
        })
    }
  
    try{
        const reservations= await query;
        res.status(200).json({
            success:true,
            count: reservations.length,
            data: reservations
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Reservations"});
    }

}

//@desc     Create reservation
//@route    POST /reservation
//@access   Private
const createReservation = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const learnerId = req.user.id;
        // Find the course to be reserved
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await Course.findByIdAndUpdate(courseId, { $inc: { reservation_count: 1 } }, { runValidators: true });

        // Check if learner already reserved this course
        const existingReservation = await Reservation.findOne({
            learner: learnerId,
            course: courseId
        });

        if (existingReservation) {
            return res.status(400).json({ message: 'You have already reserved this course' });
        }

        // Fetch the learner's balance
        const learner = await User.findById(learnerId);
        if (!learner) {
            return res.status(404).json({ message: 'Learner not found' });
        }

        // Check if learner has enough balance
        if (learner.balance < course.price) {
            return res.status(400).json({ message: 'Insufficient balance to reserve this course' });
        }

        // Deduct the course price from the learner's balance
        learner.balance -= course.price;
        await learner.save();

        

        // Determine payment date
        let paymentDate = new Date();
        if (course.course_type === 'Live') {
            if (!course.live_detail || !course.live_detail.start_time) {
                return res.status(400).json({ message: 'Live course details are incomplete' });
            }
            paymentDate = new Date(course.live_detail.start_time);
            paymentDate.setDate(paymentDate.getDate() + 1); // Payment due 1 day after the live session starts
        }

        // Create new reservation
        const newReservation = new Reservation({
            learner: learnerId,
            tutor: course.tutor,
            course: courseId,
            status: 'pending',
            price: course.price,
            payment_date: paymentDate
        });

        await newReservation.save();

        // If course type is Video, process payment immediately
        if (course.course_type === 'Video') {
            req.params.id = newReservation._id; // Set reservation ID for updatePayment
            await updatePayment(req, res); // Call updatePayment immediately
            const newNotification = new Notification({
                user_id: learnerId,
                price: course.price,
                course_id: courseId,
                payment_date: paymentDate,
                payment_id: newReservation._id,
                status: "paid",
                is_live: false,
                message: `Your payment for ${course.course_name} is successful`,
                send_at: paymentDate
            });
            console.log("Create Noti for Video!!!",newNotification)
            await newNotification.save();
            return; 
        }

        if (course.course_type === "Live"){
            const start_time = course.live_detail.start_time
            const end_time = start_time.setDate(start_time.getDate() + course.course_length)
            const newNotification = new Notification({
                user_id: learnerId,
                price: course.price,
                course_id: courseId,
                payment_date: paymentDate,
                payment_id: newReservation._id,
                status: "paid",
                is_live: true,
                start_time: start_time,
                end_time: end_time,
                message: `Your payment for ${course.course_name} is successful`,
                send_at: paymentDate
            });
            console.log("Create Noti for Video!!!",newNotification)
            await newNotification.save();
            return res.status(201).json({ message: 'Reservation created successfully', reservation: newReservation });
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//@desc     Update payment for a reservation
//@route    PUT /reservation/:id/payment
//@access   Private
const updatePayment = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the reservation by ID
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        if (reservation.status !== 'pending') {
            return res.status(400).json({ message: 'Payment can only be processed for pending reservations' });
        }

        // Check if the current date is past the payment date
        if (new Date() < reservation.payment_date) {
            return res.status(400).json({ message: 'Payment is not yet due' });
        }

        const { tutor, price } = reservation;

        // Fetch the tutor object
        const tutorUser = await User.findById(tutor);
        if (!tutorUser) {
            return res.status(404).json({ message: 'Tutor not found' });
        }

        // Add the course price to the tutor's balance
        tutorUser.balance += price;
        await tutorUser.save();

        // Update reservation status to 'completed'
        reservation.status = 'complete';
        await reservation.save();

        const course = await Course.findById(reservation.course)
        const newNotification = new Notification({
            user_id: course.tutor,
            price: course.price,
            course_id: course._id,
            payment_date: Date.now(),
            payment_id: reservation._id,
            status: "paid",
            message: `Your payment for the course "${course.course_name}" has been successfully processed. The amount of ${course.price} has been added to your balance.`,
            send_at: Date.now()
        });
        
        await newNotification.save()

        res.status(200).json({ message: 'Payment updated successfully', reservation });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


//@desc     Update reservation
//@route    PUT /reservation
//@access   Private
const updateReservation = async (req,res)=>{
    try {
        const { id } = req.params; // รับ reservation ID จาก URL
        const updates = req.body; // ข้อมูลที่ต้องการอัปเดต
        const userId = req.user.id; // ดึง ID ของ user ที่ล็อกอินอยู่

        // ค้นหา Reservation ที่มี ID ตรงกับที่ส่งมา และ learner ต้องเป็น user ที่ล็อกอินอยู่
        const reservation = await Reservation.findOne({ _id: id, learner: userId });

        if (!reservation) {
            return res.status(403).json({ message: "Unauthorized: You can only update your own reservations." });
        }

        // อัปเดตข้อมูล
        const updatedReservation = await Reservation.findByIdAndUpdate(id, updates, { new: true });

        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params; // รับ reservation ID จาก URL
        const userId = req.user.id; // ดึง ID ของ user ที่ล็อกอินอยู่

        // ค้นหา Reservation ที่มี ID ตรงกับที่ส่งมา และ learner ต้องเป็น user ที่ล็อกอินอยู่
        const reservation = await Reservation.findOne({ _id: id, learner: userId });

        if (!reservation) {
            return res.status(403).json({ message: "Unauthorized: You can only delete your own reservations." });
        }

        // ลบ reservation
        await Reservation.findByIdAndDelete(id);

        res.status(200).json({ message: "Reservation deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {getReservations, getWeeklyReservations, getReservation, createReservation, updateReservation, deleteReservation, updatePayment};

