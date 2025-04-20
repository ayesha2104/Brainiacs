import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route
router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({ message: `Welcome, User ID: ${req.user.id}` });
});

export default router;
