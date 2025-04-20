import express from 'express';
import { signupUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/signup
router.post('/signup', signupUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

export default router;
