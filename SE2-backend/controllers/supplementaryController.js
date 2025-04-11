import mongoose from 'mongoose';
import Supplementary from '../models/supplementaryModel.js'; // Adjust the path to your model
import Course from '../models/courseModel.js'; // Import the Course model to check course.tutor

// Get all supplementary files for a specific course
const getAllSupplementary = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Fetch all supplementary files for the course
        const supplementaryFiles = await Supplementary.find({ course: courseId });
        res.status(200).json({
            success: true,
            count: supplementaryFiles.length,
            data: supplementaryFiles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch supplementary files",
            error: error.message
        });
    }
};

// Get a single supplementary file by ID for a specific course
const getSupplementary = async (req, res) => {
    try {
        const { courseId, id } = req.params;

        // Find the supplementary file
        const supplementaryFile = await Supplementary.findOne({
            _id: id,
            course: courseId
        });

        if (!supplementaryFile) {
            return res.status(404).json({
                success: false,
                message: "Supplementary file not found"
            });
        }

        res.status(200).json({
            success: true,
            data: supplementaryFile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch supplementary file",
            error: error.message
        });
    }
};

// Create a supplementary file for a specific course
const createSupplementary = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { data, contentType, fileName } = req.body;

        // Create the supplementary file
        const supplementaryFile = await Supplementary.create({
            course: courseId,
            data,
            contentType,
            fileName
        });

        res.status(201).json({
            success: true,
            message: "Supplementary file created successfully",
            data: supplementaryFile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create supplementary file",
            error: error.message
        });
    }
};

// Update a supplementary file by ID for a specific course
const updateSupplementary = async (req, res) => {
    try {
        const { courseId, id } = req.params;
        const { data, contentType, fileName } = req.body;
        const userId = req.user_id; // Assuming req.user_id contains the logged-in user's ID
        const userRole = req.user_role; // Assuming req.user_role contains the logged-in user's role

        // Find the course to check if the logged-in user is the tutor
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check if the logged-in user is the tutor of the course or an admin
        if (course.tutor.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this supplementary file"
            });
        }

        // Update the supplementary file
        const updatedSupplementary = await Supplementary.findOneAndUpdate(
            { _id: id, course: courseId },
            { data, contentType, fileName },
            { new: true, runValidators: true }
        );

        if (!updatedSupplementary) {
            return res.status(404).json({
                success: false,
                message: "Supplementary file not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Supplementary file updated successfully",
            data: updatedSupplementary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update supplementary file",
            error: error.message
        });
    }
};

// Delete a supplementary file by ID for a specific course
const deleteSupplementary = async (req, res) => {
    try {
        const { courseId, id } = req.params;
        const userId = req.user_id; // Assuming req.user_id contains the logged-in user's ID
        const userRole = req.user_role; // Assuming req.user_role contains the logged-in user's role

        // Find the course to check if the logged-in user is the tutor
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check if the logged-in user is the tutor of the course or an admin
        if (course.tutor.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this supplementary file"
            });
        }

        // Delete the supplementary file
        const deletedSupplementary = await Supplementary.findOneAndDelete({
            _id: id,
            course: courseId
        });

        if (!deletedSupplementary) {
            return res.status(404).json({
                success: false,
                message: "Supplementary file not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Supplementary file deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete supplementary file",
            error: error.message
        });
    }
};

export {getAllSupplementary,getSupplementary,createSupplementary,updateSupplementary,deleteSupplementary};