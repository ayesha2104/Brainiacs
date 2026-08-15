import express from 'express';
import {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseSchedule,
    updateCourseSchedule,
    updateCourseProgress,
    updateHoursSpent,
} from '../controllers/courseController.js';
import auth, { admin } from '../middleware/auth.js';

const router = express.Router();

// Base routes
router.route('/')
    .get(auth, getCourses)
    .post(auth, admin, createCourse);

router.route('/:id')
    .get(auth, getCourseById)
    .put(auth, admin, updateCourse)
    .delete(auth, admin, deleteCourse);

// Schedule routes
router.route('/:id/schedule')
    .get(auth, getCourseSchedule)
    .put(auth, admin, updateCourseSchedule);

// Progress routes
router.route('/:id/progress')
    .put(auth, updateCourseProgress);

// Hours spent routes
router.route('/:id/hours')
    .put(auth, updateHoursSpent);

export default router; 