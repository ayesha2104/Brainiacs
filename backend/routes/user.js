import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route
router.get('/dashboard', protect, (req, res) => {
  res.json({ message: `Welcome, User ID: ${req.user.id}` });
});

export default router;
