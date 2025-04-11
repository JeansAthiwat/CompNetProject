import Course from '../models/courseModel.js';
import mongoose from 'mongoose';
import moment from 'moment-timezone';

//Get all courses
const getAllCourses = async (req, res) => {
  let query;
  //Copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //Loop over remove fields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);
  console.log(reqQuery);

  //Create query string
  let queryStr = JSON.stringify(reqQuery);

  //Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  //finding resource
  query = Course.find(JSON.parse(queryStr)).populate('reservations');

  //Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');//Sort by created date
  }
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  console.log(page, limit, startIndex)
  try {
    // Get total count *without* pagination
    const total = await Course.countDocuments(JSON.parse(queryStr)); // Use the filtered queryStr

    // Validate page and limit
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return res.status(400).json({ success: false, message: "Invalid page or limit value" });
    }

    // Apply pagination
    query = query.skip(startIndex).limit(limit);

    // Execute query
    const courses = await query;

    // Pagination result  
    const pagination = {};
    if (startIndex + limit < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }
    res.status(200).json({ success: true, count: courses.length, pagination, data: courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Get a course by ID
const getCourse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }
  try {
    const course = await Course.findById(id).populate('reservations', 'supplementary_files');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCourse = async (req, res) => {
  const courseData = req.body;

  // If the 'tags' field was sent as a JSON string, parse it
  if (courseData.tags && typeof courseData.tags === 'string') {
    try {
      courseData.tags = JSON.parse(courseData.tags);
    } catch (err) {
      // If parsing fails, leave it as is or handle accordingly
    }
  }

  // If a supplementary file was uploaded, attach it to the course data
  if (req.file) {
    courseData.supplementary_file = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      fileName: req.file.originalname,
    };
  }

  try {
    const newCourse = new Course(courseData);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSupplementaryFile = async (req, res) => {
  const { id } = req.params;

  // Validate the course ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the supplementary file exists
    if (!course.supplementary_file || !course.supplementary_file.data) {
      return res.status(404).json({ message: "No supplementary file found" });
    }

    // Set headers to let the browser know about the file type and suggest a download filename
    res.set("Content-Type", course.supplementary_file.contentType);
    res.set("Content-Disposition", `attachment; filename="${course.supplementary_file.fileName}"`);

    // Send the file buffer as the response
    return res.send(course.supplementary_file.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Update a Course (Only if the tutor matches the JWT token owner)
const updateCourse = async (req, res) => {
  try {
      const userId = req.user.id; // Extract user ID from decoded JWT
      const role = req.user.role;
      const { id } = req.params;
      const updateData = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid course ID' });
      }

      // 🔹 Check if the course exists and belongs to the tutor
      const course = await Course.findById(id);
      if (!course) return res.status(404).json({ message: 'Course not found' });

      if (course.tutor.toString() !== userId  && role != 'admin') {
          return res.status(403).json({ message: 'Forbidden: You are not the tutor of this course' });
      }

      // 🔹 Update the course
      const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      res.status(200).json(updatedCourse);

  } catch (error) {
      res.status(500).json({ message: error.message }); // Handle errors
  }
};

// ✅ Delete a Course (Only if the tutor matches the JWT token owner)
const deleteCourse = async (req, res) => {
  try {
      const userId = req.user.id; // Extract user ID from decoded JWT
      const role = req.user.role;
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid course ID' });
      }

      // 🔹 Check if the course exists and belongs to the tutor
      const course = await Course.findById(id);
      if (!course) return res.status(404).json({ message: 'Course not found' });

      if (course.tutor.toString() !== userId && role != 'admin') {
          return res.status(403).json({ message: 'Forbidden: You are not the tutor of this course' });
      }

      // 🔹 Delete the course
      await Course.findByIdAndDelete(id);
      res.status(200).json({ message: 'Course deleted successfully' });

  } catch (error) {
      res.status(500).json({ message: error.message }); // Handle errors
  }
};

const getCoursesByTutorID = async (req, res) => {
  try {
    const { UID } = req.params;
    console.log(UID)

    const courses = await Course.find({ tutor: UID });

    // if (!courses.length) {
    //     return res.status(404).json({ message: "No courses found for this tutor." });
    // }
    console.log(`got tutor ID ${UID}`);

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching tutor courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getWeeklyCourses = async (req, res) => {
  try {
    // ดึง tutor_id จาก user ที่ login
    const tutorId = req.user.id;

    // หาวันเริ่มและสิ้นสุดของสัปดาห์ปัจจุบัน
    const startOfWeek = moment().startOf('isoWeek').toDate(); // จันทร์แรกของสัปดาห์
    const endOfWeek = moment().endOf('isoWeek').toDate(); // อาทิตย์สุดท้ายของสัปดาห์

    // Query คอร์ส
    const courses = await Course.find({
      tutor: tutorId,
      course_type: 'Live',
      'live_detail.start_time': { $gte: startOfWeek, $lte: endOfWeek }
    }).populate('reservations');

    res.status(200).json({ success: true, count: courses.length, data: courses });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export { getAllCourses, getCourse, createCourse, updateCourse, deleteCourse, getSupplementaryFile, getWeeklyCourses, getCoursesByTutorID };

