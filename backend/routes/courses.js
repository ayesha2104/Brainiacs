import express from 'express';
import Course from '../models/Course.js';
import { protect as auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all courses
router.get('/', auth, async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific course
router.get('/:id', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a course
router.post('/', auth, async (req, res) => {
    const course = new Course({
        title: req.body.title,
        description: req.body.description,
        instructor: req.body.instructor,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    });

    try {
        const newCourse = await course.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a course
router.patch('/:id', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (req.body.title) course.title = req.body.title;
        if (req.body.description) course.description = req.body.description;
        if (req.body.instructor) course.instructor = req.body.instructor;
        if (req.body.startDate) course.startDate = req.body.startDate;
        if (req.body.endDate) course.endDate = req.body.endDate;

        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a course
router.delete('/:id', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        await course.deleteOne();
        res.json({ message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router; 