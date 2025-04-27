import express from 'express';
import { createUser, getUserProfile, updateUserProfile, getUserCourses, getUserHomework } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', createUser);

// Protected routes
router.use(authMiddleware);

// Get user profile
router.get('/profile/:id', getUserProfile);

// Update user profile
router.put('/profile/:id', updateUserProfile);

// Get user's courses
router.get('/:id/courses', getUserCourses);

// Get user's homework
router.get('/:id/homework', getUserHomework);

export default router; 