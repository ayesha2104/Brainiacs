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
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Base routes
router.route('/')
    .get(protect, getCourses)
    .post(protect, admin, createCourse);

router.route('/:id')
    .get(protect, getCourseById)
    .put(protect, admin, updateCourse)
    .delete(protect, admin, deleteCourse);

// Schedule routes
router.route('/:id/schedule')
    .get(protect, getCourseSchedule)
    .put(protect, admin, updateCourseSchedule);

// Progress routes
router.route('/:id/progress')
    .put(protect, updateCourseProgress);

// Hours spent routes
router.route('/:id/hours')
    .put(protect, updateHoursSpent);

export default router; 