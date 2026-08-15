import Course from '../models/Course.js';
import expressAsyncHandler from 'express-async-handler';
import { paginate } from '../utils/pagination.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
export const getCourses = expressAsyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };
    if (req.query.mine === 'true') filter.teacher = req.user._id;
    if (req.query.enrolled === 'true') filter.enrolledStudents = req.user._id;

    const [courses, total] = await Promise.all([
        Course.find(filter).skip(skip).limit(limit),
        Course.countDocuments(filter),
    ]);

    res.status(200).json({ data: courses, page, limit, total, totalPages: Math.ceil(total / limit) });
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
        endDate,
        tags,
        icon,
    } = req.body;

    const course = await Course.create({
        title,
        description,
        endDate,
        instructor,
        startDate,
        tags,
        icon,
        teacher: req.user.role === 'teacher' ? req.user._id : undefined,
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

// @desc    Enroll the current user in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student)
export const enrollInCourse = expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    const alreadyEnrolled = course.enrolledStudents.some(
        (studentId) => studentId.toString() === req.user._id.toString()
    );

    if (!alreadyEnrolled) {
        course.enrolledStudents.push(req.user._id);
        await course.save();
    }

    res.status(200).json({ enrolled: true, enrolledStudents: course.enrolledStudents });
});

// @desc    Unenroll the current user from a course
// @route   DELETE /api/courses/:id/enroll
// @access  Private (Student)
export const unenrollFromCourse = expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    course.enrolledStudents = course.enrolledStudents.filter(
        (studentId) => studentId.toString() !== req.user._id.toString()
    );
    await course.save();

    res.status(200).json({ enrolled: false, enrolledStudents: course.enrolledStudents });
});

// @desc    Get the real enrolled-student roster for a course
// @route   GET /api/courses/:id/students
// @access  Private (Teacher/Admin)
export const getCourseStudents = expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id).populate('enrolledStudents', 'name email');

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    res.status(200).json(course.enrolledStudents);
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