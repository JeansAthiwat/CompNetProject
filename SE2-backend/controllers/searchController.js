import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
import Reservation from "../models/reservationModel.js";

export const search = async (req, res) => {
    try {
        const { query, category, sortBy, subject, courseType, page, limit } = req.query;
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 100;
        const startIndex = (pageNumber - 1) * limitNumber;

        let results = [];

        if (!category || !['tutor', 'course'].includes(category)) {
            return res.status(400).json({ error: "Invalid search category. Use 'tutor' or 'course'." });
        }

        // 🔹 Search Tutors
        if (category === "tutor") {
            let tutorQuery = { role: "tutor" };

            if (query) {
                const trimmedQuery = query.trim(); // ตัดช่องว่างที่ต่อท้าย input
                const queryParts = trimmedQuery.split(/\s+/); // แบ่งคำค้นหาด้วยช่องว่าง

                // สร้าง regex สำหรับค้นหาชื่อและนามสกุล
                const regexQueries = queryParts.map(part => new RegExp(`\\b${part}`, "i"));

                tutorQuery.$or = [
                    { firstname: { $in: regexQueries } },
                    { lastname: { $in: regexQueries } },
                    {
                        $and: queryParts.map((part, index) => ({
                            [index === 0 ? 'firstname' : 'lastname']: new RegExp(`\\b${part}`, "i")
                        }))
                    }
                ];
            }

            // Apply sorting for tutors
            let sortOptions = {};
            if (sortBy === "name") {
                sortOptions = { firstname: 1 }; // Sort by firstname ascending
            } else if (sortBy === "-name") {
                sortOptions = { firstname: -1 }; // Sort by firstname descending
            }

            const totalTutors = await User.countDocuments(tutorQuery);
            results = await User.find(tutorQuery)
                .select("firstname lastname specialization email profilePicture")
                .sort(sortOptions) // Apply sorting
                .skip(startIndex)
                .limit(limitNumber);

            const pagination = {};
            if (startIndex + limitNumber < totalTutors) {
                pagination.next = { page: pageNumber + 1, limit: limitNumber };
            }
            if (startIndex > 0) {
                pagination.prev = { page: pageNumber - 1, limit: limitNumber };
            }

            return res.json({ success: true, count: results.length, pagination, data: results });
        }

        // 🔹 Search Courses
        if (category === "course") {
            let courseQuery = { is_publish: true };

            if (query) {
                const trimmedQuery = query.trim(); // ตัดช่องว่างที่ต่อท้าย input
                const regexQuery = new RegExp(`\\b${trimmedQuery}`, "i"); // ใช้ trimmedQuery แทน query
                courseQuery.$or = [
                    { course_name: regexQuery },
                    { subject: regexQuery }
                ];
            }

            // Apply filters
            if (subject) {
                courseQuery.subject = new RegExp(`\\b${subject}`, "i");
            }
            if (courseType) {
                courseQuery.course_type = courseType;
            }

            // Apply sorting for courses
            let sortOptions = {};
            if (sortBy === "name") {
                sortOptions = { course_name: 1 }; // Sort by course_name ascending
            } else if (sortBy === "-name") {
                sortOptions = { course_name: -1 }; // Sort by course_name descending
            } else if (sortBy === "price") {
                sortOptions = { price: 1 }; // Sort by price ascending
            } else if (sortBy === "-price") {
                sortOptions = { price: -1 }; // Sort by price descending
            }

            const totalCourses = await Course.countDocuments(courseQuery);
            results = await Course.find(courseQuery)
                .select("course_name subject price course_type t_email")
                .sort(sortOptions) // Apply sorting
                .skip(startIndex)
                .limit(limitNumber);

            const pagination = {};
            if (startIndex + limitNumber < totalCourses) {
                pagination.next = { page: pageNumber + 1, limit: limitNumber };
            }
            if (startIndex > 0) {
                pagination.prev = { page: pageNumber - 1, limit: limitNumber };
            }

            return res.json({ success: true, count: results.length, pagination, data: results });
        }

        return res.status(400).json({ error: "Invalid category" });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const searchMyCourse = async (req,res) => {
    try{
        const {query,sortBy,subject,courseType,page,limit} = req.query;
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 100;
        const startIndex = (pageNumber - 1) * limitNumber;

        let results = [];

        //Search Course for Tutors
        if(req.user.role === 'tutor'){
            let courseQuery = {tutor: req.user.id,is_publish: true};

            if(query){
                const trimmedQuery = query.trim();
                const regexQuery = new RegExp(`\\b${trimmedQuery}`, "i");
                courseQuery.$or = [
                    { course_name: regexQuery },
                    { subject: regexQuery }
                ];
            }

            // Apply filters
            if (subject) {
                courseQuery.subject = new RegExp(`\\b${subject}`, "i");
            }
            if (courseType) {
                courseQuery.course_type = courseType;
            }
            // Apply sorting for courses
            let sortOptions = {};
            if (sortBy === "name") {
                sortOptions = { course_name: 1 }; // Sort by course_name ascending
            } else if (sortBy === "-name") {
                sortOptions = { course_name: -1 }; // Sort by course_name descending
            } else if (sortBy === "price") {
                sortOptions = { price: 1 }; // Sort by price ascending
            } else if (sortBy === "-price") {
                sortOptions = { price: -1 }; // Sort by price descending
            }

            const totalCourses = await Course.countDocuments(courseQuery);
            results = await Course.find(courseQuery)
                .select("course_name subject price course_type t_email")
                .sort(sortOptions) // Apply sorting
                .skip(startIndex)
                .limit(limitNumber);

            const pagination = {};
            if (startIndex + limitNumber < totalCourses) {
                pagination.next = { page: pageNumber + 1, limit: limitNumber };
            }
            if (startIndex > 0) {
                pagination.prev = { page: pageNumber - 1, limit: limitNumber };
            }
            return res.json({ success: true, count: results.length, pagination, data: results });
            
        }

        if (req.user.role === 'learner'){
            //Fetch reservations for the learner
            const reservations = await Reservation.find({learner:req.user.id}).select('course');
            //Extract course IDs from reservations
            const courseIds = reservations.map(reservation => reservation.course);

            let courseQuery = {_id: {$in: courseIds}};

            if (query) {
                const trimmedQuery = query.trim();
                const regexQuery = new RegExp(`\\b${trimmedQuery}`, "i");
                courseQuery.$or = [
                    { course_name: regexQuery },
                    { subject: regexQuery }
                ];
            }

            // Apply filters
            if (subject) {
                courseQuery.subject = new RegExp(`\\b${subject}`, "i");
            }
            if (courseType) {
                courseQuery.course_type = courseType;
            }

            // Apply sorting for courses
            let sortOptions = {};
            if (sortBy === "name") {
                sortOptions = { course_name: 1 }; // Sort by course_name ascending
            } else if (sortBy === "-name") {
                sortOptions = { course_name: -1 }; // Sort by course_name descending
            } else if (sortBy === "price") {
                sortOptions = { price: 1 }; // Sort by price ascending
            } else if (sortBy === "-price") {
                sortOptions = { price: -1 }; // Sort by price descending
            }

            const totalCourses = await Course.countDocuments(courseQuery);
            results = await Course.find(courseQuery)
                .select("course_name subject price course_type t_email")
                .sort(sortOptions) // Apply sorting
                .skip(startIndex)
                .limit(limitNumber);

            const pagination = {};
            if (startIndex + limitNumber < totalCourses) {
                pagination.next = { page: pageNumber + 1, limit: limitNumber };
            }
            if (startIndex > 0) {
                pagination.prev = { page: pageNumber - 1, limit: limitNumber };
            }
            return res.json({ success: true, count: results.length, pagination, data: results });
        }
       
    }catch(err){
        console.error("Search error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}