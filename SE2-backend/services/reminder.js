import cron from 'node-cron';
import Reservation from '../models/reservationModel.js';
import Course from '../models/courseModel.js';
import Notification from '../models/notificationModel.js';

console.log('🔄 Reminder system is running...');

cron.schedule('* * * * *', async () => {
    console.log('🔄 Checking reservations for reminder update...');
    try {
        const now = new Date();
        // Set to track tutor-course pairs that already got a notification in this run
        const notifiedTutorCourses = new Set();

        // Find all reservations with status "pending"
        const reservations = await Reservation.find({ status: 'pending' });

        for (const reservation of reservations) {
            // Get course details
            const course = await Course.findById(reservation.course);
            console.log(`✅ Checking reservation ${reservation._id} for reminder`);

            if (course && course.live_detail && course.live_detail.start_time) {
                const startTime = course.live_detail.start_time;
                // Calculate one hour before the course start time
                const oneHourBeforeStart = new Date(startTime.getTime() - 60 * 60 * 1000);

                // Check if current time is between one hour before start and the start time,
                // and that we haven't already processed this reservation
                if (now >= oneHourBeforeStart && now < startTime && !reservation.logged) {
                    // Build the message including course name and location
                    const message = `Reminder: Your course "${course.course_name}" at ${course.live_detail.location} is starting in one hour.`;

                    // Create notification for the student (learner)
                    const studentNotification = new Notification({
                        user_id: reservation.learner,
                        price: reservation.price,
                        course_id: reservation.course,
                        payment_id: `reminder-learner-${reservation._id}`,
                        status: 'reminder',
                        is_live: course.course_type === 'Live',
                        start_time: startTime,
                        message: message,
                        send_at: oneHourBeforeStart
                    });
                    await studentNotification.save();

                    // For the tutor, ensure only one notification per course
                    const tutorKey = `${reservation.tutor.toString()}-${reservation.course.toString()}`;
                    if (!notifiedTutorCourses.has(tutorKey)) {
                        const tutorNotification = new Notification({
                            user_id: reservation.tutor,
                            price: reservation.price,
                            course_id: reservation.course,
                            payment_id: `reminder-tutor-${reservation._id}`,
                            status: 'reminder',
                            is_live: course.course_type === 'Live',
                            start_time: startTime,
                            message: message,
                            send_at: oneHourBeforeStart
                        });
                        await tutorNotification.save();
                        notifiedTutorCourses.add(tutorKey);
                    }

                    // Mark the reservation as logged so that no duplicate reminders are created
                    reservation.logged = true;
                    await reservation.save();
                }
            }
        }
    } catch (error) {
        console.error('❌ Error processing reminder:', error);
    }
});

export default cron;
