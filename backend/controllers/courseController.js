import Course from '../models/Course.js';
import expressAsyncHandler from 'express-async-handler';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
export const getCourses = expressAsyncHandler(async (req, res) => {
    const courses = await Course.find();
    res.status(200).json(courses);
});

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Private
export const getCourseById = expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }
    res.status(200).json(course);
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin)
export const createCourse = expressAsyncHandler(async (req, res) => {
    const {
        title,
        description,
        instructor,
        startDate,
        tags,
        icon,
    } = req.body;

    const course = await Course.create({
        title,
        description,
        instructor,
        startDate,
        tags,
        icon,
    });

    res.status(201).json(course);
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
export const updateCourse = expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedCourse);
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
export const deleteCourse = expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    await course.deleteOne();
    res.status(200).json({ message: 'Course removed' });
});

// @desc    Get course schedule
// @route   GET /api/courses/:id/schedule
// @access  Private
export const getCourseSchedule = expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    res.status(200).json(course.schedule);
});

// @desc    Update course schedule
// @route   PUT /api/courses/:id/schedule
// @access  Private (Admin)
export const updateCourseSchedule = expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    course.schedule = req.body.schedule;
    await course.save();

    res.status(200).json(course.schedule);
});

// @desc    Update course progress
// @route   PUT /api/courses/:id/progress
// @access  Private
export const updateCourseProgress = expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    course.progress = req.body.progress;
    await course.save();

    res.status(200).json({ progress: course.progress });
});

// @desc    Update hours spent
// @route   PUT /api/courses/:id/hours
// @access  Private
export const updateHoursSpent = expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    course.hoursSpent = new Map(Object.entries(req.body.hoursSpent));
    await course.save();

    res.status(200).json({ hoursSpent: Object.fromEntries(course.hoursSpent) });
}); 