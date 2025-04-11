import express from 'express'
import Enrollment from '../models/enrollmentModel.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, async (req,res) => {
    try {
        const enrollments = await Enrollment.find({l_email:req.user.email});
        res.status(200).json(enrollments);
    } catch(error) {
        res.status(500).json({ message: error.message});
    }
})

// enroll learner in the course with _id = cid
router.post('/:cid', authMiddleware, async (req, res) => {
    const enrollmentData = {course_id:req.params.cid, l_email:req.user.email}

    try {
        const newEnrollment = new Enrollment(enrollmentData)
        await newEnrollment.save()
        res.status(201).json(newEnrollment);
    } catch(error) {
        res.status(400).json({ message: error.message})
    }
})

export default router