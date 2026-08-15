import express from 'express';
import {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    unenrollFromCourse,
    getCourseStudents,
    getCourseSchedule,
    updateCourseSchedule,
    updateCourseProgress,
    updateHoursSpent,
} from '../controllers/courseController.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();
const teacherOrAdmin = requireRole('teacher', 'admin');

// Base routes
router.route('/')
    .get(auth, getCourses)
    .post(auth, teacherOrAdmin, createCourse);

router.route('/:id')
    .get(auth, getCourseById)
    .put(auth, teacherOrAdmin, updateCourse)
    .delete(auth, teacherOrAdmin, deleteCourse);

// Enrollment routes
router.route('/:id/enroll')
    .post(auth, enrollInCourse)
    .delete(auth, unenrollFromCourse);

// Roster route
router.get('/:id/students', auth, teacherOrAdmin, getCourseStudents);

// Schedule routes
router.route('/:id/schedule')
    .get(auth, getCourseSchedule)
    .put(auth, teacherOrAdmin, updateCourseSchedule);

// Progress routes
router.route('/:id/progress')
    .put(auth, updateCourseProgress);

// Hours spent routes
router.route('/:id/hours')
    .put(auth, updateHoursSpent);

export default router;
