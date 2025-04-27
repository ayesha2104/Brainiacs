import express from 'express';
import { authMiddleware, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all homework (accessible to all authenticated users)
router.get('/', async (req, res) => {
  try {
    // Implementation will be added later
    res.json({ message: 'Homework endpoint' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create homework (only for teachers and admins)
router.post('/', checkRole(['TEACHER', 'ADMIN']), async (req, res) => {
  try {
    // Implementation will be added later
    res.json({ message: 'Create homework endpoint' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 